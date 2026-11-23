"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layers3, Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { useShallow } from "zustand/shallow";
import CampaignHeader from "@/components/campaign/header";
import BannerCard from "@/components/campaign/banner-card";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { BannerFormData, bannerFormSchema } from "@/lib/schemas/banner";
import { CreateBannerData } from "@/types/banner";
import { getImageDimensions } from "@/components/banners/helpers";
import { showToaster } from "@/components/common/toast";
import { ImagePlus, UploadCloud, Video } from "lucide-react";
import { Field } from "@/components/ui/field";
import { useStore } from "@/store/store";

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

type BannerFormat = "image" | "inline_video";

export default function CampaignBanners() {
    const { id } = useParams<{ id: string }>();
    const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [creativeFormat, setCreativeFormat] = useState<BannerFormat>("image");
    const [mediaDimensions, setMediaDimensions] = useState<{ width: number; height: number } | null>(null);
    const [videoDuration, setVideoDuration] = useState<number | null>(null);
    const createCampaignVideoBanner = useStore((state) => state.createVideoBanner)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { banners, getBanners, createBanner, deleteBanner, isFetching, isCreating, isDeleting } = useStore(
        useShallow((state) => ({
            banners: state.banners,
            getBanners: state.getBanners,
            createBanner: state.createBanner,
            deleteBanner: state.deleteBanner,
            isFetching: state.bannerState.isFetching,
            isCreating: state.bannerState.isCreating,
            isDeleting: state.bannerState.isDeleting,
        })),
    );

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


    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        clearErrors,
        formState: { errors },
    } = useForm<BannerFormData>({
        resolver: zodResolver(bannerFormSchema),
        defaultValues: { name: "", destinationUrl: "" },
    });

    const values = watch();

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

    useEffect(() => {
        void getBanners(id);
    }, [getBanners, id]);

    async function handleAddBanner(data: BannerFormData) {
        if (!id) {
            showToaster("Campaign not found", "error")
            throw new Error("campaignId is required to create a banner");
        }

        if (creativeFormat === "inline_video") {
            const bannerData = data as BannerFormData;
            const metadata = await getVideoMetadata(bannerData.image);
            const dimensions = mediaDimensions ?? metadata;
            await createCampaignVideoBanner(id, {
                name: bannerData.name,
                destinationUrl: bannerData.destinationUrl,
                ctaText: bannerData.ctaText!.trim(),
                video: bannerData.image,
                duration: Number(Math.ceil(metadata.duration)),
                width: dimensions.width.toString(),
                height: dimensions.height.toString(),
                type: "inline_video",
            });
            reset();
            setIsAddBannerOpen(false);
            return;
        }

        const fullData = {
            ...data,
            width: mediaDimensions?.width.toString(),
            height: mediaDimensions?.height.toString(),
        }
        await createBanner(id, fullData);
        reset();
        setIsAddBannerOpen(false);
    }

    async function handleDelete(idToDelete: string) {
        await deleteBanner(id, idToDelete);
    }

    return (
        <main className="space-y-8 py-6">
            <div className="flex flex-col gap-6 lg:flex-row items-center lg:justify-between">
                <CampaignHeader
                    note="Campaign creative"
                    title="Banners"
                    description="Build a focused set of high-performing creatives for this campaign. Upload, review, and remove banner variations from one place."
                />
                <div className="shrink-0 pb-1">
                    <Button type="button" disabled={isCreating} onClick={() => setIsAddBannerOpen(true)}>
                        <Upload className="size-4" />
                        Add banners
                    </Button>
                </div>
            </div>

            <Dialog
                open={isAddBannerOpen}
                onOpenChange={(open) => {
                    setIsAddBannerOpen(open);
                    if (!open) reset();
                }}
            >
                <DialogContent className="bg-light-background text-white sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-white">Add a campaign banner</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Give your creative a clear name, choose where it should send people, and upload the image.
                        </DialogDescription>
                    </DialogHeader>
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
                                        <span className={`flex items-center justify-between gap-2 text-white`}>
                                            {title}
                                            <span className={`size-4 rounded-full border ${selected ? "border-primary bg-primary shadow-[inset_0_0_0_3px_#10251d]" : "border-ink-300"}`} aria-hidden="true" />
                                        </span>
                                        <span className="mt-1 block text-md leading-5 text-gray-500">{description}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <form onSubmit={handleSubmit(handleAddBanner)} className="space-y-4">
                        <Input
                            label="Banner name"
                            placeholder="Summer launch hero"
                            aria-invalid={Boolean(errors.name)}
                            error={errors.name?.message}
                            {...register("name")}
                            className=""
                        />
                        <Input
                            label="Destination URL"
                            type="url"
                            placeholder="https://example.com/landing-page"
                            aria-invalid={Boolean(errors.destinationUrl)}
                            error={errors.destinationUrl?.message}
                            {...register("destinationUrl")}
                        />
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
                                <span className="mt-3 block font-medium text-white">Choose {creativeFormat === "image" ? "an image" : "a video"} file</span>
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
                                    <div className="aspect-video w-full">
                                        {creativeFormat === "image" ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={previewUrl} alt="Selected image creative preview" className="w-full object-cover max-w-md" />
                                        ) : (
                                            <video src={previewUrl} controls playsInline className="w-full object-contain max-w-md" />
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
                        <DialogFooter className="-mx-4 -mb-4 border-white/10 bg-black/10">
                            <Button type="button" variant="outline" onClick={() => setIsAddBannerOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isCreating}>
                                {isCreating ? "Adding banner..." : "Add banner"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Card className="border border-gray-700 bg-light-background text-white">
                <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                            <Layers3 className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Creative library</p>
                            <p className="mt-1 max-w-xl text-sm leading-6 text-gray-400">
                                Keep every placement-ready variation together. Use clear names and consistent destinations so your campaign stays easy to review.
                            </p>
                        </div>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                        <p className="text-2xl font-semibold text-white">{banners.length}</p>
                        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Total banners</p>
                    </div>
                </CardContent>
            </Card>

            <section aria-labelledby="banner-library-heading" className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 id="banner-library-heading" className="text-lg font-semibold text-black border-b border-gray-700 py-1">Banner library</h2>
                    </div>
                    <span className="hidden items-center gap-2 text-xs text-gray-500 sm:flex">
                        <ImagePlus className="size-4" />
                        {banners.length ? "Ready for review" : "No creatives yet"}
                    </span>
                </div>

                {isFetching ? (
                    <Card className="border border-white/10 bg-transparent text-center">
                        <CardContent className="px-6 py-16 text-sm text-gray-500">Loading banners...</CardContent>
                    </Card>
                ) : banners.length ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {banners.map((banner) => (
                            <BannerCard key={banner.id} banner={banner} onDelete={handleDelete} isDeleting={isDeleting} />
                        ))}
                    </div>
                ) : (
                    <Card className="border-dashed border-white/15 bg-transparent text-center">
                        <CardContent className="flex flex-col items-center justify-center px-6 py-16">
                            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/5 text-gray-400">
                                <ImagePlus className="size-6" />
                            </div>
                            <h2 className="text-base font-semibold text-white">Your banner library is empty</h2>
                            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Add the first creative to start building the placements for this campaign.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </section>
        </main>
    );
}