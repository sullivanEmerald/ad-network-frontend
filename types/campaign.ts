import { FullCampaignData } from "@/lib/schemas/campaign-schema";
export type CampaignDraft = Partial<FullCampaignData> & {
    draftId: string;
    accountId: string;
    currentStep: number;
    completedSteps: number[];
    lastSavedAt: string | null;

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
    isSchedule: boolean;
    reviveCampaignId: number;
};