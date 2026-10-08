import type { StateCreator } from "zustand";
import {
    getZoneCampaigns as getZoneCampaignsRequest,
    linkZoneToCampaign,
    unlinkZoneFromCampaign as unlinkZoneFromCampaignRequest,
} from "@/services/zone";
import type { ZoneAds, ZoneCampaignResponse, } from "@/types/zone";
import type { PublisherZone, } from "@/types/publisher";
import type { Store } from "@/types/store";

export type ZoneSlice = {
    zone: PublisherZone | null;
    zoneCampaigns: ZoneAds[];
    assignedCampaign: ZoneAds | null;
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
    assignedCampaign: null,
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
        });

        try {
            const response = await getZoneCampaignsRequest(zoneId) as ZoneCampaignResponse;
            set((state) => {
                state.zone = response.zone;
                state.assignedCampaign = response.campaign ?? null;
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
                const campaignToLink = state.zoneCampaigns.find((campaign) => campaign._id === campaignId);
                if (campaignToLink) {
                    state.assignedCampaign = campaignToLink;
                    state.zoneCampaigns = state.zoneCampaigns.filter((campaign) => campaign._id !== campaignId);
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
                if (state.assignedCampaign && state.assignedCampaign._id === campaignId) {
                    state.zoneCampaigns.push(state.assignedCampaign);
                    state.assignedCampaign = null;
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