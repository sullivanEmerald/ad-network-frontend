export type Publisher = {
    id: string;
    name: string;
    contactName: string;
    emailAddress: string;
    website: string;
    comments: string;
    zones?: PublisherZone[];
};

export type PublisherZone = {
    id: string;
    name: string;
    width: number;
    height: number;
    type: string;
    status: "active" | "inactive" | string;
};
