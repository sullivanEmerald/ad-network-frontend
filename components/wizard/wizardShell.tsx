"use client";

import CampaignHeader from "@/components/campaign/header";
import { WizardStepper } from "@/components/wizard/wizardStepper";
import { useStore } from "@/store/store";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function WizardShell({ children }: { children: React.ReactNode }) {
    const setDraftId = useStore((state) => state.setDraftId);
    const setReviveCampaignId = useStore((state) => state.setReviveCampaignId);
    const clearDraft = useStore((state) => state.clearDraft);
    const getDraftById = useStore((state) => state.getDraftById);
    const draftId = useSearchParams().get("draftId");
    const reviveCampaignId = useSearchParams().get("campaignId");

    useEffect(() => {
        if (draftId) {
            setDraftId(draftId);
            void getDraftById(draftId);
        }
        if (!draftId && !reviveCampaignId) {
            clearDraft();
        }
    }, [clearDraft, draftId, getDraftById, reviveCampaignId, setDraftId, setReviveCampaignId]);

    return (
        <div className="">
            <CampaignHeader title="Create a new campaign" description="Follow the steps below to create your campaign." />
            <WizardStepper />
            <div className="mt-6">
                {children}
            </div>
        </div>
    );
}