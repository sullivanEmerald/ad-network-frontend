export type Zone = PublisherZone[];


export type PublisherZone = {
    id: string;
    name: string;
    width: number;
    height: number;
    type: string;
    status: "active" | "inactive" | string;
    campaignsCount: number;
    mode : string;
};
