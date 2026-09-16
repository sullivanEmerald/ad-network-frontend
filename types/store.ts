import { CampaignSlice } from "@/store/campaigns"
import { AuthSlice } from "@/store/auth";
import { AdvertiserSlice } from "@/store/advertiser";
import { BannerSlice } from "@/store/banners";
import { PublisherSlice } from "@/store/publisher";

export type Store = CampaignSlice & AuthSlice & AdvertiserSlice & BannerSlice & PublisherSlice;
