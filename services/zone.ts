import axiosInstance from "@/lib/axiosInstance";

export const getZoneCampaigns = async (zoneId: string) => {
    try {
        const response = await axiosInstance.get(`/zone/campaigns/${zoneId}`)
        return response.data;
    } catch (error) {
        console.log("error getting campains", error)
        throw error;
    }
}

export const linkZoneToCampaign = async (zoneId: string, campaignId: string) => {
    try {
        const response = await axiosInstance.post(`/zone/link/${zoneId}/${campaignId}`);
        return response.data;
    } catch (error) {
        console.log("error linking zone to campaign", error);
        throw error;
    }
}

export const unlinkZoneFromCampaign = async (zoneId: string, campaignId: string) => {
    try {
        const response = await axiosInstance.delete(`/zone/unlink/${zoneId}/${campaignId}`);
        return response.data;
    } catch (error) {
        console.log("error unlinking zone from campaign", error);
        throw error;
    }
};