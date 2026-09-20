"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
// import { useCampaignDraft } from "@/lib/hooks/useCampaignDraftContext";
import { WIZARD_STEPS } from "@/lib/schemas/campaign-schema";
import Button from "@/components/common/button";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { organisationEndpoints } from "@/endpoints/organisation";
import type { FullCampaignData } from "@/lib/schemas/campaign-schema";
import type { CampaignCreationResponse } from "@/types/campaign";
import { LineLoader } from "../common/lineLoader";
import { CreateBannerData } from "@/types/banner";

interface StepFooterProps {
    currentStepId: number;
    onNext: () => boolean;
    data?: Partial<FullCampaignData>;
    onCreate?: (data: Partial<FullCampaignData> | CreateBannerData) => Promise<CampaignCreationResponse>;
    onSaveStep?: (data: Partial<FullCampaignData>) => Promise<CampaignCreationResponse | void>;
    nextLabel?: string;
}

export function StepFooter({ currentStepId, onNext, data, onCreate, onSaveStep, nextLabel = "Next" }: StepFooterProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { draft, createDraft, draftId, setDraftId, campaignId } = useStore(useShallow((state) => ({
        draft: state.campaignDraft,
        createDraft: state.createDraft,
        draftId: state.draftId,
        setDraftId: state.setDraftId,
        campaignId: state.campaignId,
        // markStepComplete: state.markStepComplete,
    })));

    const prevStep = WIZARD_STEPS.find((s) => s.id === currentStepId - 1);
    const nextStep = WIZARD_STEPS.find((s) => s.id === currentStepId + 1);

    async function handleBack() {
        // if (draft) {
        //     await saveNow(draft);
        // }
        if (prevStep) {
            const query = new URLSearchParams();
            if (draftId) query.set("draftId", draftId);
            if (campaignId) query.set("reviveCampaignId", campaignId);
            const queryString = query.toString();
            router.push(`/organisation/campaign/new${prevStep.path}${queryString ? `?${queryString}` : ""}`);
        }
    }

    async function handleSaveDraft() {
        if (!draft) return;
        await createDraft(draft, draftId, "draft");
        router.push(organisationEndpoints.campaigns);
    }

    async function handleNext() {
        if (isSubmitting) return;
        const valid = onNext();
        if (!valid) return;
        setIsSubmitting(true);
        try {

            if (onCreate && nextStep) {
                const payload = data ?? {};
                const response = await onCreate(payload);
                const campaignId = response.campaignId;
                const query = campaignId ? `?campaignId=${encodeURIComponent(String(campaignId))}` : "";
                router.push(`/organisation/campaign/new${nextStep.path}${query}`);

            }

            // if (onSaveStep) {
            //     const response = await onSaveStep(stepData);
            //     const savedDraftId = response?.draftId ?? response?.id?.toString();
            //     if (savedDraftId) {
            //         setDraftId(savedDraftId);
            //     }
            //     if (!campaignId && response?.reviveCampaignId) {
            //         campaignId = response.reviveCampaignId.toString();
            //     }
            // }
        } catch (error) {
            console.log("saving campaign error", error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="mt-6 flex items-center justify-between  border-ink-100 pt-4">
            {prevStep ? (
                <Button
                    type="button"
                    onClick={handleBack}
                    className="bg-transparent hover:bg-ink-100 hover:bg-primary/10"
                >
                    Back
                </Button>
            ) : (
                <span />
            )}
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleSaveDraft}
                >
                    Save Draft
                </Button>
                <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className=""
                >
                    {isSubmitting ? <LineLoader /> : nextLabel}
                </Button>
            </div>

        </div>
    );
}
