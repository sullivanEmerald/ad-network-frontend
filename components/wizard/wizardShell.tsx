"use client";

import CampaignHeader from "@/components/campaign/header";
import { WizardStepper } from "@/components/wizard/wizardStepper";
import { useStore } from "@/store/store";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function WizardShell({ children }: { children: React.ReactNode }) {
    const setDraftId = useStore((state) => state.setDraftId);
    const getDraftById = useStore((state) => state.getDraftById);
    const clearDraft = useStore((state) => state.clearDraft);
    const draftId = useSearchParams().get("draftId");

    useEffect(() => {
        if (draftId) {
            setDraftId(draftId);
            void getDraftById(draftId);
        } else {
            useStore.getState().clearDraft();
        }
    }, []);

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