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