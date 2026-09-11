import { CampaignSlice } from "@/store/campaigns"
import { AuthSlice } from "@/store/auth";
import { AdvertiserSlice } from "@/store/advertiser";

export type Store = CampaignSlice & AuthSlice & AdvertiserSlice; 
