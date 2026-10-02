import type { PublisherZone } from "@/types/publisher";


export type ZoneAds = {
    campaignName: string;
    matchingBannerCount: number;
    advertiser: {
        advertiserName: string,
    },
    startDate: string,
    endDate: string,
    _id: string,
    isConnected?: boolean,
    isLinked?: boolean,
    linked?: boolean,
    status?: string,
}

export type ZoneCampaignResponse = {
    zone: PublisherZone & { campaigns?: ZoneAds[] };
    campaigns?: ZoneAds[];
    connectedCampaigns?: ZoneAds[];
    linkedCampaigns?: ZoneAds[];
};