"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { useStore } from "@/store/store";
import MatchedCampaigns from "../components/matchedCampaigns";
import LinkedCampaigns from "../components/linkedCampaigns";
import CampaignSectionHeader from "../components/header";
import Button from "@/components/common/button";
import { showToaster } from "@/components/common/toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { LoaderCircle, Plus, Copy, Check } from "lucide-react";
import { LineLoader } from "@/components/common/lineLoader";
import { Loader } from "@/components/common/loader";

export default function PlacementZone() {
    const { id } = useParams<{ id: string }>();

    const { zone, getZoneCampaigns, isGeneratingTag, isFetching, generateZoneTag, assignedCampaign } = useStore(useShallow((state) => ({
        createZone: state.createZone,
        isLoading: state.publisherState.isFetching,
        iscreatingZone: state.publisherState.isCreatingZone,
        getZones: state.getZone,
        isGeneratingTag: state.publisherState.isGeneratingTag,
        generateZoneTag: state.generateZoneTag,
        getZoneCampaigns: state.getZoneCampaigns,
        zone: state.zone,
        assignedCampaign: state.assignedCampaign,
        isFetching: state.zoneCampaignState.isFetching,

    })));
    const [generatedTag, setGeneratedTag] = useState<string | null>(null);
    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
    const [isTagCopied, setIsTagCopied] = useState(false);
    const [open, setIsOpen] = useState(false)

    useEffect(() => {
        void getZoneCampaigns(id);
    }, [getZoneCampaigns, id]);

    return (
        <main>
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <CampaignSectionHeader
                    title={zone?.name ?? "Campaigns for this zone"}
                    subtitle={zone
                        ? `Showing campaigns with banners matching ${zone.width} x ${zone.height}px.`
                        : "View campaigns with banners sized to fit this zone perfectly."}
                />
                <Button
                    type="button"
                    disabled={isGeneratingTag}
                    onClick={async () => {
                        try {
                            const response = await generateZoneTag(id);
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
                        }
                    }}
                >
                    {isGeneratingTag ? (
                        <LineLoader />
                    ) : (
                        "Generate Installation Code"
                    )}
                </Button>
            </header>
            <div className="space-y-6">
                {isFetching ? (
                    <Loader />
                ) : (
                    <>
                        {assignedCampaign && <LinkedCampaigns zoneId={id} />}
                        <MatchedCampaigns zoneId={id} />
                    </>
                )}

            </div>
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
        </main>
    );
}