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
        totalScheduledCampaigns,
        getCampaigns,
        activeCampaigns,
        totalCampaigns,
        pausedCampaigns,
        totalPausedCampaigns,
        completedCampaigns,
        totalCompletedCampaigns,
    } = useCampaign();
    const router = useRouter();

    useEffect(() => {
        getCampaigns();
    }, [getCampaigns]);

    return (
        <div>
            <div className="flex items-center justify-between mb-2 ">
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
                            <p className="text-black">
                                Running Campaigns{" "}
                                <span className="rounded-full bg-green-500 px-2 py-0.5 text-white">{totalActiveCampaigns || 0}</span>
                            </p>
                        </TabsTrigger>
                        <TabsTrigger value="assigned" className="cursor-pointer">
                            <p className="text-black/80">
                                Upcoming Campaigns{" "}
                                <span className="rounded-full bg-blue-500 px-2 py-0.5 text-white">{totalScheduledCampaigns || 0}</span>
                            </p>
                        </TabsTrigger>
                        <TabsTrigger value="paused" className="cursor-pointer">
                            <p className="text-black/80">
                                Paused Campaigns{" "}
                                <span className="rounded-full bg-primary/40 px-2 py-0.5 text-white">{totalPausedCampaigns || 0}</span>
                            </p>
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="cursor-pointer">
                            <p className="text-black/80">
                                Completed Campaigns{" "}
                                <span className="rounded-full bg-blue-500 px-2 py-0.5 text-white">{totalCompletedCampaigns || 0}</span>
                            </p>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="active">
                        <ActiveCard items={activeCampaigns} />
                    </TabsContent>
                    <TabsContent value="assigned">
                        <CampaignCard items={scheduledCampaigns} />
                    </TabsContent>
                    <TabsContent value="paused">
                        <DraftCard items={pausedCampaigns} />
                    </TabsContent>
                    <TabsContent value="completed">
                        <DraftCard items={completedCampaigns} />
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    )
}