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
import DraftCard from "./components/storedCard";
import ActiveCard from "./components/activeCard";
import { getStatusColor } from "@/data/constants";
import StoredCampaignCard from "./components/storedCard";


export default function AdvertiserCampaignPage() {
    const clearDraft = useStore((state) => state.clearDraft);
    const {
        totalActiveCampaigns,
        scheduledCampaigns,
        totalQueuedCampaigns,
        totalScheduledCampaigns,
        queuedCampaigns,
        getCampaigns,
        activeCampaigns,
        totalCampaigns,
        storedCampaigns,
        totalStoredCampaigns,
    } = useCampaign();
    const router = useRouter();

    useEffect(() => {
        getCampaigns();
    }, [getCampaigns]);

    return (
        <div>
            <div className="flex items-center justify-between mb-2 border-b border-gray-700">
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
                                Running Campaigns{" "}
                                <span className="rounded-full bg-primary/40 px-2 py-0.5 text-white">{totalActiveCampaigns || 0}</span>
                            </p>
                        </TabsTrigger>
                        <TabsTrigger value="assigned" className="cursor-pointer">
                            <p className="text-white">
                                Upcoming Campaigns{" "}
                                <span className="rounded-full bg-primary/40 px-2 py-0.5 text-white">{totalScheduledCampaigns || 0}</span>
                            </p>
                        </TabsTrigger>
                        <TabsTrigger value="queued" className="cursor-pointer">
                            <p className="text-white">
                                Queued Campaigns{" "}
                                <span className="rounded-full bg-primary/40 px-2 py-0.5 text-white">{totalQueuedCampaigns || 0}</span>
                            </p>
                        </TabsTrigger>
                        <TabsTrigger value="stored" className="cursor-pointer">
                            <p className="text-white">
                                Stored Campaigns{" "}
                                <span className="rounded-full bg-primary/40 px-2 py-0.5 text-white">{totalStoredCampaigns || 0}</span>
                            </p>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="active">
                        <ActiveCard items={activeCampaigns} />
                    </TabsContent>
                    <TabsContent value="assigned">
                        <CampaignCard items={scheduledCampaigns} />
                    </TabsContent>
                    <TabsContent value="queued">
                        <DraftCard items={queuedCampaigns} />
                    </TabsContent>
                    <TabsContent value="stored">
                        <StoredCampaignCard items={storedCampaigns} />
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    )
}