import { useStore } from "@/store/store"
import { useShallow } from "zustand/shallow"
import { useMemo } from "react"


export const useCampaign = () => {
    const { campaigns, getCampaigns, isloading } = useStore(useShallow((state) => ({
        campaigns: state.campaigns,
        getCampaigns: state.getCampaigns,
        isloading: state.campaignState.isGettingCampaigns
    })))

    const activeCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => campaign.status?.toLowerCase() === "assigned" && campaign.isRunning)
    }, [campaigns])

    const scheduledCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => campaign.status?.toLowerCase() === "assigned" && !campaign.isRunning)
    }, [campaigns])

    const queuedCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => campaign.status?.toLowerCase() === "queued")
    }, [campaigns])

    const completedCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => campaign.status?.toLowerCase() === "completed" && !campaign.isRunning)
    }, [campaigns])

    const storedCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => campaign.status?.toLowerCase() === "stored")
    }, [campaigns])



    return {
        getCampaigns,
        activeCampaigns,
        totalActiveCampaigns: activeCampaigns.length,
        scheduledCampaigns,
        totalScheduledCampaigns: scheduledCampaigns.length,
        queuedCampaigns,
        totalQueuedCampaigns: queuedCampaigns.length,
        completedCampaigns,
        totalCompletedCampaigns: completedCampaigns.length,
        storedCampaigns,
        totalStoredCampaigns: storedCampaigns.length,
        campaigns,
        totalCampaigns: campaigns.length,
        isloading
    }
}