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
import CampaignActions from "./campaignActions";
import { bannerEndpoints } from "@/endpoints/banner";
import { formatDate, formatLabel, formatGeo, formatDevices } from "./helpers/campaign-helpers";
import { getStatusColor } from "@/data/constants";

type CampaignCardProps = {
    items: Array<Partial<CampaignRecord> & { id: string }>;
};

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

    const addBanners = (id: string) => [
        router.push(bannerEndpoints.campaignBanner(id))
    ]

    return (
        <>
            {isloading ? (
                <Loader />
            ) : items.length < 1 ? (
                <NotFoundComponent title="No Campaign for this filter. Reselect or Create Campaign" buttonText="Create Campaign" onButtonClick={createCampaign} />
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((campaign) => {

                        return (
                            <Card key={campaign.id} className="border border-gray-700 bg-transparent text-white">
                                <CardHeader className="gap-3 border-b border-gray-700">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <CardTitle className="truncate text-base text-white">
                                                {campaign.campaignName || "Untitled campaign"}
                                            </CardTitle>
                                        </div>
                                        <span
                                            className="shrink-0 rounded-full px-2 py-1 text-xs"
                                            style={{ backgroundColor: getStatusColor(campaign.status || "") }}
                                        >
                                            {campaign.status}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
                                    {/* <Detail label="Budget" value={budget} /> */}
                                    <Detail label="Schedule" value={`${formatDate(campaign.startDate)} - ${formatDate(campaign.endDate)}`} />
                                    <Detail label="Locations" value={formatGeo(campaign.geo)} />
                                    <Detail label="Devices" value={formatDevices(campaign.devices)} />
                                    <div className="flex w-full items-center justify-between sm:col-span-2">
                                        <CampaignActions campaign={campaign} buttonOnClick={() => addBanners(campaign.id)} triggerLabel='Manage' />
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

