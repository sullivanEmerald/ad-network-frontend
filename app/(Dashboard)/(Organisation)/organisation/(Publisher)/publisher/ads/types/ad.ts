// types/ad.ts
export interface AdTracking {
    impression: string[];
    start: string[];
    firstQuartile: string[];
    midpoint: string[];
    thirdQuartile: string[];
    complete: string[];
    click: string[];
}

export interface ReviveAdPayload {
    type: "video" | "image";
    id: string;
    title: string;
    advertiserName: string;
    videoUrl: string;
    destinationUrl: string;
    duration: number;
    width: number;
    height: number;
    mimeType: string;
    tracking: AdTracking;
    imageUrl: string
}