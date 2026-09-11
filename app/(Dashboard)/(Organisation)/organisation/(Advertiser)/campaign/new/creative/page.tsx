"use client";

import { useEffect, useState, useCallback } from "react";
import { creativeSchema, type CreativeData } from "@/lib/schemas/campaign-schema";
import { Field } from "@/components/ui/field";
import { StepFooter } from "@/components/wizard/StepFooter";
import { useStore } from "@/store/store";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

export default function CreativeStep() {
    const updateDraft = useStore((state) => state.updateCampaignDraft);
    const draft = useStore((state) => state.campaignDraft);
    const [isDragging, setIsDragging] = useState(false);

    const {
        control,
        getValues,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CreativeData>({
        resolver: zodResolver(creativeSchema),
        defaultValues: {
            assets: draft?.assets || [],
            clickThroughUrl: draft?.clickThroughUrl || "",
        },
        mode: "onBlur",
    });

    const assets = useWatch({ control, name: "assets" }) ?? [];
    const clickThroughUrl = useWatch({ control, name: "clickThroughUrl" }) ?? "";

    useEffect(() => {
        if (draft) {
            reset({
                assets: draft.assets || [],
                clickThroughUrl: draft.clickThroughUrl || "",
            });
        }
    }, [draft, reset]);

    useEffect(() => {
        updateDraft({ assets, clickThroughUrl });
    }, [assets, clickThroughUrl, updateDraft]);

    const handleFiles = useCallback(async (files: FileList) => {
        // Real implementation: upload to storage (S3 presigned URL, etc.) and
        // read actual image dimensions. This preview-only version uses a local
        // object URL and placeholder dimensions.
        const newAssets: CreativeData["assets"] = Array.from(files).map((file) => ({
            fileUrl: URL.createObjectURL(file),
            type: file.type.startsWith("video") ? "video" : "image",
            width: 300,
            height: 250,
        }));
        const currentAssets = getValues("assets");

        setValue("assets", [...currentAssets, ...newAssets], {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [getValues, setValue]);

    function validate(): boolean {
        const result = creativeSchema.safeParse({ assets, clickThroughUrl });
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            for (const issue of result.error.issues) {
                fieldErrors[issue.path[0] as string] = issue.message;
            }
            return false;
        }
        return true;
    }

    return (
        <div>
            <Field label="Creative assets" htmlFor="assets" error={errors.assets?.message}>
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files.length) void handleFiles(e.dataTransfer.files);
                    }}
                    className={`rounded-md border-2 border-dashed px-6 py-8 text-center text-md text-white ${isDragging ? "border-signal-600 bg-signal-100" : "border-ink-100 text-ink-500"
                        }`}
                >
                    Drag creative files here, or
                    <label className="ml-1 cursor-pointer text-signal-600 underline">
                        browse
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            className="sr-only"
                            onChange={(e) => e.target.files && void handleFiles(e.target.files)}
                        />
                    </label>
                </div>

                {assets.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                        {assets.map((asset, i) => (
                            <div key={i} className="relative rounded-sm border border-ink-100 overflow-hidden">
                                {asset.type === "image" ? (
                                    <img src={asset.fileUrl} alt="" className="w-full h-24 object-cover" />
                                ) : (
                                    <video src={asset.fileUrl} className="w-full h-24 object-cover" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => setValue("assets", assets.filter((_, index) => index !== i), { shouldValidate: true })}
                                    className="absolute top-1 right-1 rounded-full bg-ink-900/70 text-white text-xs h-5 w-5"
                                    aria-label="Remove creative"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </Field>

            <Field label="Destination URL" htmlFor="clickThroughUrl" error={errors.clickThroughUrl?.message}>
                <Input
                    id="clickThroughUrl"
                    type="url"
                    value={clickThroughUrl}
                    onChange={(e) => setValue("clickThroughUrl", e.target.value)}
                    className="w-full rounded-sm border border-ink-100 px-3 py-2 text-sm"
                    placeholder="https://example.com/landing-page"
                />
            </Field>

            <StepFooter currentStepId={3} onNext={validate} />
        </div>
    );
}
