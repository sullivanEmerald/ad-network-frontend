"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/common/button";
import CampaignDialog from "./campaignDialog";
import { cn } from "@/lib/utils";
import type { CampaignRecord } from "@/types/campaign";
export type { CampaignRecord } from "@/types/campaign";
import { useCampaign } from "../hooks/useCampaign";
import { NotFoundComponent } from "@/components/common/notFound";
import { Loader } from "@/components/common/loader";
import { useRouter } from "next/navigation";
import { organisationEndpoints } from "@/endpoints/organisation";
import { bannerEndpoints } from "@/endpoints/banner";
import CampaignActions from "./campaignActions";
import { formatDate, formatLabel, formatGeo, formatDevices } from "./helpers/campaign-helpers";
import { getStatusColor } from "@/data/constants";
import { Eye, MouseIcon, Activity } from "lucide-react";

type CampaignStatistics = {
    impressions?: number;
    clicks?: number;
    ctr?: number;
};

type CampaignCardProps = {
    items: Array<Partial<CampaignRecord> & { id: string; statistics?: CampaignStatistics }>;
};

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
            <dd className="text-sm text-white">{value || "Not set"}</dd>
        </div>
    );
}

function Metric({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
    return (
        <div className="flex min-w-0 items-center gap-2">
            <Icon aria-hidden="true" className="size-4 shrink-0 text-primary" />
            <div className="min-w-0">
                {/* <p className="truncate text-[11px] uppercase tracking-wide text-gray-400">{label}</p> */}
                <p className="truncate text-sm font-semibold text-white">{value}</p>
            </div>
        </div>
    );
}



export default function ActiveCard({ items }: CampaignCardProps) {
    const { isloading } = useCampaign();
    const router = useRouter();

    const createCampaign = () => {
        router.push('/organisation/campaign/new')
    }

    const addBanners = (id: string) => [
        router.push(bannerEndpoints.campaignBanner(id))
    ]

    return (
        <>
            {isloading ? (
                <Loader />
            ) : items.length < 1 ? (
                <NotFoundComponent title="No Campaign for this filter. Reselect or Create Campaign" subTitle="Try adjusting your filters or create a new campaign." buttonText="Create Campaign" onButtonClick={createCampaign} />
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((campaign) => {
                        const statusLabel = campaign.status?.toUpperCase() === "ACTIVE"
                            ? campaign.isScheduled ? "Scheduled" : "Active"
                            : campaign.status?.toUpperCase() === "DRAFT" ? "Draft" : formatLabel(campaign.status);
                        const budget = campaign.budgetAmount
                            ? `$${campaign.budgetAmount.toLocaleString()} ${campaign.budgetType === "daily" ? "/ day" : "total"}`
                            : "Not set";

                        return (
                            <Card key={campaign.id} className="border border-gray-700 bg-light-background text-white">
                                <CardHeader className="gap-3 border-b border-gray-700">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <CardTitle className="truncate text-base text-white">
                                                {campaign.campaignName || "Untitled campaign"}
                                            </CardTitle>
                                            {/* <p className="mt-1 text-sm text-gray-400">{formatLabel(campaign.objective)}</p> */}
                                        </div>
                                        <span
                                            className="shrink-0 rounded-full px-2 py-1 text-xs"
                                            style={{ backgroundColor: getStatusColor(campaign.status?.toLowerCase() || "") }}
                                        >
                                            {statusLabel}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
                                    <Detail label="Budget" value={budget} />
                                    <Detail label="Schedule" value={`${formatDate(campaign.startDate)} - ${formatDate(campaign.endDate)}`} />
                                    <Detail label="Locations" value={formatGeo(campaign.geo)} />
                                    <Detail label="Devices" value={formatDevices(campaign.devices)} />
                                    <div className="flex items-center gap-4" aria-label="Campaign performance">
                                        <Metric
                                            icon={Eye}
                                            // label="Impressions"
                                            value={(campaign.statistics?.impressions ?? 0).toLocaleString()}
                                        />
                                        <Metric
                                            icon={MouseIcon}
                                            // label="Clicks"
                                            value={(campaign.statistics?.clicks ?? 0).toLocaleString()}
                                        />
                                        {/* <Metric
                                            icon={Percent}
                                            label="CTR"
                                            value={`${(campaign.statistics?.ctr ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`}
                                        /> */}
                                    </div>
                                    <div className="flex w-full items-center justify-between sm:col-span-2">
                                        <CampaignActions campaign={campaign} budget={budget} buttonOnClick={() => addBanners(campaign.id)} triggerLabel='Manage' />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </>
    );
}

