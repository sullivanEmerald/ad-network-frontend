"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Button from "@/components/common/button";
import RightDialog from "@/components/common/right-dialog";
import { cn } from "@/lib/utils";
import type { CampaignRecord } from "@/types/campaign";
export type { CampaignRecord } from "@/types/campaign";
import { useCampaign } from "../hooks/useCampaign";
import { NotFoundComponent } from "@/components/common/notFound";
import { Loader } from "@/components/common/loader";
import { useRouter } from "next/navigation";
import { organisationEndpoints } from "@/endpoints/organisation";
import { getStatusColor } from "@/data/constants";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/shallow";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LineLoader } from "@/components/common/lineLoader";


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

function CampaignStatus({ status, isSchedule }: { status?: string; isSchedule?: boolean }) {

    return (
        <span
            className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ backgroundColor: getStatusColor(status || "") }}>
            {status}
        </span>
    );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{title}</h3>
            {children}
        </section>
    );
}

function ValueList({ values, emptyLabel = "Not set" }: { values?: string[]; emptyLabel?: string }) {
    if (!values?.length) return <span>{emptyLabel}</span>;

    return (
        <div className="flex flex-wrap gap-2">
            {values.map((value) => (
                <span key={value} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white">
                    {formatLabel(value)}
                </span>
            ))}
        </div>
    );
}

function LocationList({ geo }: { geo?: CampaignRecord["geo"] }) {
    if (!geo?.length) return <span>Not set</span>;

    return (
        <div className="flex flex-wrap gap-2">
            {geo.map((location) => (
                <span key={location.code} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white">
                    {location.label}
                </span>
            ))}
        </div>
    );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <dt
                className={`text-xs uppercase tracking-wide text-gray-400`}
            >
                {label}
            </dt>
            <dd
                className="text-sm text-white"
            >
                {value || "Not set"}
            </dd>
        </div>
    );
}

export default function StoredCampaignCard({ items }: CampaignCardProps) {
    const { isloading } = useCampaign();
    const router = useRouter();
    const [openCampaignId, setOpenCampaignId] = useState<string | null>(null);
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
    const { getEligibleZonesForCampaign, campaignZones, launchCampaign, isLaunchingCampaign } = useStore(useShallow((state) => ({
        getEligibleZonesForCampaign: state.getEligibleZonesForCampaign,
        campaignZones: state.campaignZones,
        launchCampaign: state.launchCampaign,
        isLaunchingCampaign: state.campaignState.isCreating,
    })));


    const createCampaign = () => {
        router.push('/organisation/campaign/new')
    }

    useEffect(() => {
        if (openCampaignId) {
            void getEligibleZonesForCampaign(openCampaignId);
        }
    }, [getEligibleZonesForCampaign, openCampaignId]);

    const openCampaignDetails = (campaignId: string) => {
        setSelectedZoneId(null);
        setOpenCampaignId(campaignId);
    };

    return (
        <>
            {isloading ? (
                <Loader />
            ) : items.length < 1 ? (
                <NotFoundComponent title="No Campaign for this filter. Reselect or Create Campaign" buttonText="Create Campaign" onButtonClick={createCampaign} />
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((campaign) => {
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
                                        </div>
                                        <span
                                            className="shrink-0 rounded-full px-2 py-1 text-xs text-white"
                                            style={{ backgroundColor: getStatusColor(campaign.status?.toLowerCase() || "") }}
                                        >
                                            {campaign.status}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
                                    <Detail label="Budget" value={budget} />
                                    <Detail label="Schedule" value={`${formatDate(campaign.startDate)} - ${formatDate(campaign.endDate)}`} />
                                    <Detail label="Locations" value={formatGeo(campaign.geo)} />
                                    <Detail label="Devices" value={formatDevices(campaign.devices)} />
                                    <div className="sm:col-span-2">
                                        <Button className="w-full" onClick={() => openCampaignDetails(campaign.id)}>
                                            View more
                                        </Button>
                                    </div>
                                </CardContent>
                                <RightDialog
                                    open={openCampaignId === campaign.id}
                                    onOpenChange={(open) => {
                                        setOpenCampaignId(open ? campaign.id : null);
                                        if (!open) setSelectedZoneId(null);
                                    }}
                                    title={campaign.campaignName || "Untitled campaign"}
                                    description="Campaign Overview"
                                    footer={
                                        <>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setOpenCampaignId(null)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                disabled={isLaunchingCampaign}
                                                onClick={async () => {
                                                    try {
                                                        await launchCampaign(campaign.id, selectedZoneId);
                                                        setOpenCampaignId(null);
                                                        setSelectedZoneId(null);
                                                        router.refresh();
                                                    } catch (err) {
                                                        console.log(err)
                                                    }
                                                }}
                                            >
                                                {isLaunchingCampaign ? (
                                                    <div>
                                                        <LineLoader />
                                                        <span className="ml-2">Launching...</span>
                                                    </div>
                                                ) : (
                                                    "Launch"
                                                )}
                                            </Button>
                                        </>
                                    }
                                >
                                    <div className="space-y-8 py-2">
                                        <div className="space-y-2">
                                            <label htmlFor={`campaign-zone-${campaign.id}`} className="text-sm font-medium text-white">
                                                Choose a zone (optional)
                                            </label>
                                            <Select
                                                value={selectedZoneId}
                                                onValueChange={(value) => setSelectedZoneId(value)}
                                            >
                                                <SelectTrigger id={`campaign-zone-${campaign.id}`} className="w-full text-white">
                                                    <SelectValue placeholder="Select a zone" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {campaignZones.map((zone) => (
                                                        <SelectItem key={zone.id} value={zone.id}>
                                                            {zone.width} x {zone.height}px
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {campaignZones.length === 0 && (
                                                <p className="text-xs text-gray-400">No eligible zones available for this campaign yet.</p>
                                            )}
                                        </div>
                                        <DetailSection title="Overview">
                                            <dl className="grid gap-5 sm:grid-cols-2">
                                                <Detail label="Campaign name" value={campaign.campaignName} />
                                                <Detail label="Status" value={<CampaignStatus status={campaign.status?.toLowerCase()} isSchedule={campaign.isScheduled} />} />
                                                {/* <Detail label="Objective" value={formatLabel(campaign.objective)} /> */}
                                            </dl>
                                        </DetailSection>
                                        <DetailSection title="Budget and schedule">
                                            <dl className="grid gap-5 sm:grid-cols-2">
                                                <Detail label="Budget type" value={formatLabel(campaign.budgetType)} />
                                                <Detail label="Budget amount" value={budget} />
                                                <Detail label="Pacing" value={formatLabel(campaign.pacing)} />
                                                {/* <Detail label="Delivery" value={campaign.isSchedule ? "Scheduled delivery" : "Immediate delivery"} /> */}
                                                <Detail label="Start date" value={formatDate(campaign.startDate)} />
                                                <Detail label="End date" value={formatDate(campaign.endDate)} />
                                            </dl>
                                        </DetailSection>
                                        <DetailSection title="Targeting">
                                            <dl className="grid gap-5 sm:grid-cols-2">
                                                <Detail label="Locations" value={<LocationList geo={campaign.geo} />} />
                                                <Detail label="Devices" value={<ValueList values={campaign.devices} />} />
                                            </dl>
                                        </DetailSection>
                                        <DetailSection title="Record information">
                                            <dl className="grid gap-5 sm:grid-cols-2">
                                                <Detail label="Created" value={formatDate(campaign.createdAt)} />
                                                <Detail label="Updated" value={formatDate(campaign.updatedAt)} />
                                            </dl>
                                        </DetailSection>
                                    </div>
                                </RightDialog>
                            </Card>
                        );
                    })}
                </div>
            )}
        </>
    );
}

