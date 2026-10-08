import { useShallow } from "zustand/shallow";
import { useStore } from "@/store/store";
import { Loader } from "@/components/common/loader";
import DisplayAvatar from "@/components/common/avatar";
import Button from "@/components/common/button";
import { LineLoader } from "@/components/common/lineLoader";
import CampaignSectionHeader from "./header";
import { NotFoundComponent } from "@/components/common/notFound";

export default function MatchedCampaigns({ zoneId }: { zoneId: string }) {
    const { zoneCampaigns, isFetching, assignedCampaign, linkingCampaignId, linkZoneToCampaign } = useStore(
        useShallow((state) => ({
            zoneCampaigns: state.zoneCampaigns,
            isFetching: state.zoneCampaignState.isFetching,
            error: state.zoneCampaignState.error,
            linkZoneToCampaign: state.linkZoneToCampaign,
            linkingCampaignId: state.zoneCampaignState.linkingCampaignId,
            assignedCampaign: state.assignedCampaign,
        })),
    );

    return (
        <main className="space-y-8">
            <CampaignSectionHeader
                title="Matched Campaigns"
                subtitle="These campaigns have banners that match the size of this zone."
            />
            {zoneCampaigns.length === 0 ? (
                <NotFoundComponent title={assignedCampaign ? "There are no other matching campaigns" : "No matched campaigns"} subTitle="There are no campaigns with banners that match the size of this zone." />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {zoneCampaigns.map((campaign) => {
                        const startDate = new Date(campaign.startDate);
                        const endDate = new Date(campaign.endDate);
                        const hasValidDates =
                            !Number.isNaN(startDate.getTime()) &&
                            !Number.isNaN(endDate.getTime());
                        const now = new Date();
                        const status = !hasValidDates
                            ? "Dates unavailable"
                            : now < startDate
                                ? "Upcoming"
                                : now > endDate
                                    ? "Ended"
                                    : "Active";
                        const formatDate = (date: Date) =>
                            date.toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            });

                        return (
                            <section
                                key={campaign._id}
                                className="rounded-xl border border-gray-700 bg-light-background p-5 transition-colors hover:border-gray-500"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex flex-col min-w-0 items-center">
                                        <DisplayAvatar name={campaign.campaignName || "Campaign"} />
                                        <div className="min-w-0">
                                            <p className="mt-1 truncate text-sm text-gray-400 italic">
                                                <span className="">Advertised by - </span>
                                                {campaign.advertiser?.advertiserName || "Unknown advertiser"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-700 pt-4">
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
                                        className={`ml-auto ${assignedCampaign ? "cursor-not-allowed opacity-50" : ""}`}
                                        onClick={() => void linkZoneToCampaign(zoneId, campaign._id)}
                                        disabled={linkingCampaignId !== null || assignedCampaign !== null}
                                    >
                                        {linkingCampaignId === campaign._id
                                            ? <LineLoader />
                                            : "Link to this campaign"}
                                    </Button>
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </main>
    )
}