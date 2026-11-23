export type Banner = {
    id: string;
    name: string;
    type: "image" | "video";
    src: string;
    width: number;
    height: number;
    destinationUrl?: string;
    assetUrl: string;
};

export type CreateBannerData = {
    name: string;
    destinationUrl: string;
    image: File;
    width?: string;
    height?: string;
};

export type CreateVideoBannerData = {
    name: string;
    destinationUrl: string;
    ctaText: string;
    video: File;
    duration: number;
    width?: string;
    height?: string;
    type: string;
};
