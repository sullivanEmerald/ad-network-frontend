"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WIZARD_STEPS } from "@/lib/schemas/campaign-schema";
import { useStore } from "@/store/store";

export function WizardStepper() {
    const pathname = usePathname();
    const draft = useStore((state) => state.campaignDraft);


    return (
        <ol className="flex items-center gap-2">
            {WIZARD_STEPS.map((step, i) => {
                const stepPath = `/organisation/campaign/new${step.path}`;
                const href = `${stepPath}`;
                const isActive = pathname === stepPath;
                // const isComplete = draft.completedSteps.includes(step.id);
                // Only completed steps or the immediate next step are reachable —
                // this keeps the "jump ahead without filling anything in" case from
                // silently skipping required data, while still allowing free
                // backward/forward navigation across anything already touched.
                // const isReachable = isComplete || step.id <= Math.max(...draft.completedSteps, 0) + 1;

                return (
                    <li key={step.key} className="flex items-center gap-2 flex-1">
                        <Link
                            href={href}
                            className={`flex items-center gap-2 text-gray-300 text-sm sm:text-md w-full py-2 border-b-2 ${isActive
                                && "border-primary text-ink-900 text-md"

                                }`}
                        >
                            <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${isActive
                                    ? "bg-signal-600 text-white"
                                    : "bg-ink-100 text-ink-500"
                                    }`}
                            >
                            </span>
                            {step.label}
                        </Link>

                        {/* <span className="flex items-center gap-2 text-sm w-full py-2 border-b-2 border-ink-100 text-ink-300 cursor-not-allowed">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-100 text-xs">
                                    {i + 1}
                                </span>
                                {step.label}
                            </span> */}

                    </li>
                );
            })}
        </ol>
    );
}
