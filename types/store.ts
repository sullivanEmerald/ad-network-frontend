import { CampaignSlice } from "@/store/campaigns"
import { AuthSlice } from "@/store/auth";
import { AdvertiserSlice } from "@/store/advertiser";
import { BannerSlice } from "@/store/banners";

export type Store = CampaignSlice & AuthSlice & AdvertiserSlice & BannerSlice;
