// app/feed/page.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import AdVideoPlayer from './components/AdVideoPlayer';
import { ReviveAdPayload } from './types/ad';
import { loadNext } from './service/adsRequests';
import AdImageCard from "./components/adImageCard"

export default function FeedPage() {
    const [ads, setAds] = useState<ReviveAdPayload[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

    const loadAd = useCallback(async () => {
        try {
            const next = await loadNext();
            if (!next) return;
            setAds((prev) => [...prev, next]);
        } catch (err) {
            console.error('Error loading ad:', err);
        }
    }, []);

    useEffect(() => {
        loadAd();
    }, [loadAd]);

    // Which card is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible[0]?.target) {
                    const id = (visible[0].target as HTMLElement).dataset.adKey;
                    if (id) setActiveId(id);
                }
            },
            { threshold: [0.4, 0.6, 0.75] },
        );

        itemRefs.current.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [ads]);

    const setItemRef = (key: string) => (el: HTMLDivElement | null) => {
        if (el) itemRefs.current.set(key, el);
        else itemRefs.current.delete(key);
    };

    return (
        <main className="space-y-6">
            {ads.map((ad) => {
                const key = ad.tracking.impression[0] ?? ad.videoUrl;
                return (
                    <>
                        <div key={ad.id} ref={setItemRef(key)} data-ad-key={key}>
                            {ad.type === 'video' ? (
                                <AdVideoPlayer ad={ad} isActive={activeId === key} onAdEnded={loadAd} />
                            ) : (
                                <AdImageCard ad={ad} isActive={activeId === key} />
                            )}
                        </div>
                    </>
                );
            })}
        </main>
    );
}