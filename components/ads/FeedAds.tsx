'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { adsWarn, getFeedPlacement, type FeedPlacement } from '@/lib/ads/feedPlacement';
import { loadReviveScript, requestReviveRefresh, reviveEvent } from '../../lib/ads/reviveLoader';

type FeedAdProps = { slotId: string };
type EnabledPlacement = Extract<FeedPlacement, { enabled: true }>;
type Status = 'pending' | 'filled' | 'empty';

const PREFETCH_MARGIN = '600px 0px'; // fetch config + script this far ahead of the viewport
const VIEW_RATIO = 0.5;              // ask Revive for the ad only once half the slot is on screen
const LOAD_TIMEOUT_MS = 6000;
const MAX_HEIGHT_RATIO = 0.85;       // never render taller than 85% of the viewport

export function FeedAd({ slotId }: FeedAdProps) {
    const boxRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const naturalRef = useRef<{ w: number; h: number } | null>(null);

    const [near, setNear] = useState(false);
    const [visible, setVisible] = useState(false);
    const [placement, setPlacement] = useState<EnabledPlacement | null>(null);
    const [status, setStatus] = useState<Status>('pending');

    // Scale the creative to the available width (never upscale), and reserve its height.
    const fit = useCallback(() => {
        const box = boxRef.current;
        const stage = stageRef.current;
        const natural = naturalRef.current;
        if (!box || !stage || !natural) return;

        const scale = Math.min(
            box.clientWidth / natural.w,
            (window.innerHeight * MAX_HEIGHT_RATIO) / natural.h,
            1,
        );
        stage.style.width = `${natural.w}px`;
        stage.style.height = `${natural.h}px`;
        stage.style.transform = `translateX(-50%) scale(${scale})`;
        box.style.height = `${Math.round(natural.h * scale)}px`;
    }, []);

    // 1) Close to the viewport: fetch the (shared, cached) placement and warm up Revive's script.
    //    No <ins> exists yet, so nothing is requested from Revive and no impression is logged.
    useEffect(() => {
        const box = boxRef.current;
        if (!box || near) return;
        if (typeof IntersectionObserver === 'undefined') {
            setNear(true);
            return;
        }
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setNear(true);
                    io.disconnect();
                }
            },
            { rootMargin: PREFETCH_MARGIN },
        );
        io.observe(box);
        return () => io.disconnect();
    }, [near]);

    useEffect(() => {
        if (!near) return;
        let cancelled = false;

        getFeedPlacement()
            .then((p) => {
                if (cancelled) return;
                if (!p.enabled) {
                    setStatus('empty');
                    return;
                }
                naturalRef.current = { w: p.width, h: p.height };
                setPlacement(p);
                loadReviveScript(p.scriptUrl).catch((err) => {
                    if (cancelled) return;
                    adsWarn(err);
                    setStatus('empty');
                });
            })
            .catch((err) => {
                if (cancelled) return;
                adsWarn(err);
                setStatus('empty');
            });

        return () => {
            cancelled = true;
        };
    }, [near]);

    useEffect(() => {
        if (placement) fit();
    }, [placement, fit]);

    // 2) Half on screen: only now ask Revive for the ad. Revive logs the impression when its
    //    markup is inserted, so this keeps impressions tied to ads that were actually seen.
    useEffect(() => {
        const box = boxRef.current;
        if (!box || !placement || visible) return;
        if (typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return;
        }
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.intersectionRatio >= VIEW_RATIO) {
                    setVisible(true);
                    io.disconnect();
                }
            },
            { threshold: [0, 0.25, 0.5, 0.75, 1] },
        );
        io.observe(box);
        return () => io.disconnect();
    }, [placement, visible]);

    // 3) Request the ad and wait for Revive's own "loaded" event to learn the outcome.
    useEffect(() => {
        const stage = stageRef.current;
        if (!visible || !placement || !stage) return;

        const loadedEvent = reviveEvent(placement.deliveryId, 'loaded');
        let done = false;
        let timer = 0;

        const finish = () => {
            done = true;
            window.clearTimeout(timer);
            document.removeEventListener(loadedEvent, onLoaded);
        };

        function onLoaded(event: Event) {
            const detail = (event as CustomEvent).detail as
                | { id?: string; data?: { width?: unknown; height?: unknown } }
                | undefined;
            const node = detail?.id ? document.getElementById(detail.id) : null;
            if (!node || !stage!.contains(node)) return; // another slot's response

            const w = Number(detail?.data?.width);
            const h = Number(detail?.data?.height);
            finish();

            if (!(w > 0) || !(h > 0)) {
                setStatus('empty'); // Revive had no eligible banner (it replies with an empty <a><img>)
                return;
            }
            naturalRef.current = { w, h };
            setStatus('filled');
            fit();
        }

        document.addEventListener(loadedEvent, onLoaded);
        timer = window.setTimeout(() => {
            if (done) return;
            finish();
            adsWarn('Revive did not answer in time for slot', slotId);
            setStatus('empty');
        }, LOAD_TIMEOUT_MS);

        // Revive's script finds this element on its next scan and replaces it with the ad.
        const ins = document.createElement('ins');
        ins.dataset.reviveZoneid = String(placement.zoneId);
        ins.dataset.reviveId = placement.deliveryId;
        ins.style.display = 'block';
        stage.appendChild(ins);

        loadReviveScript(placement.scriptUrl)
            .then(() => {
                if (!done) requestReviveRefresh(placement.deliveryId);
            })
            .catch((err) => {
                if (done) return;
                finish();
                adsWarn(err);
                setStatus('empty');
            });

        return () => {
            if (!done) finish();
            stage.replaceChildren(); // a late response now finds no element and is dropped
        };
    }, [visible, placement, slotId, fit]);

    useEffect(() => {
        const box = boxRef.current;
        if (!box || typeof ResizeObserver === 'undefined') return;
        const ro = new ResizeObserver(() => fit());
        ro.observe(box);
        return () => ro.disconnect();
    }, [fit]);

    // No ad must never break the organic feed.
    if (status === 'empty') return null;

    return (
        <div
            ref={boxRef}
            data-feed-ad-slot={slotId}
            aria-label="Sponsored content"
            className={`feed-ad-slot relative my-4 w-full overflow-hidden ${status === 'pending' ? 'bg-neutral-100' : ''}`}
            style={{ minHeight: 1 }}
        >
            <div
                ref={stageRef}
                className="absolute left-1/2 top-0"
                style={{ transformOrigin: 'top center', visibility: status === 'filled' ? 'visible' : 'hidden' }}
            />
            {status === 'filled' && (
                <span className="pointer-events-none absolute left-2 top-2 z-10 rounded bg-black/50 px-2 py-0.5 text-xs font-semibold text-white">
                    Sponsored
                </span>
            )}
        </div>
    );
}