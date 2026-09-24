import type { Banner } from "@/types/banner";
import type { CampaignRecord } from "@/types/campaign";
import type { PublisherZone } from "@/types/publisher";

export type ZoneCampaign = {
    campaign: CampaignRecord;
    banners: Banner[];
};

export type ZoneCampaignResponse = {
    zone: PublisherZone;
    campaigns: ZoneCampaign[];
};