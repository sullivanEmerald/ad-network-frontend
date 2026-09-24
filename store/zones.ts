import type { StateCreator } from "zustand";
import { getZoneCampaigns as getZoneCampaignsRequest } from "@/services/zone";
import type { ZoneCampaign } from "@/types/zone";
import type { PublisherZone } from "@/types/publisher";
import type { Store } from "@/types/store";

export type ZoneSlice = {
    zone: PublisherZone | null;
    zoneCampaigns: ZoneCampaign[];
    getZoneCampaigns: (zoneId: string) => Promise<void>;
    zoneCampaignState: {
        isFetching: boolean;
        error: string | null;
    };
};

export const createZoneSlice: StateCreator<Store, [["zustand/immer", never]], [], ZoneSlice> = (set) => ({
    zone: null,
    zoneCampaigns: [],
    zoneCampaignState: {
        isFetching: false,
        error: null,
    },
    getZoneCampaigns: async (zoneId) => {
        set((state) => {
            state.zoneCampaignState.isFetching = true;
            state.zoneCampaignState.error = null;
            state.zoneCampaigns = [];
        });

        try {
            const response = await getZoneCampaignsRequest(zoneId);
            set((state) => {
                state.zone = response.zone;
                state.zoneCampaigns = response.campaigns;
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
});