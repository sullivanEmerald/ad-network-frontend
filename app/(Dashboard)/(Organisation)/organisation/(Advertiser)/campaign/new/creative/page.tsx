"use client";

import { useEffect, useState, useCallback } from "react";
import { ImagePlus, Video, UploadCloud } from "lucide-react";
import { creativeSchema, type CreativeData } from "@/lib/schemas/campaign-schema";
import { Field } from "@/components/ui/field";
import { StepFooter } from "@/components/wizard/StepFooter";
import { useStore } from "@/store/store";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

type CreativeFormat = "image" | "video";

const CREATIVE_FORMATS: {
    value: CreativeFormat;
    title: string;
    description: string;
    Icon: typeof ImagePlus;
}[] = [
        {
            value: "image",
            title: "Image ad",
            description: "Upload image creative for standard display placements.",
            Icon: ImagePlus,
        },
        {
            value: "video",
            title: "Inline video ad",
            description: "Upload video creative for Revive inline video placements.",
            Icon: Video,
        },
    ];

export default function CreativeStep() {
    const updateDraft = useStore((state) => state.updateCampaignDraft);
    const draft = useStore((state) => state.campaignDraft);
    const [isDragging, setIsDragging] = useState(false);
    const [creativeFormat, setCreativeFormat] = useState<CreativeFormat>("image");

    const {
        control,
        getValues,
        setValue,
        setError,
        clearErrors,
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

            const existingFormat = draft.assets?.find(
                (asset) => asset.type === "image" || asset.type === "video",
            )?.type;
            if (existingFormat === "image" || existingFormat === "video") {
                setCreativeFormat(existingFormat);
            }
        }
    }, [draft, reset]);

    useEffect(() => {
        updateDraft({ assets, clickThroughUrl });
    }, [assets, clickThroughUrl, updateDraft]);

    const handleFiles = useCallback((files: FileList) => {
        const selectedFiles = Array.from(files);
        const hasWrongFormat = selectedFiles.some((file) =>
            creativeFormat === "image"
                ? !file.type.startsWith("image/")
                : !file.type.startsWith("video/"),
        );

        if (hasWrongFormat) {
            setError("assets", {
                type: "manual",
                message: `Choose ${creativeFormat === "image" ? "image" : "video"} files for this format.`,
            });
            return;
        }

        const newAssets: CreativeData["assets"] = selectedFiles.map((file) => ({
            fileUrl: URL.createObjectURL(file),
            type: creativeFormat,
            // Preview-only until the configured upload endpoint returns the real dimensions.
            width: 300,
            height: 250,
        }));

        setValue("assets", [...getValues("assets"), ...newAssets], {
            shouldValidate: true,
            shouldDirty: true,
        });
        clearErrors("assets");
    }, [clearErrors, creativeFormat, getValues, setError, setValue]);

    function changeFormat(nextFormat: CreativeFormat) {
        if (nextFormat === creativeFormat) return;

        if (assets.length > 0) {
            const confirmed = window.confirm(
                "Changing the creative format will remove the files already selected. Continue?",
            );
            if (!confirmed) return;

            assets.forEach((asset) => {
                if (asset.fileUrl.startsWith("blob:")) URL.revokeObjectURL(asset.fileUrl);
            });
            setValue("assets", [], { shouldValidate: true, shouldDirty: true });
        }

        setCreativeFormat(nextFormat);
        clearErrors("assets");
    }

    function removeAsset(indexToRemove: number) {
        const asset = assets[indexToRemove];
        if (asset?.fileUrl.startsWith("blob:")) URL.revokeObjectURL(asset.fileUrl);
        setValue("assets", assets.filter((_, index) => index !== indexToRemove), {
            shouldValidate: true,
            shouldDirty: true,
        });
    }

    function validate(): boolean {
        const result = creativeSchema.safeParse({ assets, clickThroughUrl });
        if (!result.success) {
            for (const issue of result.error.issues) {
                const field = issue.path[0] === "clickThroughUrl" ? "clickThroughUrl" : "assets";
                setError(field, { type: "manual", message: issue.message });
            }
            return false;
        }

        if (assets.some((asset) => asset.type !== creativeFormat)) {
            setError("assets", {
                type: "manual",
                message: "Remove creatives that do not match the selected format before continuing.",
            });
            return false;
        }

        clearErrors(["assets", "clickThroughUrl"]);
        return true;
    }

    const accept = creativeFormat === "image" ? "image/*" : "video/*";

    return (
        <div className="mx-auto max-w-4xl space-y-7">
            <section aria-labelledby="creative-format-heading">
                <div className="mb-3">
                    <h2 id="creative-format-heading" className="text-lg font-semibold text-white">
                        Choose a creative format
                        n          </h2>
                    <p className="mt-1 text-sm text-ink-500">
                        Select the type of ad you want to run. We’ll use the matching delivery setup.
                    </p>
                </div>
                v
                <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Creative format">
                    {CREATIVE_FORMATS.map(({ value, title, description, Icon }) => {
                        const selected = creativeFormat === value;

                        return (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => changeFormat(value)}
                                className={`flex min-h-28 items-start gap-4 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${selected
                                    ? "border-primary bg-primary/10"
                                    : "border-ink-100 bg-light-background hover:border-ink-300"
                                    }`}
                            >
                                <span className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-primary/20 text-primary" : "bg-ink-100 text-ink-500"}`}>
                                    <Icon className="size-5" aria-hidden="true" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex items-center justify-between gap-2 font-semibold text-white">
                                        {title}
                                        <span className={`size-4 rounded-full border ${selected ? "border-primary bg-primary shadow-[inset_0_0_0_3px_#10251d]" : "border-ink-300"}`} aria-hidden="true" />
                                    </span>
                                    <span className="mt-1 block text-sm leading-5 text-ink-500">{description}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>

            <Field
                label={creativeFormat === "image" ? "Image creative" : "Inline video creative"}
                htmlFor="creative-upload"
                error={errors.assets?.message}
            >
                <div
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                            setIsDragging(false);
                        }
                    }}
                    onDrop={(event) => {
                        event.preventDefault();
                        setIsDragging(false);
                        if (event.dataTransfer.files.length) handleFiles(event.dataTransfer.files);
                    }}
                    className={`rounded-xl border-2 border-dashed px-5 py-9 text-center transition ${isDragging ? "border-primary bg-primary/10" : "border-ink-100 bg-light-background"
                        }`}
                >
                    <UploadCloud className="mx-auto size-8 text-primary" aria-hidden="true" />
                    <p className="mt-3 font-medium text-white">
                        Drag and drop {creativeFormat === "image" ? "image files" : "a video file"} here
                    </p>
                    <p className="mt-1 text-sm text-ink-500">or</p>
                    <label
                        htmlFor="creative-upload"
                        className="mt-3 inline-flex cursor-pointer items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-primary/80"
                    >
                        Browse files
                    </label>
                    <p className="mt-3 text-xs text-ink-500">
                        {creativeFormat === "image" ? "Images only" : "Video only"} · You can add multiple creatives in this format
                    </p>
                    <input
                        id="creative-upload"
                        type="file"
                        multiple
                        accept={accept}
                        className="sr-only"
                        onChange={(event) => {
                            if (event.target.files?.length) handleFiles(event.target.files);
                            event.target.value = "";
                        }}
                    />
                </div>

                {assets.length > 0 && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {assets.map((asset, index) => (
                            <div key={`${asset.fileUrl}-${index}`} className="overflow-hidden rounded-xl border border-ink-100 bg-light-background">
                                <div className="relative aspect-video bg-ink-950">
                                    {asset.type === "image" ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={asset.fileUrl} alt={`Image creative ${index + 1}`} className="size-full object-contain" />
                                    ) : asset.type === "video" ? (
                                        <video src={asset.fileUrl} controls playsInline className="size-full object-contain" />
                                    ) : (
                                        <div className="flex size-full items-center justify-center text-sm text-ink-500">HTML creative</div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeAsset(index)}
                                        className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-ink-900/80 text-lg text-white hover:bg-ink-900"
                                        aria-label={`Remove creative ${index + 1}`}
                                    >
                                        ×
                                    </button>
                                </div>
                                <p className="px-3 py-2 text-xs font-medium capitalize text-ink-500">
                                    {asset.type === "video" ? "Inline video" : asset.type} creative {index + 1}
                                </p>
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
                    onChange={(event) => setValue("clickThroughUrl", event.target.value, { shouldValidate: true, shouldDirty: true })}
                    className="w-full rounded-sm border border-ink-100 px-3 py-2 text-sm"
                    placeholder="https://example.com/landing-page"
                />
            </Field>

            <StepFooter currentStepId={3} onNext={validate} />
        </div>
    );
}
