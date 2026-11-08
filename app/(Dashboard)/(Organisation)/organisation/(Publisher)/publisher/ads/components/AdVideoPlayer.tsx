// components/AdVideoPlayer.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { ArrowUpRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { ReviveAdPayload } from '../types/ad';


interface AdVideoPlayerProps {
    ad: ReviveAdPayload;
    onAdEnded?: () => void;
    autoPlay?: boolean;
    isActive: boolean;
}

function pingTrackingUrls(urls?: string[]) {
    if (!urls?.length || typeof window === 'undefined') return;

    for (const url of urls) {
        try {
            // Revive tracking is GET-based; Image beacon is the reliable approach
            const img = new Image();
            img.src = url;
        } catch {
            // never break playback for analytics
        }
    }
}

export default function AdVideoPlayer({
    ad,
    onAdEnded,
    autoPlay = true,
    isActive,
}: AdVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [paused, setPaused] = useState(false);
    const [muted, setMuted] = useState(true);
    const [showCenterIcon, setShowCenterIcon] = useState(false);
    const hideIconTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fired = useRef({
        impression: false,
        start: false,
        firstQuartile: false,
        midpoint: false,
        thirdQuartile: false,
        complete: false,
    });
    const isPausedOverlay = paused;

    // Reset when a new ad is shown
    useEffect(() => {
        fired.current = {
            impression: false,
            start: false,
            firstQuartile: false,
            midpoint: false,
            thirdQuartile: false,
            complete: false,
        };

        // Test harness: impression when this ad mounts.
        // Later (in-feed): move this behind IntersectionObserver (~50% visible).
        if (ad.tracking.impression?.length) {
            pingTrackingUrls(ad.tracking.impression);
            fired.current.impression = true;
        }
    }, [ad.id, ad.videoUrl, ad.tracking.impression]);

    const flashCenterIcon = () => {
        setShowCenterIcon(true);
        if (hideIconTimer.current) clearTimeout(hideIconTimer.current);
        hideIconTimer.current = setTimeout(() => setShowCenterIcon(false), 600);
    };

    const togglePlayPause = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            // Finished (or frozen near the end) → watch again from the start
            const nearEnd =
                fired.current.complete ||
                (video.duration > 0 && video.currentTime >= video.duration * 0.95);

            if (nearEnd) {
                video.currentTime = 0;
                // optional: allow complete to fire again on a full rewatch
                // fired.current.complete = false;
            }

            void video.play();
            setPaused(false);
        } else {
            video.pause();
            setPaused(true);
        }
        flashCenterIcon();
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onPlay = () => setPaused(false);
        const onPause = () => setPaused(true);

        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);
        return () => {
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
        };
    }, [ad.videoUrl]);

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video || !video.duration) return;

        const progressPercent = (video.currentTime / video.duration) * 100;

        if (video.currentTime > 0 && !fired.current.start) {
            fired.current.start = true;
            pingTrackingUrls(ad.tracking.start);
        }
        if (progressPercent >= 25 && !fired.current.firstQuartile) {
            fired.current.firstQuartile = true;
            pingTrackingUrls(ad.tracking.firstQuartile);
        }
        if (progressPercent >= 50 && !fired.current.midpoint) {
            fired.current.midpoint = true;
            pingTrackingUrls(ad.tracking.midpoint);
        }
        if (progressPercent >= 75 && !fired.current.thirdQuartile) {
            fired.current.thirdQuartile = true;
            pingTrackingUrls(ad.tracking.thirdQuartile);
        }

        if (progressPercent >= 99 && !fired.current.complete) {
            fired.current.complete = true;
            pingTrackingUrls(ad.tracking.complete);
            freezeEndFrame();
            onAdEnded?.();
        }
    };

    const freezeEndFrame = () => {
        const video = videoRef.current;
        if (!video || !video.duration) return;

        // Avoid the browser’s black end frame
        const t = Math.max(0, video.duration * 0.98);
        const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            video.pause();
            setPaused(true);
        };
        video.addEventListener('seeked', onSeeked);
        video.currentTime = t;
    };


    const handleEnded = () => {
        if (!fired.current.complete) {
            fired.current.complete = true;
            pingTrackingUrls(ad.tracking.complete);
        }

        const video = videoRef.current;
        if (video && Number.isFinite(video.duration) && video.duration > 0) {
            // Keep a visible frame instead of a black end state
            video.currentTime = Math.max(0, video.duration - 0.05);
            video.pause();
        }
        setPaused(true);

        onAdEnded?.();

        freezeEndFrame();
    };

    const handleAdClick = () => {
        pingTrackingUrls(ad.tracking.click);
        if (ad.destinationUrl) {
            window.open(ad.destinationUrl, '_blank', 'noopener,noreferrer');
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive) {
            void video.play().catch(() => {
                // autoplay may still require muted
            });
            setPaused(false);
        } else {
            video.pause();
            setPaused(true);
        }
    }, [isActive, ad.videoUrl]);



    // In timeupdate, after quartile logic:


    return (
        <div className="relative mx-auto max-w-md overflow-hidden rounded-lg shadow-lg">
            <video
                key={ad.videoUrl}
                ref={videoRef}
                src={ad.videoUrl}
                width={ad.width}
                height={ad.height}
                autoPlay={false}
                muted={muted}
                playsInline
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onClick={togglePlayPause}
                className="h-auto w-full cursor-pointer"
            />

            {isPausedOverlay && (
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-[5] bg-black/40"
                />
            )}

            <div className="absolute left-3 top-3 rounded-md border border-white bg-transparent px-2 py-1 text-sm text-white">
                Ad · {ad.title}
            </div>

            <button
                type="button"
                onClick={togglePlayPause}
                className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-200 ${showCenterIcon || paused ? 'opacity-100' : 'opacity-0'
                    }`}
                aria-label={paused ? 'Play' : 'Pause'}
            >
                <span className="flex size-14 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm">
                    {paused ? <Play className="size-7 fill-white" /> : <Pause className="size-7 fill-white" />}
                </span>
            </button>

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setMuted((m) => !m);
                }}
                className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white"
                aria-label={muted ? 'Unmute' : 'Mute'}
            >
                {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>

            {ad.destinationUrl ? (
                <>
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent"
                    />
                    <button
                        type="button"
                        onClick={handleAdClick}
                        className="group absolute inset-x-4 bottom-4 z-10 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                        <span>Learn more</span>
                        <ArrowUpRight
                            aria-hidden
                            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </button>
                </>
            ) : null}
        </div>
    );
}