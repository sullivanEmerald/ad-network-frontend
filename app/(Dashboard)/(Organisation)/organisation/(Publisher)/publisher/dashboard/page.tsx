"use client";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CampaignHeader from "@/components/campaign/header";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import { showToaster } from "@/components/common/toast";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { publisherSchema, type PublisherFormData } from "@/lib/schemas/publisher-schema";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/shallow";
import Publishers from "../../components/publisher";
import RightDialog from "@/components/common/right-dialog";
import { DialogClose } from "@/components/ui/dialog";
import type { Publisher } from "@/types/publisher";
import { publisherEndpoints } from "@/endpoints/publisher";
import { useRouter } from "next/navigation";

export default function PublisherDashboardPage() {
    const router = useRouter();
    const [isAddPublisherOpen, setIsAddPublisherOpen] = useState(false);
    const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
    const { createPublisher, isLoading, publisher, getAllPublishers, orgPublishers, isGettingPublishers } = useStore(useShallow((state) => ({
        createPublisher: state.createPublisher,
        isLoading: state.publisherState.isLoading,
        publisher: state.publisher,
        getAllPublishers: state.getAllPublishers,
        isGettingPublishers: state.publisherState.isFetching,
        orgPublishers: state.publishers
    })));
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PublisherFormData>({
        resolver: zodResolver(publisherSchema),
        defaultValues: {
            name: "",
            contactName: "",
            emailAddress: "",
            website: "",
            comments: "",
        },
    });

    useEffect(() => {
        getAllPublishers();
    }, [])

    const onSubmit = async (data: PublisherFormData) => {
        try {
            await createPublisher(data);
            showToaster("Publisher created successfully!", "success");
            reset();
            setIsAddPublisherOpen(false);
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message
                : undefined;
            showToaster(message || "Failed to create publisher", "error");
        }
    };

    const handleViewInventory = (publisherId: string) => {
        router.push(publisherEndpoints.publisherInventory(publisherId))
    };

    return (
        <div className="flex flex-col">
            <header className="flex items-center justify-between">
                <CampaignHeader title="Publishers" description="Manage your publisher partners." />
                <Popover
                    open={isAddPublisherOpen}
                    onOpenChange={(nextOpen) => {
                        if (!isLoading) setIsAddPublisherOpen(nextOpen);
                    }}
                >
                    <PopoverTrigger render={<Button>Add Publisher</Button>} />
                    <PopoverContent align="end" className="w-90 p-4 bg-light-background">
                        <PopoverHeader className="mb-2">
                            <PopoverTitle className="text-lg font-semibold text-white" >Create publisher</PopoverTitle>
                            <PopoverDescription className="text-sm text-gray-400">
                                Add the publisher details to get started.
                            </PopoverDescription>
                        </PopoverHeader>
                        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-1.5">
                                <Input
                                    id="publisher-name"
                                    label="Publisher name"
                                    placeholder="TechBlog"
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
                                    id="publisher-contact-name"
                                    label="Contact name"
                                    placeholder="John Doe"
                                    aria-invalid={Boolean(errors.contactName)}
                                    disabled={isLoading}
                                    {...register("contactName")}
                                />
                                {errors.contactName && (
                                    <p className="text-xs text-destructive">{errors.contactName.message}</p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Input
                                    id="publisher-email"
                                    type="email"
                                    label="Email address"
                                    placeholder="john@techblog.com"
                                    aria-invalid={Boolean(errors.emailAddress)}
                                    disabled={isLoading}
                                    {...register("emailAddress")}
                                />
                                {errors.emailAddress && (
                                    <p className="text-xs text-destructive">{errors.emailAddress.message}</p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Input
                                    id="publisher-website"
                                    type="url"
                                    label="Website"
                                    placeholder="https://techblog.com"
                                    aria-invalid={Boolean(errors.website)}
                                    disabled={isLoading}
                                    {...register("website")}
                                />
                                {errors.website && (
                                    <p className="text-xs text-destructive">{errors.website.message}</p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <label htmlFor="publisher-comments" className="block text-sm font-medium text-white">
                                    Comments
                                </label>
                                <Textarea
                                    className="text-white"
                                    id="publisher-comments"
                                    placeholder="Technology publisher"
                                    aria-invalid={Boolean(errors.comments)}
                                    disabled={isLoading}
                                    {...register("comments")}
                                />
                                {errors.comments && (
                                    <p className="text-xs text-destructive">{errors.comments.message}</p>
                                )}
                            </div>
                            <Button type="submit" disabled={isLoading} className="mt-1 w-full">
                                {isLoading && <LoaderCircle className="animate-spin" />}
                                {isLoading ? "Creating..." : "Create publisher"}
                            </Button>
                        </form>
                    </PopoverContent>
                </Popover>
            </header>
            <section className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-light-background/70 shadow-xl shadow-black/10">
                <div className="border-b border-white/10 px-5 py-4 sm:px-6">
                    <h2 className="text-base font-semibold text-gray-200">Publisher records</h2>
                    <p className="mt-1 text-sm text-gray-500">Your connected publisher accounts.</p>
                </div>
                {isGettingPublishers ? (
                    <div className="px-5 py-12 text-center sm:px-6">
                        <LoaderCircle className="mx-auto animate-spin text-gray-400" />
                        <p className="mt-3 text-sm text-gray-500">Loading publishers...</p>
                    </div>
                ) : orgPublishers.length > 0 ? (
                    <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                        {orgPublishers.map((publisher) => (
                            <Publishers
                                key={publisher.id}
                                publisher={publisher}
                                onViewInventory={handleViewInventory}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="px-5 py-12 text-center sm:px-6">
                        <p className="font-medium text-gray-300">No publishers yet</p>
                        <p className="mt-1 text-sm text-gray-500">Create a publisher to see the record here.</p>
                    </div>
                )}
            </section>
            <RightDialog
                open={Boolean(selectedPublisher)}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) setSelectedPublisher(null);
                }}
                title={selectedPublisher ? `${selectedPublisher.name} inventory` : "Publisher inventory"}
                description="Review this publisher's inventory and add an ad zone."
                footer={
                    <>
                        <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
                        <Button type="button">Add zone</Button>
                    </>
                }
            >
                {selectedPublisher && (
                    <div className="space-y-5 py-2 text-sm text-gray-300">
                        <div className="rounded-lg border border-white/10 bg-black/10 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Publisher</p>
                            <p className="mt-2 text-base font-medium text-white">{selectedPublisher.name}</p>
                            <p className="mt-1 text-gray-400">{selectedPublisher.contactName}</p>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Email</p>
                                <p className="mt-1 break-all">{selectedPublisher.emailAddress}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Website</p>
                                <p className="mt-1 break-all">{selectedPublisher.website}</p>
                            </div>
                            {selectedPublisher.comments && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Comments</p>
                                    <p className="mt-1">{selectedPublisher.comments}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </RightDialog>
        </div>
    );
}