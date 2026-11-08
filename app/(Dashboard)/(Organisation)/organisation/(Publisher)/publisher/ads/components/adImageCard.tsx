'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ReviveAdPayload } from '../types/ad'; // or a shared FeedAd type with type: 'image'

function pingTrackingUrls(urls?: string[]) {
    if (!urls?.length || typeof window === 'undefined') return;
    for (const url of urls) {
        try {
            const img = new Image();
            img.src = url;
        } catch {
            /* ignore */
        }
    }
}

type ImageAd = {
    type: 'image' | "video";
    id: string;
    title: string;
    imageUrl: string;
    destinationUrl?: string;
    width?: number;
    height?: number;
    tracking: {
        impression: string[];
        click?: string[];
    };
};

interface AdImageCardProps {
    ad: ImageAd;
    isActive?: boolean;
}

export default function AdImageCard({ ad, isActive = true }: AdImageCardProps) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const impressed = useRef(false);

    // Impression when ~50% visible (or when active in the feed)
    useEffect(() => {
        const el = rootRef.current;
        if (!el || impressed.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    pingTrackingUrls(ad.tracking.impression);
                    impressed.current = true;
                    observer.disconnect();
                }
            },
            { threshold: [0.5] },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [ad.id, ad.tracking.impression]);

    // Reset if ad identity changes
    useEffect(() => {
        impressed.current = false;
    }, [ad.id, ad.imageUrl]);

    const handleClick = () => {
        pingTrackingUrls(ad.tracking.click);
        if (ad.destinationUrl) {
            window.open(ad.destinationUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div
            ref={rootRef}
            className="relative mx-auto max-w-md overflow-hidden rounded-lg bg-black shadow-lg"
        >
            <img
                src={ad.imageUrl}
                alt={ad.title}
                width={ad.width}
                height={ad.height}
                className="h-auto w-full cursor-pointer object-cover"
                onClick={handleClick}
            />

            <div className="absolute left-3 top-3 rounded-md border border-white px-2 py-1 text-sm text-white">
                Ad · {ad.title}
            </div>

            {ad.destinationUrl ? (
                <>
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent"
                    />
                    <button
                        type="button"
                        onClick={handleClick}
                        className="group absolute inset-x-4 bottom-4 z-10 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-slate-950"
                    >
                        <span>Learn more</span>
                        <ArrowUpRight className="size-4" />
                    </button>
                </>
            ) : null}
        </div>
    );
}