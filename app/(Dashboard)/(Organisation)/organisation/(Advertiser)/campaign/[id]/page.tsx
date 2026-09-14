"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Layers3, Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { useStore } from "@/store/store";
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

const bannerFormSchema = z.object({
    name: z.string().trim().min(2, "Enter a banner name"),
    destinationUrl: z.string().trim().url("Enter a valid destination URL"),
    image: z.custom<File>(
        (value) => typeof File !== "undefined" && value instanceof File,
        "Select an image for the banner",
    ),
});

type BannerFormData = z.infer<typeof bannerFormSchema>;

export default function CampaignBanners() {
    const { id } = useParams<{ id: string }>();
    const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
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
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<BannerFormData>({
        resolver: zodResolver(bannerFormSchema),
        defaultValues: { name: "", destinationUrl: "" },
    });

    useEffect(() => {
        void getBanners(id);
    }, [getBanners, id]);

    async function handleAddBanner(data: BannerFormData) {
        await createBanner(id, data);
        reset();
        setIsAddBannerOpen(false);
    }

    async function handleDelete(idToDelete: string) {
        await deleteBanner(id, idToDelete);
    }

    return (
        <main className="space-y-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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
                <DialogContent className="bg-light-background text-white sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-white">Add a campaign banner</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Give your creative a clear name, choose where it should send people, and upload the image.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(handleAddBanner)} className="space-y-4">
                        <Input
                            label="Banner name"
                            placeholder="Summer launch hero"
                            aria-invalid={Boolean(errors.name)}
                            error={errors.name?.message}
                            {...register("name")}
                        />
                        <Input
                            label="Destination URL"
                            type="url"
                            placeholder="https://example.com/landing-page"
                            aria-invalid={Boolean(errors.destinationUrl)}
                            error={errors.destinationUrl?.message}
                            {...register("destinationUrl")}
                        />
                        <div>
                            <label htmlFor="banner-image" className="mb-1 block text-sm font-medium text-white">
                                Banner image
                            </label>
                            <input
                                id="banner-image"
                                type="file"
                                accept="image/*"
                                aria-invalid={Boolean(errors.image)}
                                className="w-full rounded-lg border border-dashed border-gray-600 bg-black/10 px-3 py-3 text-sm text-gray-300 file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                                onChange={(event) => {
                                    setValue("image", event.target.files?.[0] as File, { shouldValidate: true });
                                }}
                            />
                            {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>}
                        </div>
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
                        <h2 id="banner-library-heading" className="text-lg font-semibold text-white">Banner library</h2>
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