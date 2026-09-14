"use client"
import { useEffect } from "react";
import Button from "@/components/common/button";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import SystemLayout from "@/components/campaign/layout";
import CampaignHeader from "@/components/campaign/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CampaignCard from "./components/campaignCard";
import { useCampaign } from "./hooks/useCampaign";
import DraftCard from "./components/draftCard";
import ActiveCard from "./components/activeCard";


export default function AdvertiserCampaignPage() {
    const clearDraft = useStore((state) => state.clearDraft);
    const {
        totalActiveCampaigns,
        totalDraftsCampaigns,
        totalScheduledCampaigns,
        getCampaigns,
        draftCampaigns,
        activeCampaigns,
        scheduledCampaigns
    } = useCampaign();
    const router = useRouter();

    useEffect(() => {
        getCampaigns();
    }, [getCampaigns]);

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
            <div>
                <Tabs defaultValue="active">
                    <TabsList variant="line" className="mb-2 flex flex-row gap-8 border-none">
                        <TabsTrigger value="active" className="cursor-pointer">
                            <p className="text-white">
                                Active{" "}
                                <span className="rounded-full bg-primary/40 px-2 py-0.5 text-white">{totalActiveCampaigns || 0}</span>
                            </p>
                        </TabsTrigger>
                        <TabsTrigger value="schedule" className="cursor-pointer">
                            <p className="text-white">
                                Scheduled{" "}
                                <span className="rounded-full bg-primary/40 px-2 py-0.5 text-white">{totalScheduledCampaigns || 0}</span>
                            </p>
                        </TabsTrigger>
                        <TabsTrigger value="drafts" className="cursor-pointer">
                            <p className="text-white">
                                Drafts{" "}
                                <span className="rounded-full bg-primary/40 px-2 py-0.5 text-white">{totalDraftsCampaigns || 0}</span>
                            </p>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="active">
                        <ActiveCard items={activeCampaigns} />
                    </TabsContent>
                    <TabsContent value="schedule">
                        <CampaignCard items={scheduledCampaigns} />
                    </TabsContent>
                    <TabsContent value="drafts">
                        <DraftCard items={draftCampaigns} />
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    )
}