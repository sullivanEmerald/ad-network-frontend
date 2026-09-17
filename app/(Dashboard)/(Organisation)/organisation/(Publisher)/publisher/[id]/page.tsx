"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Ellipsis, ExternalLink, LoaderCircle, Plus } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/shallow";
import CampaignHeader from "@/components/campaign/header";
import Button from "@/components/common/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store/store";
import { Loader } from "@/components/common/loader";
import { NotFoundComponent } from "@/components/common/notFound";
import RightDialog from "@/components/common/right-dialog";
import Input from "@/components/common/input";
import { zoneSchema, type ZoneFormData } from "@/lib/schemas/zone-schema";
import { showToaster } from "@/components/common/toast";
import { LineLoader } from "@/components/common/lineLoader";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const zonePresets = [
    { width: 728, height: 90, label: "Leaderboard" },
    { width: 300, height: 250, label: "Medium Rectangle" },
    { width: 320, height: 50, label: "Mobile Banner" },
    { width: 320, height: 100, label: "Large Mobile Banner" },
    { width: 336, height: 280, label: "Large Rectangle" },
    { width: 300, height: 600, label: "Half Page" },
    { width: 970, height: 250, label: "Billboard" },
];

const codeZoneTypes = [
    { value: 0, label: "Banner, Button or Rectangle (standard banner)" },
    { value: 1, label: "Interstitial / Floating DHTML" },
    { value: 2, label: "Text ad" },
    { value: 3, label: "Email/Newsletter" },
    { value: 4, label: "Inline Video ad" },
    { value: 5, label: "Overlay Video ad" },
];

export default function PublisherDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState("overview");
    const { publisher, publisherZones, createZone, getPublisherDetails, getPublisherZones, isLoading, iscreatingZone } = useStore(useShallow((state) => ({
        publisher: state.publisher,
        publisherZones: state.publisherZones,
        createZone: state.createZone,
        getPublisherDetails: state.getPublisherDetails,
        getPublisherZones: state.getPublisherZones,
        isLoading: state.publisherState.isGettingPublisherDetails,
        iscreatingZone: state.publisherState.isCreatingZone
    })));
    const [open, setIsOpen] = useState(false)
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<ZoneFormData>({
        resolver: zodResolver(zoneSchema),
        defaultValues: {
            name: "Homepage Leaderboard",
            width: 728,
            height: 90,
            type: 0,
            description: "Top advertising placement",
        },
    });
    const selectedWidth = useWatch({ control, name: "width" });
    const selectedHeight = useWatch({ control, name: "height" });
    const selectedType = useWatch({ control, name: "type" });

    useEffect(() => {
        if (id) {
            getPublisherDetails(id);
            getPublisherZones(id);
        }
    }, [getPublisherDetails, getPublisherZones, id]);

    if (!publisher) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <LoaderCircle className="animate-spin text-gray-400" aria-label="Loading publisher details" />
            </div>
        );
    }

    const zones = publisherZones.length > 0 ? publisherZones : (publisher.zones ?? []);

    const onSubmit = async (data: ZoneFormData) => {
        if (!id) return;

        const resolvedData = {
            ...data,
            type: data.type.toString() as ZoneFormData["type"]
        }

        try {
            await createZone(id, resolvedData);
            showToaster("Zone created successfully!", "success");
            reset();
            setIsOpen(false);
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message
                : undefined;
            showToaster(message || "Failed to create zone", "error");
        }
    };
    return (
        <div className="flex flex-col gap-6">
            <CampaignHeader title="Publisher Details" description="Manage this publisher's inventory and performance." />

            {isLoading ? (
                <Loader />
            ) : publisher === null ? (
                <>
                    <NotFoundComponent title="Publisher not found" subTitle="Visit the publishers page. try again" />
                </>
            ) : (
                <main>
                    <section className="border-b border-white/10 pb-5">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-semibold text-white">{publisher.name}</h1>
                                <a className="mt-1 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white" href={publisher.website} target="_blank" rel="noreferrer">
                                    {publisher.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                                    <ExternalLink className="size-3.5" />
                                </a>
                            </div >
                            <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300">Active</span>
                        </div >
                    </section >

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList variant="line" className="">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="zones">Zones</TabsTrigger>
                            <TabsTrigger value="statistics">Statistics</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="pt-6">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-xl border border-white/10 bg-light-background/70 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Contact</p>
                                    <p className="mt-3 font-medium text-gray-200">{publisher.contactName}</p>
                                    <p className="mt-1 text-sm text-gray-400">{publisher.emailAddress}</p>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-light-background/70 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Inventory</p>
                                    <p className="mt-3 text-2xl font-semibold text-white">{zones.length}</p>
                                    <p className="mt-1 text-sm text-gray-400">active zones</p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="zones" className="pt-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Zones</h2>
                                    <p className="mt-1 text-sm text-gray-400">{zones.length} active zones</p>
                                </div>
                                <Button type="button" className="shrink-0 px-4" onClick={() => setIsOpen(true)}>
                                    <Plus className="size-4" />
                                    Add Zone
                                </Button>
                            </div>
                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {zones.map((zone) => (
                                    <div key={zone.id} className="flex min-h-44 flex-col justify-between rounded-xl border border-white/10 bg-light-background/70 p-5 transition-colors hover:border-primary/40 hover:bg-light-background">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="truncate font-semibold text-white">{zone.name}</h3>
                                                <p className="mt-2 text-sm text-gray-400">{zone.width} x {zone.height}px</p>
                                                <p className="mt-1 text-sm text-gray-500">{zone.type}</p>
                                            </div>
                                            <button type="button" className="shrink-0 rounded-md p-2 text-gray-400 hover:bg-white/10 hover:text-white" aria-label={`More actions for ${zone.name}`}>
                                                <Ellipsis className="size-5" />
                                            </button>
                                        </div>
                                        <div className="mt-5 flex items-center gap-2 text-sm text-green-300">
                                            <span className="size-2 rounded-full bg-green-400" />
                                            {zone.status === "active" ? "Active" : zone.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="statistics" className="pt-6">
                            <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-sm text-gray-400">Statistics will appear once this publisher has traffic.</div>
                        </TabsContent>
                    </Tabs>
                </main >
            )}
            <RightDialog
                open={open}
                onOpenChange={setIsOpen}
                title={"Add Zone"}
                description="Specify publisher's zone for ads"
                footer={
                    <>
                        <Button type="submit" form="create-zone-form" disabled={iscreatingZone} className="">
                            {iscreatingZone ? (
                                <div className="flex items-center gap-2">
                                    <LineLoader />
                                    <span>Creating Zone</span>
                                </div>
                            ) : (
                                "Create Zone"
                            )}
                        </Button>
                        <Button type="button" variant="outline"
                            onClick={() => {
                                setIsOpen(false)
                                reset();
                            }}
                        >
                            Cancel
                        </Button>
                    </>
                }
            >
                <form id="create-zone-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
                    <div>
                        <p className="mb-3 text-sm font-medium text-white">Size presets</p>
                        <div className="grid grid-cols-2 gap-2">
                            {zonePresets.map((preset) => (
                                <button
                                    key={`${preset.width}x${preset.height}`}
                                    type="button"
                                    aria-pressed={selectedWidth === preset.width && selectedHeight === preset.height}
                                    className={`rounded-lg border px-3 py-2 text-left text-xs transition ${selectedWidth === preset.width && selectedHeight === preset.height
                                        ? "border-primary bg-primary/10 text-white"
                                        : "border-white/10 text-gray-300 hover:border-primary hover:bg-primary/10 hover:text-white"
                                        }`}
                                    onClick={() => {
                                        setValue("width", preset.width, { shouldValidate: true });
                                        setValue("height", preset.height, { shouldValidate: true });
                                    }}
                                >
                                    <span className="block font-semibold text-white">{preset.width} x {preset.height}</span>
                                    <span>{preset.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <Input label="Zone name" placeholder="Homepage Leaderboard" error={errors.name?.message} {...register("name")} />
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Width (px)" type="number" min={1} error={errors.width?.message} {...register("width", { valueAsNumber: true })} />
                        <Input label="Height (px)" type="number" min={1} error={errors.height?.message} {...register("height", { valueAsNumber: true })} />
                    </div>
                    <Input label="Description" placeholder="Top advertising placement" error={errors.description?.message} {...register("description")} />
                    <div>
                        <label htmlFor="zone-type" className="mb-1 block text-sm font-medium text-white">CodeZone type</label>
                        <Select
                            value={String(selectedType)}
                            onValueChange={(value) => setValue("type", Number(value) as ZoneFormData["type"], { shouldDirty: true, shouldValidate: true })}
                        >
                            <SelectTrigger id="zone-type" className="w-full">
                                <SelectValue className="text-white">
                                    {codeZoneTypes.find((zoneType) => zoneType.value === selectedType)?.label ?? "Select a zone type"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {codeZoneTypes.map((zoneType) => (
                                    <SelectItem key={zoneType.value} value={String(zoneType.value)}>
                                        {zoneType.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
                    </div>
                </form>
            </RightDialog>
        </div >
    );
}
