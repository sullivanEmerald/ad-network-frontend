import { FullCampaignData } from "@/lib/schemas/campaign-schema";
export type CampaignDraft = Partial<FullCampaignData> & {
    draftId: string;
    accountId: string;
    currentStep: number;
    completedSteps: number[];
    lastSavedAt: string | null;
    reviveCampaignId?: number | string | null;

};

export type CampaignRecord = Partial<Omit<FullCampaignData, "startDate" | "endDate">> & {
    id: string;
    advertiserId: string;
    organizationId: string;
    draftId?: string | null;
    status: "ACTIVE" | "DRAFT" | string;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    createdAt: string;
    updatedAt: string;
    isScheduled: boolean;
    reviveCampaignId: number;
    isRunning: boolean;
};

export type CampaignCreationResponse = Partial<CampaignRecord> & {
    id?: string | number | null;
    campaignId?: number | string | null;
    draftId?: string | null;
};

export type CampaignReviewSummary = {
    campaign: {
        campaignName: string;
        startDate: string | Date | undefined;
        endDate?: string | Date | null | undefined;
        id: string;
    };
    banners: {
        name: string;
        destinationUrl: string;
        file: string;
        id: string;
    };
};