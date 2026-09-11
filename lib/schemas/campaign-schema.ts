import { z } from "zod";

export const objectiveSchema = z.object({
    campaignName: z
        .string()
        .min(3, "Campaign name must be at least 3 characters")
        .max(80, "Campaign name must be under 80 characters"),
    objective: z.enum(["traffic", "awareness", "conversions", "app_installation", "engagement"], {
        errorMap: () => ({ message: "Select a campaign objective" }),
    }),
});

export const targetingSchema = z.object({
    geo: z
        .array(
            z.object({
                code: z.string().min(2, "Invalid ISO code"),
                label: z.string().min(1, "Location name required"),
            })
        )
        .min(1, "Select at least one location"),
    devices: z
        .array(z.enum(["desktop", "mobile", "tablet", "ctv",]))
        .min(1, "Select at least one device type"),
    // audienceSegments: z.array(z.string()).default([]),
    // placements: z.array(z.string()).min(1, "Select at least one placement/zone"),
});

export const budgetSchema = z
    .object({
        budgetType: z.enum(["daily", "lifetime"]),
        budgetAmount: z
            .number({ invalid_type_error: "Enter a budget amount" })
            .positive("Budget must be greater than 0")
            .min(50, "Minimum budget is $50/day"),
        startDate: z.coerce.date({ errorMap: () => ({ message: "Select a start date" }) }),
        endDate: z.coerce.date().optional(),
        pacing: z.enum(["standard", "accelerated"]),
    })
    .refine((data) => !data.endDate || data.endDate > data.startDate, {
        message: "End date must be after start date",
        path: ["endDate"],
    });

export const creativeAssetSchema = z.object({
    fileUrl: z.string().url("Upload didn't return a valid file URL"),
    type: z.enum(["image", "video", "html5"]),
    width: z.number().positive(),
    height: z.number().positive(),
});

export const creativeSchema = z.object({
    assets: z.array(creativeAssetSchema).min(1, "Upload at least one creative"),
    clickThroughUrl: z.string().url("Enter a valid destination URL"),
});

/** Full merged schema — used for final submit and for the Review step. */
export const fullCampaignSchema = objectiveSchema
    .merge(targetingSchema)
    .merge(budgetSchema.innerType()) // .refine() wraps the object; unwrap to merge, re-apply refine below
    .merge(creativeSchema)
    .refine((data) => !data.endDate || data.endDate > data.startDate, {
        message: "End date must be after start date",
        path: ["endDate"],
    });

export type ObjectiveData = z.infer<typeof objectiveSchema>;
export type TargetingData = z.infer<typeof targetingSchema>;
export type BudgetData = z.infer<typeof budgetSchema>;
export type CreativeData = z.infer<typeof creativeSchema>;
export type FullCampaignData = z.infer<typeof fullCampaignSchema>;

/**
 * A draft is always a *partial* campaign — early steps legitimately have
 * missing later-step data, and autosave must be able to persist incomplete
 * or even invalid data without blocking on validation.
 */
export type CampaignDraft = Partial<FullCampaignData> & {
    draftId: string;
    accountId: string;
    currentStep: number;
    completedSteps: number[];
    lastSavedAt: string | null;
    version: number; // optimistic-concurrency token
};

export const WIZARD_STEPS = [
    { id: 0, key: "objective", label: "Objective", path: "" },
    { id: 1, key: "targeting", label: "Targeting", path: "/targeting" },
    { id: 2, key: "budget", label: "Budget & Schedule", path: "/budget" },
    { id: 3, key: "creative", label: "Creative", path: "/creative" },
    { id: 4, key: "review", label: "Review & Launch", path: "/review" },
] as const;

export type StepKey = (typeof WIZARD_STEPS)[number]["key"];

/** Cross-field rules that can't be checked until later steps exist. Run at Review. */
export interface CrossFieldRule {
    id: string;
    check: (data: Partial<FullCampaignData>) => boolean;
    message: string;
    severity: "warning" | "error";
}

export const crossFieldRules: CrossFieldRule[] = [
    // {
    //     id: "budget-vs-placements",
    //     check: (data) => {
    //         if (!data.budgetAmount || !data.placements) return true;
    //         const estimatedMinBudget = data.placements.length * 5;
    //         return data.budgetAmount >= estimatedMinBudget;
    //     },
    //     message:
    //         "Your budget may be too low for the selected placements to deliver meaningfully.",
    //     severity: "warning",
    // },
    {
        id: "creative-dimension-match",
        check: (data) => {
            if (!data.assets || data.assets.length === 0) return true;
            // Placeholder rule: real implementation would look up each placement's
            // required dimensions and compare against uploaded creative sizes.
            return data.assets.every((a) => a.width > 0 && a.height > 0);
        },
        message: "One or more creatives don't match the selected placement dimensions.",
        severity: "error",
    },
];

export function getStepSchema(stepKey: StepKey) {
    switch (stepKey) {
        case "objective":
            return objectiveSchema;
        case "targeting":
            return targetingSchema;
        case "budget":
            return budgetSchema;
        case "creative":
            return creativeSchema;
        case "review":
            return fullCampaignSchema;
    }
}
