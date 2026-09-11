import { Suspense } from "react";
import { WizardShell } from "@/components/wizard/wizardShell";

export default function NewCampaignLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WizardShell>
                {children}
            </WizardShell>
        </Suspense>
    );
}