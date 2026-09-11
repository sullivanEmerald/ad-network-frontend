import { StateCreator } from "zustand";
import { Store } from "@/types/store";
import { Advertiser } from "@/types/advertiser";
import { createAdvertiser as createAdvertiserRequest, getAdvertiser as getAdvertiserRequest } from "@/services/advertiser";

export type AdvertiserSlice = {
    advertiser: Advertiser | null;
    createAdvertiser: (data: { name: string; email: string }) => Promise<void>;
    getAdvertiser: () => Promise<void>;
    advertiserState: {
        isLoading: boolean;
    };

};

export const createAdvertiserSlice: StateCreator<Store, [["zustand/immer", never]], [], AdvertiserSlice> = (set) => ({
    advertiser: null,
    advertiserState: {
        isLoading: false,

    },
    createAdvertiser: async (data) => {
        set((state) => {
            state.advertiserState.isLoading = true;
        });

        try {
            await createAdvertiserRequest(data);
        } finally {
            set((state) => {
                state.advertiserState.isLoading = false;
            });
        }
    },
    getAdvertiser: async () => {
        set((state) => {
            state.advertiserState.isLoading = true;
        });

        try {
            const response = await getAdvertiserRequest();
            const advertiser = response?.data?.advertiser ?? response?.advertiser ?? response;
            set((state) => {
                state.advertiser = advertiser;
            });
        } finally {
            set((state) => {
                state.advertiserState.isLoading = false;
            });
        }
    },

});