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
import type { ZoneAds } from "@/types/zone";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function LinkedCampaigns({ zoneId }: { zoneId: string }) {
    const { assignedCampaign, isFetching, unlinkZoneFromCampaign, unlinkingCampaignId } = useStore(
        useShallow((state) => ({
            assignedCampaign: state.assignedCampaign,
            isFetching: state.zoneCampaignState.isFetching,
            unlinkZoneFromCampaign: state.unlinkZoneFromCampaign,
            unlinkingCampaignId: state.zoneCampaignState.unlinkingCampaignId,
        })),
    );
    const [campaignToUnlinkId, setCampaignToUnlinkId] = useState<string | null>(null);
    const startDate = assignedCampaign ? new Date(assignedCampaign.startDate) : null;
    const endDate = assignedCampaign ? new Date(assignedCampaign.endDate) : null;
    const hasValidDates = startDate !== null && endDate !== null &&
        !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime());
    const formatDate = (date: Date) => date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

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
                title="Connected campaign"
                subtitle="Campaign assigned connected to this zone."
            />
            {assignedCampaign ? (
                <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-3">
                    <section
                        aria-label="Connected campaign"
                        className="rounded-xl border border-gray-700 bg-light-background p-5 transition-colors hover:border-gray-500"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            {/* <DisplayAvatar name={assignedCampaign?.campaignName} /> */}
                            <div className="min-w-0">
                                <h3 className="truncate font-semibold text-white">
                                    {assignedCampaign.campaignName || "Untitled campaign"}
                                </h3>
                                <p className="mt-1 truncate text-sm text-gray-400">
                                    Advertised by {assignedCampaign.advertiser?.advertiserName || "Unknown advertiser"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-gray-700 pt-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Campaign period
                                </p>
                                <p className="mt-1 text-sm text-gray-300">
                                    {hasValidDates && startDate && endDate
                                        ? `${formatDate(startDate)} – ${formatDate(endDate)}`
                                        : "Dates unavailable"}
                                </p>
                            </div>

                            <div
                                className="rounded-lg bg-white/5 px-3 py-2 text-right"
                                aria-label={`${assignedCampaign.matchingBannerCount} matching banners`}
                            >
                                <p className="text-lg font-semibold text-white">
                                    {assignedCampaign.matchingBannerCount}
                                </p>
                                <p className="text-xs text-gray-400">
                                    matching {assignedCampaign.matchingBannerCount === 1 ? "banner" : "banners"}
                                </p>
                            </div>

                            <Button
                                className="ml-auto bg-red-500 hover:bg-red-600"
                                size="sm"
                                disabled={unlinkingCampaignId !== null}
                                onClick={() => setCampaignToUnlinkId(assignedCampaign._id || null)}
                            >
                                Disconnect this campaign
                            </Button>
                        </div>
                    </section>
                </div>
            ) : (
                <NotFoundComponent
                    title="No connected campaign"
                    subTitle="Link a matched campaign to connect it to this zone."
                />
            )}

            <Dialog
                open={campaignToUnlinkId !== null}
                onOpenChange={(open) => {
                    if (!open && unlinkingCampaignId === null) setCampaignToUnlinkId(null);
                }}
            >
                <DialogContent className="border-gray-700 bg-light-background text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Unlink this campaign?</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            This campaign will be removed from the zone and returned to the matched campaigns list.
                        </DialogDescription>
                    </DialogHeader>
                    {assignedCampaign && (
                        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                            {/* <DisplayAvatar name={assignedCampaign.campaignName || "Campaign"} /> */}
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-white">
                                    {assignedCampaign.campaignName || "Untitled campaign"}
                                </p>
                                <p className="truncate text-sm text-gray-400">
                                    {assignedCampaign.advertiser?.advertiserName || "Unknown advertiser"}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    {assignedCampaign.matchingBannerCount} matching {assignedCampaign.matchingBannerCount === 1 ? "banner" : "banners"}
                                </p>
                            </div>
                        </div>
                    )}
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
                            disabled={!campaignToUnlinkId || unlinkingCampaignId !== null}
                            onClick={() => void confirmUnlink()}
                        >
                            {unlinkingCampaignId === campaignToUnlinkId ? <LineLoader /> : "Continue"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}
