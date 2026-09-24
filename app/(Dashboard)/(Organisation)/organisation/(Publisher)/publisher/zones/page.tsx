"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LoaderCircle, Plus, Copy, Check } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/shallow";
import CampaignHeader from "@/components/campaign/header";
import Button from "@/components/common/button";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";


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


export default function ZonePage() {
    const { zones, createZone, isLoading, iscreatingZone, getZones, isGeneratingTag, generateZoneTag } = useStore(useShallow((state) => ({
        createZone: state.createZone,
        isLoading: state.publisherState.isFetching,
        iscreatingZone: state.publisherState.isCreatingZone,
        zones: state.zones,
        getZones: state.getZone,
        isGeneratingTag: state.publisherState.isGeneratingTag,
        generateZoneTag: state.generateZoneTag,

    })));
    const router = useRouter();
    const [generatingZoneId, setGeneratingZoneId] = useState<string | null>(null);
    const [generatedTag, setGeneratedTag] = useState<string | null>(null);
    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
    const [isTagCopied, setIsTagCopied] = useState(false);
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


    useEffect(() => {
        getZones();
    }, [])

    const selectedWidth = useWatch({ control, name: "width" });
    const selectedHeight = useWatch({ control, name: "height" });
    const selectedType = useWatch({ control, name: "type" });

    const onSubmit = async (data: ZoneFormData) => {
        const resolvedData = {
            ...data,
            type: data.type.toString() as ZoneFormData["type"]
        }

        try {
            await createZone(resolvedData);
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
            <div className="flex items-center justify-between gap-4">
                <CampaignHeader title="Zones / Placements" description="Manageinventory and performance." />
                <Button type="button" className="shrink-0 px-4" onClick={() => setIsOpen(true)}>
                    <Plus className="size-4" />
                    Add Zone
                </Button>
            </div>
            {isLoading ? (
                <Loader />
            ) : zones.length === 0 ? (
                <>
                    <NotFoundComponent
                        title="No zone created yet"
                        subTitle="Create zone to start viewing inventory"
                        onButtonClick={() => setIsOpen(true)}
                        buttonText="Create Zone"
                    />

                </>
            ) : (
                <main>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {zones.map((zone) => {
                            const zoneType = codeZoneTypes.find((zoneType) => String(zoneType.value) === zone.type);
                            return (
                                <div
                                    key={zone.id}
                                    onClick={() => router.push(`/organisation/publisher/zones/${zone.id}`)}
                                    className="rounded-lg border border-gray-700 bg-light-background p-5 h-aut0 flex flex-col gap-4 cursor-pointer"
                                >
                                    <h3 className="truncate font-semibold text-gray-400 text-md">{zone.name}</h3>
                                    <p className="text-lg text-white">
                                        Dimensions: {zone.width} x {zone.height}px
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-400">Available Campaign</span>
                                        <p className="bg-primary/20 rounded-full text-white px-3 py-1">
                                            {zone.campaignsCount}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {zoneType?.label ?? "Unknown zone type"}
                                    </p>
                                    <Button
                                        type="button"
                                        disabled={isGeneratingTag && generatingZoneId === zone.id}
                                        onClick={async (event) => {
                                            event.stopPropagation();
                                            setGeneratingZoneId(zone.id);
                                            try {
                                                const response = await generateZoneTag(zone.id);
                                                if (!response.tag) {
                                                    throw new Error("The tag response was empty");
                                                }
                                                setGeneratedTag(response.tag);
                                                setIsTagCopied(false);
                                                setIsTagDialogOpen(true);
                                                showToaster("Zone tag generated successfully.", "success");
                                            } catch (err) {
                                                showToaster("Failed to generate zone tag.", "error");
                                                console.log(err)
                                            } finally {
                                                setGeneratingZoneId(null);
                                            }
                                        }}
                                    >
                                        {isGeneratingTag && generatingZoneId === zone.id ? (
                                            <LineLoader />
                                        ) : (
                                            "Generate Tag"
                                        )}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </main>
            )}
            <Dialog
                open={isTagDialogOpen}
                onOpenChange={(nextOpen) => {
                    setIsTagDialogOpen(nextOpen);
                    if (!nextOpen) setIsTagCopied(false);
                }}
            >
                <DialogContent className="bg-light-background text-white">
                    <DialogHeader>
                        <DialogTitle>Generated zone tag</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Copy this tag and add it to the publisher&apos;s page.
                        </DialogDescription>
                    </DialogHeader>
                    <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-white/10 bg-black/30 p-4 text-xs text-gray-200">
                        {generatedTag}
                    </pre>
                    <DialogFooter className="bg-light-background">
                        <Button
                            type="button"
                            onClick={async () => {
                                if (!generatedTag) return;
                                await navigator.clipboard.writeText(generatedTag);
                                setIsTagCopied(true);
                                showToaster("Tag copied to clipboard.", "success");
                            }}
                        >
                            {isTagCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
                            {isTagCopied ? "Copied" : "Copy tag"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
