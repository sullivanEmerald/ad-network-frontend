"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import CampaignHeader from "@/components/campaign/header";
import Button from "@/components/common/button";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";
import { advertiserSchema, type AdvertiserFormData } from "@/lib/schemas/advertiser-schema";
import Input from '@/components/common/input';
import { showToaster } from "@/components/common/toast";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/shallow";


export default function AdvertisersPage() {
    const [open, setOpen] = useState(false);
    const { advertiser, createAdvertiser, getAdvertiser, isLoading } = useStore(useShallow((state) => ({
        advertiser: state.advertiser,
        createAdvertiser: state.createAdvertiser,
        getAdvertiser: state.getAdvertiser,
        isLoading: state.advertiserState.isLoading,
    })));
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AdvertiserFormData>({
        resolver: zodResolver(advertiserSchema),
        defaultValues: { name: "", email: "" },
    });

    const onSubmit = async (data: AdvertiserFormData) => {
        try {
            await createAdvertiser(data);
            await getAdvertiser();
            showToaster("Advertiser created successfully!", "success");
            reset();
            setOpen(false);
        } catch (error: any) {
            console.error("Error creating advertiser:", error);
            showToaster(error.response?.data?.message || "Failed to create advertiser", "error");
        }
    };

    useEffect(() => {
        getAdvertiser().catch((error: any) => {
            showToaster(error.response?.data?.message || "Failed to load advertiser", "error");
        });
    }, [])

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between">
                <CampaignHeader title="Advertisers" description="Manage your advertisers and their campaigns." />
                <Popover
                    open={open}
                    onOpenChange={(nextOpen) => {
                        if (!isLoading) setOpen(nextOpen);
                    }}
                >
                    <PopoverTrigger render={<Button>Create Advertiser</Button>} />
                    <PopoverContent align="end" className="w-80 p-4 bg-light-background">
                        <PopoverHeader className="mb-2">
                            <PopoverTitle className="text-lg font-semibold text-white">Create advertiser</PopoverTitle>
                            <PopoverDescription className="text-sm text-gray-400">
                                Add the advertiser details to get started.
                            </PopoverDescription>
                        </PopoverHeader>
                        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-1.5">
                                <Input
                                    id="advertiser-name"
                                    label="Advertiser name / Company"
                                    placeholder="Acme Inc."
                                    aria-invalid={Boolean(errors.name)}
                                    disabled={isLoading}
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-xs text-destructive">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Input
                                    id="advertiser-email"
                                    type="email"
                                    label="Advertiser email"
                                    placeholder="hello@acme.com"
                                    aria-invalid={Boolean(errors.email)}
                                    disabled={isLoading}
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive">{errors.email.message}</p>
                                )}
                            </div>
                            <Button type="submit" disabled={isLoading} className="mt-1 w-full">
                                {isLoading && <LoaderCircle className="animate-spin" />}
                                {isLoading ? "Creating..." : "Create advertiser"}
                            </Button>
                        </form>
                    </PopoverContent>
                </Popover>
            </div>
            <section className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-light-background/70 shadow-xl shadow-black/10">
                <div className="border-b border-white/10 px-5 py-4 sm:px-6">
                    <h2 className="text-base font-semibold text-gray-200">Advertiser records</h2>
                    <p className="mt-1 text-sm text-gray-500">Your connected advertiser accounts.</p>
                </div>
                {advertiser ? (
                    <div className="grid gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-center sm:px-6">
                        <div className="min-w-0">
                            <p className="truncate font-medium text-gray-200">{advertiser.name}</p>
                            <p className="mt-1 truncate text-sm text-gray-500">{advertiser.email}</p>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-600">Record ID</p>
                            <p className="mt-1 truncate font-mono text-xs text-gray-400">{advertiser.id}</p>
                        </div>
                        <span className="w-fit rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            Active
                        </span>
                    </div>
                ) : (
                    <div className="px-5 py-12 text-center sm:px-6">
                        <p className="font-medium text-gray-300">No advertisers yet</p>
                        <p className="mt-1 text-sm text-gray-500">Create an advertiser to see the record here.</p>
                    </div>
                )}
            </section>
        </div>
    )
}