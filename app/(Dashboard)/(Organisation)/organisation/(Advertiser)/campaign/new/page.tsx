"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { objectiveSchema, type ObjectiveData } from "@/lib/schemas/campaign-schema";
// import { useCampaignDraft } from "@/lib/hooks/useCampaignDraftContext";
// import { Field } from "@/components/ui/Field";
import Input from "@/components/common/input";
import { Field } from "@/components/ui/field";
import { StepFooter } from "@/components/wizard/StepFooter";
import { useStore } from "@/store/store";


const OBJECTIVES: { value: ObjectiveData["objective"]; label: string; hint: string }[] = [
    { value: "traffic", label: "Traffic", hint: "Drive clicks to your site" },
    { value: "awareness", label: "Awareness", hint: "Maximize reach and impressions" },
    { value: "conversions", label: "Conversions", hint: "Optimize for purchases or signups" },
    { value: "app_installation", label: "App installation", hint: "Drive installs on iOS/Android" },
];

export default function ObjectiveStep() {
    const updateDraft = useStore((state) => state.updateCampaignDraft);
    const draft = useStore((state) => state.campaignDraft);
    const {
        register,
        watch,
        trigger,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ObjectiveData>({
        resolver: zodResolver(objectiveSchema),
        defaultValues: {
            objective: draft?.objective ?? "traffic",
        },
        mode: "onBlur",
    });

    const values = watch();

    useEffect(() => {
        updateDraft(values);
    }, [values.campaignName, values.objective]);

    useEffect(() => {
        if (draft) {
            reset({
                campaignName: draft.campaignName || "",
                objective: draft.objective ?? "traffic",
            });
        }
    }, [draft, reset]);

    return (
        <div>
            <Field label="Campaign name" htmlFor="campaignName" error={errors.campaignName?.message}>
                <Input
                    id="campaignName"
                    type="text"
                    {...register("campaignName")}
                    // className="w-full rounded-sm border border-ink-100 px-3 py-2 text-sm"
                    placeholder="e.g. Spring Sale Promo"
                />
            </Field>

            <div className="mb-2 text-md font-medium text-gray-400">Campaign Objective</div>
            <div className="grid grid-cols-2 gap-3 mb-1">
                {OBJECTIVES.map((opt) => (
                    <label
                        key={opt.value}
                        className={`cursor-pointer rounded-md border border-gray-600 px-4 py-3 text-sm ${values.objective === opt.value
                            ? "bg-primary/50 border-primary/80"
                            : "border-ink-100 hover:border-ink-300"
                            }`}
                    >
                        <input
                            type="radio"
                            value={opt.value}
                            className="sr-only"
                            checked={values.objective === opt.value}
                            onChange={() => setValue("objective", opt.value, { shouldValidate: true })}
                        />
                        <div className="font-medium text-gray-300">{opt.label}</div>
                        <div className="text-xs text-gray-400">{opt.hint}</div>
                    </label>
                ))}
            </div>
            {errors.objective && (
                <p className="text-xs text-danger mb-4" role="alert">
                    {errors.objective.message}
                </p>
            )}

            <StepFooter
                currentStepId={0}
                onNext={() => {
                    trigger();
                    const result = objectiveSchema.safeParse(values);
                    return result.success;
                }}
            />
        </div>
    );
}
