import type { StateCreator } from "zustand";
import { showToaster } from "@/components/common/toast";
import {
    createBanner as createBannerRequest,
    deleteBanner as deleteBannerRequest,
    getBanners as getBannersRequest,
} from "@/services/banner";
import type { Banner, CreateBannerData } from "@/types/banner";
import type { Store } from "@/types/store";


export type BannerSlice = {
    banners: Banner[];
    bannerState: {
        isFetching: boolean;
        isCreating: boolean;
        isDeleting: boolean;
        error: string | null;
    };
    getBanners: (campaignId: string) => Promise<void>;
    createBanner: (campaignId: string, data: CreateBannerData) => Promise<Banner | null>;
    deleteBanner: (campaignId: string, bannerId: string) => Promise<void>;
};

export const createBannerSlice: StateCreator<Store, [["zustand/immer", never]], [], BannerSlice> = (set) => ({
    banners: [],
    bannerState: {
        isFetching: false,
        isCreating: false,
        isDeleting: false,
        error: null,
    },
    getBanners: async (campaignId) => {
        set((state) => {
            state.bannerState.isFetching = true;
            state.bannerState.error = null;
        });

        try {
            const response = await getBannersRequest(campaignId);
            set((state) => {
                state.banners = response;
            });
        } catch (error) {
            console.error("Error fetching campaign banners:", error);
            set((state) => {
                state.bannerState.error = "Unable to load campaign banners.";
            });
        } finally {
            set((state) => {
                state.bannerState.isFetching = false;
            });
        }
    },
    createBanner: async (campaignId, data) => {
        set((state) => {
            state.bannerState.isCreating = true;
            state.bannerState.error = null;
        });

        try {
            const response = await createBannerRequest(campaignId, data);
            const banner = response;
            if (banner) {
                set((state) => {
                    state.banners.push(banner);
                });
            }
            showToaster("Banner added successfully.", "success");
            return banner;
        } catch (error) {
            console.error("Error creating campaign banner:", error);
            set((state) => {
                state.bannerState.error = "Unable to add this banner.";
            });
            throw error;
        } finally {
            set((state) => {
                state.bannerState.isCreating = false;
            });
        }
    },
    deleteBanner: async (campaignId, bannerId) => {
        set((state) => {
            state.bannerState.isDeleting = true;
            state.bannerState.error = null;
        });

        try {
            await deleteBannerRequest(campaignId, bannerId);
            set((state) => {
                state.banners = state.banners.filter((banner) => banner.id !== bannerId);
            });
            showToaster("Banner deleted successfully.", "success");
        } catch (error) {
            console.error("Error deleting campaign banner:", error);
            set((state) => {
                state.bannerState.error = "Unable to delete this banner.";
            });
            throw error;
        } finally {
            set((state) => {
                state.bannerState.isDeleting = false;
            });
        }
    },
});
