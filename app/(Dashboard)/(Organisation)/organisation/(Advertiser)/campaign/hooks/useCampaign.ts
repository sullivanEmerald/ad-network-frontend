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
        return campaigns.filter((campaign) => campaign.status?.toUpperCase() === "ACTIVE" && campaign.isSchedule === false)
    }, [campaigns])

    const scheduledCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => campaign.status?.toUpperCase() === "ACTIVE" && campaign.isSchedule === true)
    }, [campaigns])

    const draftCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => campaign.status?.toUpperCase() === "DRAFT")
    }, [campaigns])

    return {
        getCampaigns,
        activeCampaigns,
        totalActiveCampaigns: activeCampaigns.length,
        scheduledCampaigns,
        totalScheduledCampaigns: scheduledCampaigns.length,
        draftCampaigns,
        totalDraftsCampaigns: draftCampaigns.length,
        isloading,
        campaigns
    }
}