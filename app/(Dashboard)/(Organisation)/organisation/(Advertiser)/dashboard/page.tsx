"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import type { CampaignDraft } from "@/lib/schemas/campaign-schema";
import CampaignHeader from "@/components/campaign/header";
import Button from "@/components/common/button";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import SystemLayout from "@/components/campaign/layout";
import BlockLayout from "@/components/campaign/block";
import { StatCard } from "./components/StatCard";



export default function CampaignsPage() {
    const getCampaignDraft = useStore((state) => state.getCampaignDrafts);
    const drafts = useStore((state) => state.drafts);
    const router = useRouter();

    useEffect(() => {
        getCampaignDraft();
    }, []);


    return (
        <div className="">
            <div className="flex items-center justify-between mb-4">
                <CampaignHeader title="Overview" description="Overview of your advertising activity." />
                <Button
                    onClick={() => { router.push("/organisation/campaign/new") }}
                    className=""
                >
                    New campaign
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Campaigns" value={"10"} />
                <StatCard title="Active Campaigns" value={"5"} />
                <StatCard
                    title="Impressions"
                    value="0"
                />
                <StatCard
                    title="Clicks"
                    value="0"
                />
                <StatCard
                    title="CTR"
                    value="0%"
                />

                <StatCard
                    title="Spend"
                    value="$0"
                />
            </div>
        </div>
    );
}
