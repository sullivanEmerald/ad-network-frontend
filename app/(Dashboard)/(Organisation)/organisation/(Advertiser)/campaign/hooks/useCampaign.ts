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
        return campaigns.filter((campaign) => campaign.status?.toLowerCase() === "active" && campaign.isRunning)
    }, [campaigns])

    const scheduledCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => campaign.status?.toLowerCase() === "active" && !campaign.isRunning)
    }, [campaigns])

    const pausedCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => campaign.status?.toLowerCase() === "paused")
    }, [campaigns])

    const completedCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => campaign.status?.toLowerCase() === "completed" && !campaign.isRunning)
    }, [campaigns])


    return {
        getCampaigns,
        activeCampaigns,
        totalActiveCampaigns: activeCampaigns.length,
        scheduledCampaigns,
        totalScheduledCampaigns: scheduledCampaigns.length,
        pausedCampaigns,
        totalPausedCampaigns: pausedCampaigns.length,
        completedCampaigns,
        totalCompletedCampaigns: completedCampaigns.length,
        campaigns,
        totalCampaigns: campaigns.length,
        isloading
    }
}