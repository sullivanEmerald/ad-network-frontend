"use client";

import { useRouter } from "next/navigation";
// import { useCampaignDraft } from "@/lib/hooks/useCampaignDraftContext";
import { WIZARD_STEPS } from "@/lib/schemas/campaign-schema";
import Button from "@/components/common/button";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { organisationEndpoints } from "@/endpoints/organisation";

interface StepFooterProps {
    currentStepId: number;
    onNext: () => boolean; // returns whether validation passed
    nextLabel?: string;
}

export function StepFooter({ currentStepId, onNext, nextLabel = "Next" }: StepFooterProps) {
    const router = useRouter();
    const { draft, createDraft, draftId } = useStore(useShallow((state) => ({
        draft: state.campaignDraft,
        createDraft: state.createDraft,
        draftId: state.draftId,
        // markStepComplete: state.markStepComplete,
    })));

    const prevStep = WIZARD_STEPS.find((s) => s.id === currentStepId - 1);
    const nextStep = WIZARD_STEPS.find((s) => s.id === currentStepId + 1);

    async function handleBack() {
        // if (draft) {
        //     await saveNow(draft);
        // }
        if (prevStep) {
            router.push(`/organisation/campaign/new${prevStep.path}`);
        }
    }

    async function handleSaveDraft() {
        if (!draft) return;
        await createDraft(draft, draftId, "draft");
        router.push(organisationEndpoints.campaigns);
    }

    async function handleNext() {
        const valid = onNext();
        if (!valid) return; // step-level gate — errors are already shown inline by the form
        // markStepComplete(currentStepId);
        // await saveNow();
        if (nextStep) {
            const draftQuery = draftId ? `?draftId=${draftId}` : "";
            router.push(`/organisation/campaign/new${nextStep.path}${draftQuery}`);
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
                    className=""
                >
                    {nextLabel}
                </Button>
            </div>

        </div>
    );
}
