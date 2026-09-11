import { create } from "zustand"
import { immer } from "zustand/middleware/immer";
import { Store } from "@/types/store"
import { createCampaignSlice } from "@/store/campaigns";
import { createAuthSlice } from "@/store/auth";
import { createAdvertiserSlice } from "./advertiser";

export const useStore = create<Store>()(immer((...a) => ({
    ...createCampaignSlice(...a),
    ...createAuthSlice(...a),
    ...createAdvertiserSlice(...a)
})));