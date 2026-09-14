"use client";

import { Trash2, ExternalLink, Play } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/types/banner";

export type { Banner } from "@/types/banner";

type BannerCardProps = {
    banner: Banner;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
};

export default function BannerCard({ banner, onDelete, isDeleting = false }: BannerCardProps) {
    return (
        <Card className="overflow-hidden border border-white/10 bg-light-background/80 text-white shadow-lg shadow-black/10 transition-colors hover:border-primary/50 !px-0 !py-0">
            <div className="relative aspect-[16/10] overflow-hidden bg-black/30 ">
                {banner.type === "video" ? (
                    <>
                        <video src={banner.src} className="h-full w-full object-cover" muted loop playsInline />
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            <Play className="size-3 fill-current" /> Video
                        </span>
                    </>
                ) : (
                    <img src={banner.src} alt={banner.name} className="h-full w-full object-cover" />
                )}
            </div>
            <CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="truncate text-md font-semibold text-white">{banner.name}</h2>
                        <p className="mt-1 text-sm text-gray-400">
                            {banner.width > 0 && banner.height > 0
                                ? `${banner.width} x ${banner.height} px`
                                : "Uploaded asset"}
                        </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[11px] uppercase tracking-wide text-gray-400">
                        {banner.type}
                    </span>
                </div>
                {banner.destinationUrl && (
                    <a
                        href={banner.destinationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-full items-center gap-1 truncate text-xs text-primary hover:underline"
                    >
                        <ExternalLink className="size-4 shrink-0" />
                        <span className="truncate text-lg">{banner.destinationUrl}</span>
                    </a>
                )}
            </CardContent>
            <CardFooter className="justify-end border-white/10 bg-black/10 p-3">
                <Button
                    type="button"
                    disabled={isDeleting}
                    variant="ghost"
                    size="lg"
                    onClick={() => onDelete(banner.id)}
                    className="text-white bg-primary w-10 h-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                    <Trash2 className="" />
                </Button>
            </CardFooter>
        </Card>
    );
}
