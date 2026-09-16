import { create } from "zustand"
import { immer } from "zustand/middleware/immer";
import { Store } from "@/types/store"
import { createCampaignSlice } from "@/store/campaigns";
import { createAuthSlice } from "@/store/auth";
import { createAdvertiserSlice } from "./advertiser";
import { createBannerSlice } from "./banners";
import { createPublisherSlice } from "./publisher";

export const useStore = create<Store>()(immer((...a) => ({
    ...createCampaignSlice(...a),
    ...createAuthSlice(...a),
    ...createAdvertiserSlice(...a),
    ...createBannerSlice(...a),
    ...createPublisherSlice(...a),
})));