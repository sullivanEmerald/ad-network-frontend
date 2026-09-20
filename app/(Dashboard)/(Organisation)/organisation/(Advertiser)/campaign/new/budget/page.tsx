"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { budgetSchema, type BudgetData } from "@/lib/schemas/campaign-schema";
import { Field } from "@/components/ui/field";
import { StepFooter } from "@/components/wizard/StepFooter";
import { useStore } from "@/store/store";
import Input from "@/components/common/input";

export default function BudgetStep() {
    const updateDraft = useStore((state) => state.updateCampaignDraft);
    const draft = useStore((state) => state.campaignDraft);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<BudgetData>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            budgetType: draft?.budgetType ?? "daily",
            budgetAmount: draft?.budgetAmount,
            pacing: draft?.pacing ?? "standard",
        },
        mode: "onBlur",
    });

    const formValues = useWatch({ control });

    useEffect(() => {
        if (draft) {
            reset({
                budgetType: draft.budgetType ?? "daily",
                budgetAmount: draft.budgetAmount,
                pacing: draft.pacing ?? "standard",
            });
        }
    }, [draft, reset]);

    useEffect(() => {
        if (formValues) {
            updateDraft(formValues);
        }
    }, [formValues, updateDraft]);


    return (
        <form className="space-y-4">
            <Field label="Budget type" htmlFor="budgetType">
                <select
                    {...register("budgetType")}
                    className="w-full rounded-sm border border-gray-600 px-3 py-4 text-sm text-white"
                >
                    <option value="daily" className=" !text-white">
                        Daily
                    </option>
                    <option value="lifetime" className="!text-white">
                        Lifetime
                    </option>
                </select>
            </Field>

            <Field
                label={
                    formValues.budgetType === "lifetime"
                        ? "Total budget ($)"
                        : "Daily budget ($)"
                }
                htmlFor="budgetAmount"
                error={errors.budgetAmount?.message}
            >
                <Input
                    id="budgetAmount"
                    type="number"
                    step="1"
                    {...register("budgetAmount", { valueAsNumber: true })}
                    className="w-full rounded-sm border border-gray-600 px-3 py-4 text-sm text-white"
                    placeholder="50"
                />
            </Field>

            <Field
                label="Pacing"
                htmlFor="pacing"
                hint="Standard spreads spend evenly; accelerated spends as fast as possible"
            >
                <select
                    {...register("pacing")}
                    className="w-full rounded-sm border border-gray-600 px-3 py-4 text-sm text-white"
                >
                    <option value="standard">Standard</option>
                    <option value="accelerated">Accelerated</option>
                </select>
            </Field>

            <StepFooter
                currentStepId={2}
                onNext={() => budgetSchema.safeParse(formValues).success}
            />
        </form>
    );
}