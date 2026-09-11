"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import type { CampaignDraft } from "@/lib/schemas/campaign-schema";
import Button from "@/components/common/button";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import SystemLayout from "@/components/campaign/layout";
import BlockLayout from "@/components/campaign/block";
import { StatCard } from "../dashboard/components/StatCard";
import CampaignHeader from "@/components/campaign/header";
import { organisationEndpoints } from "@/endpoints/organisation";

export default function AdvertiserCampaignPage() {

    const getCampaignDraft = useStore((state) => state.getCampaignDrafts);
    const drafts = useStore((state) => state.drafts);
    const clearDraft = useStore((state) => state.clearDraft);
    const router = useRouter();


    useEffect(() => {
        getCampaignDraft();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <CampaignHeader title="Campaigns" description="Create and manage your advertising campaigns" />
                <Button
                    onClick={() => {
                        {
                            clearDraft();
                            router.push("/organisation/campaign/new")
                        }
                    }}
                    className=""
                >
                    New campaign
                </Button>
            </div>
            {drafts && drafts.length > 0 && (
                <SystemLayout>
                    {drafts.map((d) => (
                        <BlockLayout key={d.id}>
                            <div>
                                <div className="text-md truncate text-white">{d.campaignName || "Untitled campaign"}</div>
                                <p className="text-md text-gray-400">
                                    {d.lastSavedAt ? `Last edited ${new Date(d.lastSavedAt).toLocaleString()} ` : "Not saved yet"}
                                </p>
                            </div>
                            <Button
                                onClick={() => { router.push(organisationEndpoints.getDraft(d.id)) }}
                                className="w-full mt-2"
                            >
                                Resume
                            </Button>
                        </BlockLayout>
                    ))}
                </SystemLayout>
            )}
        </div>
    )
}