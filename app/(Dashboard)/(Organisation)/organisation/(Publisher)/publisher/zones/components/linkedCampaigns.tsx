import { useState } from "react";
import DisplayAvatar from "@/components/common/avatar";
import CampaignSectionHeader from "./header";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/shallow";
import { NotFoundComponent } from "@/components/common/notFound";
import { Loader } from "@/components/common/loader";
import Button from "@/components/common/button";
import { LineLoader } from "@/components/common/lineLoader";
import { showToaster } from "@/components/common/toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function LinkedCampaigns({ zoneId }: { zoneId: string }) {
    const { connectedZoneCampaigns: linkedCampaigns, isFetching, unlinkZoneFromCampaign, unlinkingCampaignId } = useStore(
        useShallow((state) => ({
            connectedZoneCampaigns: state.connectedZoneCampaigns,
            isFetching: state.zoneCampaignState.isFetching,
            unlinkZoneFromCampaign: state.unlinkZoneFromCampaign,
            unlinkingCampaignId: state.zoneCampaignState.unlinkingCampaignId,
        })),
    );
    const [campaignToUnlinkId, setCampaignToUnlinkId] = useState<string | null>(null);
    const campaignToUnlink = linkedCampaigns.find((campaign) => campaign._id === campaignToUnlinkId);

    const confirmUnlink = async () => {
        if (!campaignToUnlinkId) return;

        try {
            await unlinkZoneFromCampaign(zoneId, campaignToUnlinkId);
            showToaster("Campaign unlinked from this zone.", "success");
            setCampaignToUnlinkId(null);
        } catch {
            showToaster("Unable to unlink this campaign. Please try again.", "error");
        }
    };

    return (
        <section className="space-y-6">
            <CampaignSectionHeader
                title="Connected campaigns"
                subtitle="Campaigns currently connected to this zone."
            />

            {isFetching ? (
                <Loader />
            ) : linkedCampaigns.length === 0 ? (
                <NotFoundComponent
                    title="No connected campaigns"
                    subTitle="There are no campaigns connected to this zone yet. Match and connect a campaign to see it listed here."
                    className="bg-light-background outline-gray-700"
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-3">
                    {linkedCampaigns.map((campaign) => {
                        const startDate = new Date(campaign.startDate);
                        const endDate = new Date(campaign.endDate);
                        const hasValidDates = !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime());
                        const formatDate = (date: Date) => date.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        });

                        return (
                            <section
                                key={campaign._id}
                                className="rounded-xl border border-gray-700 bg-light-background p-5 transition-colors hover:border-gray-500"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <DisplayAvatar name={campaign.campaignName || "Campaign"} />
                                    <div className="min-w-0">
                                        <p className="mt-1 truncate text-sm text-gray-400">
                                            Advertised by {campaign.advertiser?.advertiserName || "Unknown advertiser"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-gray-700 pt-4">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Campaign period
                                        </p>
                                        <p className="mt-1 text-sm text-gray-300">
                                            {hasValidDates
                                                ? `${formatDate(startDate)} – ${formatDate(endDate)}`
                                                : "Dates unavailable"}
                                        </p>
                                    </div>

                                    <div
                                        className="rounded-lg bg-white/5 px-3 py-2 text-right"
                                        aria-label={`${campaign.matchingBannerCount} matching banners`}
                                    >
                                        <p className="text-lg font-semibold text-white">
                                            {campaign.matchingBannerCount}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            matching {campaign.matchingBannerCount === 1 ? "banner" : "banners"}
                                        </p>
                                    </div>

                                    <Button
                                        className="ml-auto bg-red-500 hover:bg-red-600"
                                        size="sm"
                                        disabled={unlinkingCampaignId !== null}
                                        onClick={() => setCampaignToUnlinkId(campaign._id)}
                                    >
                                        Unlink this campaign
                                    </Button>
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}

            <Dialog
                open={campaignToUnlink !== undefined}
                onOpenChange={(open) => {
                    if (!open && unlinkingCampaignId === null) setCampaignToUnlinkId(null);
                }}
            >
                <DialogContent className="bg-light-background text-white" showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Unlink campaign?</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            {campaignToUnlink
                                ? `Are you sure you want to unlink “${campaignToUnlink.campaignName}” from this zone?`
                                : "Are you sure you want to unlink this campaign from the zone?"}
                            {" "}The campaign will return to the matched campaigns list.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            className="bg-gray-700 shadow-none hover:bg-gray-600"
                            disabled={unlinkingCampaignId !== null}
                            onClick={() => setCampaignToUnlinkId(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="bg-red-600 shadow-none hover:bg-red-700"
                            disabled={unlinkingCampaignId !== null}
                            onClick={() => void confirmUnlink()}
                        >
                            {unlinkingCampaignId === campaignToUnlinkId ? <LineLoader /> : "Unlink campaign"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}
