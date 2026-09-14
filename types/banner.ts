export type Banner = {
    id: string;
    name: string;
    type: "image" | "video";
    src: string;
    width: number;
    height: number;
    destinationUrl?: string;
};

export type CreateBannerData = {
    name: string;
    destinationUrl: string;
    image: File;
};
