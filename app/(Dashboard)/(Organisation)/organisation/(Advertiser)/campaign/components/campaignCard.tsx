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

type CampaignCardProps = {
    items: Array<Partial<CampaignRecord> & { id: string }>;
};

function formatDate(value?: string | Date | null) {
    if (!value) return "Not set";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "Not set"
        : date.toLocaleDateString(undefined, { dateStyle: "medium" });
}

function formatLabel(value?: string | null) {
    if (!value) return "Not set";
    return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatGeo(geo?: CampaignRecord["geo"]) {
    if (!geo?.length) return "Not set";
    return geo.map((location) => location.label).join(", ");
}

function formatDevices(devices?: CampaignRecord["devices"]) {
    if (!devices?.length) return "Not set";
    return devices.map(formatLabel).join(", ");
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
            <dd className="text-sm text-white">{value || "Not set"}</dd>
        </div>
    );
}

export default function CampaignCard({ items }: CampaignCardProps) {
    const { isloading } = useCampaign();
    const router = useRouter();

    const createCampaign = () => {
        router.push('/organisation/campaign/new')
    }

    return (
        <>
            {isloading ? (
                <Loader />
            ) : items.length < 1 ? (
                <NotFoundComponent title="No Campaign for this filter. Reselect or Create Campaign" buttonText="Create Campaign" onButtonClick={createCampaign} />
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((campaign) => {
                        const isDraft = campaign.status?.toUpperCase() === "DRAFT";
                        const statusLabel = campaign.status?.toUpperCase() === "ACTIVE"
                            ? campaign.isSchedule ? "Scheduled" : "Active"
                            : campaign.status?.toUpperCase() === "DRAFT" ? "Draft" : formatLabel(campaign.status);
                        const budget = campaign.budgetAmount
                            ? `$${campaign.budgetAmount.toLocaleString()} ${campaign.budgetType === "daily" ? "/ day" : "total"}`
                            : "Not set";

                        return (
                            <Card key={campaign.id} className="border border-gray-700 bg-transparent text-white">
                                <CardHeader className="gap-3 border-b border-gray-700">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <CardTitle className="truncate text-base text-white">
                                                {campaign.campaignName || "Untitled campaign"}
                                            </CardTitle>
                                            <p className="mt-1 text-sm text-gray-400">{formatLabel(campaign.objective)}</p>
                                        </div>
                                        <span
                                            className={cn(
                                                "shrink-0 rounded-full px-2 py-1 text-xs capitalize",
                                                statusLabel === "Active" || statusLabel === "Scheduled"
                                                    ? "bg-primary/20 text-primary"
                                                    : "bg-white/10 text-gray-300"
                                            )}
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
                                    <div className="sm:col-span-2">
                                        {isDraft ? (
                                            <Button
                                                className="w-full"
                                                onClick={() => router.push(organisationEndpoints.getDraft(campaign.draftId ?? campaign.id))}
                                            >
                                                Continue
                                            </Button>
                                        ) : (
                                            <CampaignDialog campaign={campaign} budget={budget} />
                                        )}
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

