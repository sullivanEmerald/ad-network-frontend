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
        return campaigns.filter((campaign) => campaign.status?.toLowerCase() === "linked" && campaign.isScheduled === false)
    }, [campaigns])

    const pendingCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => campaign.status?.toLowerCase() === "pending")
    }, [campaigns])

    const linkedCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => campaign.status?.toLowerCase() === "linked" && campaign.isScheduled === true)
    }, [campaigns])

    return {
        getCampaigns,
        activeCampaigns,
        totalActiveCampaigns: activeCampaigns.length,
        pendingCampaigns,
        totalPendingCampaigns: pendingCampaigns.length,
        linkedCampaigns,
        totalLinkedCampaigns: linkedCampaigns.length,
        isloading,
        campaigns
    }
}