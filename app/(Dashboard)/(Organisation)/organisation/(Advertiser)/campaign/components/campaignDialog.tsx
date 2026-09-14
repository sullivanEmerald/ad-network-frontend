"use client";

import { cn } from "@/lib/utils";
import type { CampaignRecord } from "@/types/campaign";
import Button from "@/components/common/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export type CampaignDialogProps = {
    campaign: Partial<CampaignRecord> & { id: string };
    budget: string;
    triggerLabel?: string;
    buttonOnClick?: () => void;
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

function CampaignStatus({ status, isSchedule }: { status?: string; isSchedule?: boolean }) {
    const normalizedStatus = status?.toUpperCase();
    const label = normalizedStatus === "ACTIVE"
        ? isSchedule ? "Scheduled" : "Active"
        : normalizedStatus === "DRAFT" ? "Draft" : formatLabel(status);

    return (
        <span className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
            label === "Active" || label === "Scheduled"
                ? "bg-primary/20 text-primary"
                : "bg-white/10 text-gray-300",
        )}>
            {label}
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
            <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
            <dd className="text-sm text-white">{value || "Not set"}</dd>
        </div>
    );
}

export default function CampaignDialog({ campaign, budget, triggerLabel = "View more" }: CampaignDialogProps) {
    return (
        <Dialog>
            <DialogTrigger render={<Button>{triggerLabel}</Button>}>
                {triggerLabel}
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] w-full overflow-y-auto bg-light-background sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-white">{campaign.campaignName || "Untitled campaign"}</DialogTitle>
                    <DialogDescription className="text-gray-400">Campaign Overview</DialogDescription>
                </DialogHeader>
                <div className="space-y-8 py-2">
                    <DetailSection title="Overview">
                        <dl className="grid gap-5 sm:grid-cols-2">
                            <Detail label="Campaign name" value={campaign.campaignName} />
                            <Detail label="Status" value={<CampaignStatus status={campaign.status} isSchedule={campaign.isSchedule} />} />
                            <Detail label="Objective" value={formatLabel(campaign.objective)} />
                        </dl>
                    </DetailSection>
                    <DetailSection title="Budget and schedule">
                        <dl className="grid gap-5 sm:grid-cols-2">
                            <Detail label="Budget type" value={formatLabel(campaign.budgetType)} />
                            <Detail label="Budget amount" value={budget} />
                            <Detail label="Pacing" value={formatLabel(campaign.pacing)} />
                            <Detail label="Delivery" value={campaign.isSchedule ? "Scheduled delivery" : "Immediate delivery"} />
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
            </DialogContent>
        </Dialog>
    );
}


