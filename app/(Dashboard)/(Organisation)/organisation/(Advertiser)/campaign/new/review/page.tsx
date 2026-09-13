"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    ImageIcon,
    LayoutGrid,
    MapPin,
    Pencil,
    Rocket,
    Smartphone,
    WalletCards,
} from "lucide-react";
import {
    fullCampaignSchema,
    crossFieldRules,
    type CrossFieldRule,
} from "@/lib/schemas/campaign-schema";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import CampaignHeader from "@/components/campaign/header";

const DRAFT_ID = "we23423n4k2nkl2l";

export default function ReviewStep() {
    const { draft, createCampaign, isCreating, draftId } = useStore(useShallow((state) => ({
        draft: state.campaignDraft,
        createCampaign: state.createCampaign,
        isCreating: state.campaignState.isCreating,
        draftId: state.draftId,
    })));
    const router = useRouter();


    const schemaResult = useMemo(() => fullCampaignSchema.safeParse(draft), [draft]);
    const canLaunch = schemaResult.success;

    function editStep(path: string) {
        router.push(`/campaign/new${path}?draftId=${DRAFT_ID}`);
    }

    return (
        <div className="mx-auto max-w-6xl pb-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <main className="space-y-5">
                    <ReviewSection icon={LayoutGrid} title="Campaign basics" onAction={() => editStep("")}>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Detail label="Campaign name" value={draft?.campaignName || "Not set"} />
                            <Detail label="Objective" value={formatLabel(draft?.objective)} />
                        </div>
                    </ReviewSection>

                    <ReviewSection icon={MapPin} title="Audience & delivery" onAction={() => editStep("/targeting")}>
                        <div className="space-y-5">
                            <ChipDetail label="Locations" values={draft?.geo?.map((location) => location.label) ?? []} />
                            <ChipDetail label="Devices" values={draft?.devices ?? []} />

                        </div>
                    </ReviewSection>

                    <ReviewSection icon={WalletCards} title="Budget & schedule" onAction={() => editStep("/budget")}>
                        <div className="grid gap-5 sm:grid-cols-3">
                            <Detail label="Budget" value={draft?.budgetAmount ? `$${draft.budgetAmount.toLocaleString()}` : "Not set"} />
                            <Detail label="Budget type" value={formatLabel(draft?.budgetType)} />
                            <Detail label="Pacing" value={formatLabel(draft?.pacing)} />
                            <Detail label="Start date" value={formatDate(draft?.startDate)} />
                            <Detail label="End date" value={formatDate(draft?.endDate)} />
                        </div>
                    </ReviewSection>

                    <ReviewSection icon={ImageIcon} title="Creative assets" onAction={() => editStep("/creative")}>
                        {draft?.assets?.length ? (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {draft.assets.map((asset, index) => (
                                    <div key={`${asset.fileUrl}-${index}`} className="overflow-hidden rounded-lg bg-ink-50">
                                        <div className="aspect-[4/3] bg-ink-100">
                                            {asset.type === "image" ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={asset.fileUrl} alt={`Creative ${index + 1}`} className="h-full w-full object-cover" />
                                            ) : (
                                                <video src={asset.fileUrl} className="h-full w-full object-cover" />
                                            )}
                                        </div>
                                        <p className="truncate px-3 py-2 text-xs font-medium text-ink-700">{asset.type} creative</p>
                                    </div>
                                ))}
                            </div>
                        ) : <EmptyState text="No creative assets uploaded" />}
                    </ReviewSection>
                </main>

                <aside className="lg:sticky lg:top-6 lg:self-start">
                    <div className="rounded-xl bg-ink-950 p-5 text-white">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Launch summary</p>
                                <h2 className="mt-2 text-xl font-semibold">{draft?.campaignName || "Untitled campaign"}</h2>
                            </div>
                            <Rocket className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-4 text-sm">
                            <SummaryRow icon={CalendarDays} label="Schedule" value={formatDate(draft?.startDate)} />
                            <SummaryRow icon={WalletCards} label="Spend" value={draft?.budgetAmount ? `$${draft.budgetAmount.toLocaleString()} / ${draft.budgetType}` : "Not set"} />
                            <SummaryRow icon={Smartphone} label="Devices" value={`${draft?.devices?.length ?? 0} selected`} />
                        </div>
                        <button
                            type="button"
                            disabled={!canLaunch || isCreating}
                            onClick={() => draft && createCampaign(draft, draftId, "active")}
                            className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-ink-950 transition hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {isCreating ? "Launching..." : "Launch campaign"}
                            {!isCreating && <ChevronRight className="h-4 w-4" />}
                        </button>
                        <button type="button" onClick={() => router.back()} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                            <ArrowLeft className="h-4 w-4" />
                            Back to editing
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function WarningCallout({ rule, onDismiss }: { rule: CrossFieldRule; onDismiss: () => void }) {
    return (
        <div className="rounded-xl bg-signal-100 px-4 py-3 text-sm text-ink-900">
            <div className="flex items-start justify-between gap-3">
                <span>{rule.message}</span>
                <button type="button" onClick={onDismiss} className="shrink-0 text-xs font-medium text-ink-500 underline underline-offset-2">Dismiss</button>
            </div>
        </div>
    );
}

function ReviewSection({ icon: Icon, title, onAction, children }: { icon: typeof LayoutGrid; title: string; onAction: () => void; children: React.ReactNode }) {
    return (
        <section className="rounded-xl bg-light-background p-5 sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-emerald-800"><Icon className="h-4 w-4" /></span>
                    <h2 className="font-semibold text-white">{title}</h2>
                </div>
                <button type="button" onClick={onAction} className="flex items-center gap-1 text-xs font-semibold text-white hover:text-signal-600"><Pencil className="h-3.5 w-3.5" />Edit</button>
            </div>
            {children}
        </section>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return <div><p className="text-sm text-gray-500">{label}</p><p className="mt-1 text-md font-semibold text-white capitalize">{value}</p></div>;
}

function ChipDetail({ label, values }: { label: string; values: string[] }) {
    return <div><p className="mb-2 text-sm text-gray-500">{label}</p>{values.length ? <div className="flex flex-wrap gap-2">{values.map((value) => <span key={value} className="rounded-full border px-3 py-1.5 text-md font-medium capitalize text-white">{value}</span>)}</div> : <p className="text-sm font-semibold text-white">Not set</p>}</div>;
}

function SummaryRow({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
    return <div className="flex items-center gap-3"><Icon className="h-4 w-4 shrink-0 text-primary" /><div><p className="text-sm text-gray-500">{label}</p><p className="text-md font-semibold text-white capitalize">{value}</p></div></div>;
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
    return <div className="rounded-xl bg-danger/10 p-4 text-sm text-danger"><p className="mb-2 font-semibold">{title}</p>{children}</div>;
}

function EmptyState({ text }: { text: string }) {
    return <div className="flex items-center gap-2 rounded-lg bg-ink-50 px-4 py-5 text-md text-white"><ImageIcon className="h-4 w-4" />{text}</div>;
}

function formatLabel(value: string | undefined) {
    return value ? value.replaceAll("_", " ") : "Not set";
}

function formatDate(value: Date | undefined) {
    return value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "Not set";
}
