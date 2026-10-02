import type { StateCreator } from "zustand";
import {
    getZoneCampaigns as getZoneCampaignsRequest,
    linkZoneToCampaign,
    unlinkZoneFromCampaign as unlinkZoneFromCampaignRequest,
} from "@/services/zone";
import type { ZoneAds, ZoneCampaignResponse } from "@/types/zone";
import type { PublisherZone, } from "@/types/publisher";
import type { Store } from "@/types/store";

export type ZoneSlice = {
    zone: PublisherZone | null;
    zoneCampaigns: ZoneAds[];
    connectedZoneCampaigns: ZoneAds[];
    getZoneCampaigns: (zoneId: string) => Promise<void>;
    zoneCampaignState: {
        isFetching: boolean;
        error: string | null;
        linkingCampaignId: string | null;
        unlinkingCampaignId: string | null;
    };
    linkZoneToCampaign: (zoneId: string, campaignId: string) => Promise<void>;
    unlinkZoneFromCampaign: (zoneId: string, campaignId: string) => Promise<void>;
};

export const createZoneSlice: StateCreator<Store, [["zustand/immer", never]], [], ZoneSlice> = (set) => ({
    zone: null,
    zoneCampaigns: [],
    connectedZoneCampaigns: [],
    zoneCampaignState: {
        isFetching: false,
        error: null,
        linkingCampaignId: null,
        unlinkingCampaignId: null,
    },
    getZoneCampaigns: async (zoneId) => {
        set((state) => {
            state.zoneCampaignState.isFetching = true;
            state.zoneCampaignState.error = null;
            state.zoneCampaigns = [];
            state.connectedZoneCampaigns = [];
        });

        try {
            const response = await getZoneCampaignsRequest(zoneId) as ZoneCampaignResponse;
            set((state) => {
                state.zone = response.zone;
                state.connectedZoneCampaigns = response.linkedCampaigns ?? [];
                state.zoneCampaigns = response.campaigns ?? [];
            });
        } catch (error) {
            console.error("Error fetching zone campaigns:", error);
            set((state) => {
                state.zoneCampaignState.error = "Unable to load campaigns for this zone.";
            });
        } finally {
            set((state) => {
                state.zoneCampaignState.isFetching = false;
            });
        }
    },
    linkZoneToCampaign: async (zoneId, campaignId) => {
        set((state) => {
            state.zoneCampaignState.linkingCampaignId = campaignId;
        });

        try {
            await linkZoneToCampaign(zoneId, campaignId);
            set((state) => {
                const campaignIndex = state.zoneCampaigns.findIndex((campaign) => campaign._id === campaignId);
                if (campaignIndex === -1) return;

                const [campaign] = state.zoneCampaigns.splice(campaignIndex, 1);
                if (!state.connectedZoneCampaigns.some((connected) => connected._id === campaignId)) {
                    state.connectedZoneCampaigns.push(campaign);
                }
            });
        } catch (error) {
            console.error("Error linking zone to campaign:", error);
            throw error;
        } finally {
            set((state) => {
                state.zoneCampaignState.linkingCampaignId = null;
            });
        }
    },
    unlinkZoneFromCampaign: async (zoneId, campaignId) => {
        set((state) => {
            state.zoneCampaignState.unlinkingCampaignId = campaignId;
        });

        try {
            await unlinkZoneFromCampaignRequest(zoneId, campaignId);
            set((state) => {
                const campaignIndex = state.connectedZoneCampaigns.findIndex((campaign) => campaign._id === campaignId);
                if (campaignIndex === -1) return;

                const [campaign] = state.connectedZoneCampaigns.splice(campaignIndex, 1);
                if (!state.zoneCampaigns.some((matched) => matched._id === campaignId)) {
                    state.zoneCampaigns.push(campaign);
                }
            });
        } catch (error) {
            console.error("Error unlinking zone from campaign:", error);
            throw error;
        } finally {
            set((state) => {
                state.zoneCampaignState.unlinkingCampaignId = null;
            });
        }
    }
});