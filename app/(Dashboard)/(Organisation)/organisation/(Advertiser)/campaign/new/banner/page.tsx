"use client";

import { useEffect, useState } from "react";
import { type FullCampaignData } from "@/lib/schemas/campaign-schema";
import { Field } from "@/components/ui/field";
import { StepFooter } from "@/components/wizard/StepFooter";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { ImagePlus, UploadCloud, Video } from "lucide-react";
import { useStore } from "@/store/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/input";
import { BannerFormData, bannerFormSchema } from "@/lib/schemas/banner";
import { useSearchParams } from "next/navigation";
import { CreateBannerData } from "@/types/banner";
import { showToaster } from "@/components/common/toast";
import { getImageDimensions } from "@/components/banners/helpers";

type BannerFormat = "image" | "inline_video";

const BANNER_FORMATS = [
    {
        value: "image" as const,
        title: "Image ad",
        description: "Upload an image for a standard display placement.",
        Icon: ImagePlus,
    },
    {
        value: "inline_video" as const,
        title: "Inline video ad",
        description: "Upload a video for an inline video placement.",
        Icon: Video,
    },
];

function getVideoMetadata(file: File): Promise<{ width: number; height: number; duration: number }> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        const objectUrl = URL.createObjectURL(file);

        video.preload = "metadata";
        video.onloadedmetadata = () => {
            URL.revokeObjectURL(objectUrl);
            if (!Number.isFinite(video.duration) || video.duration <= 0) {
                reject(new Error("Unable to read video duration"));
                return;
            }
            resolve({ width: video.videoWidth, height: video.videoHeight, duration: video.duration });
        };
        video.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Unable to read video dimensions"));
        };
        video.src = objectUrl;
    });
}

countries.registerLocale(enLocale);
const GEO_NAMES = countries.getNames("en", { select: "official" });
const COUNTRY_LIST = Object.entries(GEO_NAMES).map(([code, name]) => ({ value: code, label: name })).sort((a, b) => a.label.localeCompare(b.label));

export default function TargetingStep() {
    const searchParams = useSearchParams();
    const campaignId = searchParams.get("campaignId");
    const [creativeFormat, setCreativeFormat] = useState<BannerFormat>("image");
    const [mediaDimensions, setMediaDimensions] = useState<{ width: number; height: number } | null>(null);
    const [videoDuration, setVideoDuration] = useState<number | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const createCampaignBanner = useStore((state) => state.createBanner)
    const createCampaignVideoBanner = useStore((state) => state.createVideoBanner)

    const {
        register,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<BannerFormData>({
        resolver: zodResolver(bannerFormSchema),
        defaultValues: { name: "", destinationUrl: "", ctaText: "" },
    });

    const values = watch();

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    function selectFormat(nextFormat: BannerFormat) {
        if (nextFormat === creativeFormat) return;
        if (values.image instanceof File) {
            const confirmed = window.confirm("Changing the creative format will remove the selected file. Continue?");
            if (!confirmed) return;
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            setMediaDimensions(null);
            setVideoDuration(null);
            setValue("image", undefined as unknown as File, { shouldValidate: true, shouldDirty: true });
        }
        clearErrors("ctaText");
        setCreativeFormat(nextFormat);
    }

    async function handleFileChange(file: File | undefined) {
        if (!file) return;

        const matchesFormat = creativeFormat === "image"
            ? file.type.startsWith("image/")
            : file.type.startsWith("video/");
        if (!matchesFormat) {
            showToaster(`Choose a ${creativeFormat} file for this ad format.`, "error");
            return;
        }

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setValue("image", file, { shouldValidate: true, shouldDirty: true });
        setPreviewUrl(URL.createObjectURL(file));
        setMediaDimensions(null);
        setVideoDuration(null);

        try {
            if (creativeFormat === "image") {
                setMediaDimensions(await getImageDimensions(file));
            } else {
                const metadata = await getVideoMetadata(file);
                setMediaDimensions({ width: metadata.width, height: metadata.height });
                setVideoDuration(metadata.duration);
            }
        } catch {
            showToaster(`Unable to read ${creativeFormat} dimensions`, "error");
        }
    }

    function validate(): boolean {
        const result = bannerFormSchema.safeParse(values);
        if (!result.success) {
            for (const issue of result.error.issues) {
                showToaster(issue.message, 'error')
            }
            return false;
        }
        if (creativeFormat === "inline_video" && !values.ctaText?.trim()) {
            const message = "Enter CTA text for the inline video";
            setError("ctaText", { type: "manual", message });
            showToaster(message, "error");
            return false;
        }
        clearErrors("ctaText");
        return true;
    }


    async function handleCreateBanner(data: Partial<FullCampaignData> | CreateBannerData) {
        if (!campaignId) {
            showToaster("Create a campaign. Banner is associated with a campaign. Move to the first step", "error")
            throw new Error("campaignId is required to create a banner");
        }

        if (creativeFormat === "inline_video") {
            const bannerData = data as BannerFormData;
            const metadata = await getVideoMetadata(bannerData.image);
            const dimensions = mediaDimensions ?? metadata;
            await createCampaignVideoBanner(campaignId, {
                name: bannerData.name,
                destinationUrl: bannerData.destinationUrl,
                ctaText: bannerData.ctaText!.trim(),
                video: bannerData.image,
                duration: Number(Math.ceil(metadata.duration)),
                width: dimensions.width.toString(),
                height: dimensions.height.toString(),
                type: "inline_video",
            });
            return { campaignId };
        }

        const bannerData = data as CreateBannerData;
        const dimensions = mediaDimensions ?? await getImageDimensions(bannerData.image);
        const fullData = {
            ...bannerData,
            width: dimensions.width.toString(),
            height: dimensions.height.toString(),
        }
        await createCampaignBanner(campaignId, fullData);
        return { campaignId };
    }

    return (
        <div className="space-y-6">
            <section aria-labelledby="banner-format-heading">
                <div className="mb-4">
                    <h2 id="banner-format-heading" className="text-lg font-semibold text-black">Choose a creative format</h2>
                    <p className="text-sm text-gray-500">Select an image or inline video ad to continue.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Creative format">
                    {BANNER_FORMATS.map(({ value, title, description, Icon }) => {
                        const selected = creativeFormat === value;
                        return (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => selectFormat(value)}
                                className={`flex min-h-28 items-start gap-4 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${selected ? "border-primary bg-primary/10" : "border-ink-100 hover:border-ink-300"}`}
                            >
                                <span className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-primary/20 text-primary" : "bg-ink-100 text-gray-500"}`}>
                                    <Icon className="size-5" aria-hidden="true" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className={`flex items-center justify-between gap-2 font-semibold text-black`}>
                                        {title}
                                        <span className={`size-4 rounded-full border ${selected ? "border-primary bg-primary shadow-[inset_0_0_0_3px_#10251d]" : "border-ink-300"}`} aria-hidden="true" />
                                    </span>
                                    <span className="mt-1 block text-md leading-5 text-gray-500">{description}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>

            <Field label="Banner name" htmlFor="bannerName" error={errors.name?.message}>
                <Input
                    placeholder="Summer launch hero"
                    aria-invalid={Boolean(errors.name)}
                    error={errors.name?.message}
                    {...register("name")}
                />
            </Field>
            <Field label="Destination URL" htmlFor="destinationUrl" error={errors.destinationUrl?.message}>
                <Input
                    type="url"
                    placeholder="https://example.com/landing-page"
                    aria-invalid={Boolean(errors.destinationUrl)}
                    error={errors.destinationUrl?.message}
                    {...register("destinationUrl")}
                />
            </Field>
            {creativeFormat === "inline_video" && (
                <Field label="CTA text" htmlFor="ctaText" error={errors.ctaText?.message}>
                    <Input
                        id="ctaText"
                        placeholder="Shop now"
                        aria-invalid={Boolean(errors.ctaText)}
                        {...register("ctaText", {
                            onChange: (event) => {
                                if (event.target.value.trim()) clearErrors("ctaText");
                            },
                        })}
                    />
                </Field>
            )}

            <Field label={creativeFormat === "image" ? "Image creative" : "Inline video creative"} htmlFor="banner-media" error={errors.image?.message}>
                <label
                    htmlFor="banner-media"
                    className="block cursor-pointer rounded-xl border-2 border-dashed border-ink-100 px-5 py-8 text-center transition hover:border-primary"
                >
                    <UploadCloud className="mx-auto size-8 text-primary" aria-hidden="true" />
                    <span className="mt-3 block font-medium text-black">Choose {creativeFormat === "image" ? "an image" : "a video"} file</span>
                    <span className="mt-1 block text-md text-gray-500">{creativeFormat === "image" ? "Images only" : "Videos only"}</span>
                </label>
                <input
                    id="banner-media"
                    type="file"
                    accept={creativeFormat === "image" ? "image/*" : "video/*"}
                    aria-invalid={Boolean(errors.image)}
                    className="sr-only"
                    onChange={(event) => {
                        void handleFileChange(event.target.files?.[0]);
                        event.target.value = "";
                    }}
                />
                {previewUrl && (
                    <div className={`mt-4 overflow-hidden rounded-xl border border-gray-600 bg-ink-950 max-w-md`}>
                        <div className="aspect-video">
                            {creativeFormat === "image" ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={previewUrl} alt="Selected image creative preview" className="size-full object-contain" />
                            ) : (
                                <video src={previewUrl} controls playsInline className="size-full object-contain" />
                            )}
                        </div>
                        {mediaDimensions && (
                            <p className="px-3 py-2 text-sm text-green-500">
                                Dimensions: {mediaDimensions.width} × {mediaDimensions.height}px
                                {creativeFormat === "inline_video" && videoDuration !== null && (
                                    <> · Duration: {videoDuration.toFixed(2)} seconds</>
                                )}
                            </p>
                        )}
                    </div>
                )}
            </Field>

            <StepFooter
                currentStepId={1}
                data={values}
                onCreate={handleCreateBanner}
                // onSaveStep={(stepData) => createDraft({ ...stepData, reviveCampaignId }, draftId, "draft")}
                onNext={validate}
            />
        </div >
    );
}

// interface GeoSelectionProps {
//     selected: TargetingData["geo"];
//     onRemove: (option: TargetingData["geo"][number]) => void;
// }

// function GeoSelection({ selected, onRemove }: GeoSelectionProps) {
//     return (
//         <div className="mt-4 flex flex-wrap gap-2">
//             {selected.map((location) => (
//                 <Button
//                     key={location.code}
//                     type="button"
//                     variant="outline"
//                     onClick={() => onRemove(location)}
//                     className="border-primary/80 bg-transparent"
//                 >
//                     {location.label}
//                 </Button>
//             ))}
//         </div>
//     );
// }



// function DeviceSelection({
//     options,
//     selected,
//     onRemove,
//     onToggle,
// }: DeviceSelectionProps) {
//     return (
//         <div className="mt-2 flex flex-wrap gap-2">
//             {options.map((option) => {
//                 const isSelected = selected.includes(option.value);

//                 return (
//                     <Button
//                         key={option.value}
//                         type="button"
//                         variant="outline"
//                         aria-pressed={isSelected}
//                         onClick={() => onToggle(option.value)}
//                         className={isSelected
//                             ? "border-primary/80 bg-primary/80"
//                             : "bg-transparent border-ink-100 hover:border-ink-300"}
//                     >
//                         {option.label} <span className="ml-1 text-xs">×</span>
//                     </Button>
//                 );
//             })}
//         </div>
//     );
// }   
