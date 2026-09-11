import { FullCampaignData } from "@/lib/schemas/campaign-schema";
export type CampaignDraft = Partial<FullCampaignData> & {
    draftId: string;
    accountId: string;
    currentStep: number;
    completedSteps: number[];
    lastSavedAt: string | null;

};