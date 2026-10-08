import axiosInstance from "@/lib/axiosInstance";

export const createCampaign = async (data: any) => {
    try {
        const response = await axiosInstance.post(`/campaigns/`, { ...data });
        return response.data;
    } catch (error) {
        console.error("Error creating campaign:", error);
        throw error;
    }
};

export const setCampaigns = async (campaignId: string, zoneId: string | null) => {
    try {
        const response = await axiosInstance.patch(`/campaigns/${campaignId}/${zoneId}/launch`);
        return response.data;
    } catch (error) {
        console.error("Error saving campaign draft:", error);
        throw error;
    }
};


export const createDraft = async (data: any, draftId?: string | null, status?: string) => {
    try {
        const response = await axiosInstance.post(`/campaigns/drafts`, { ...data, draftId, status });
        return response.data;
    } catch (error) {
        console.error("Error saving campaign draft:", error);
        throw error;
    }
};

export const getAllDrafts = async () => {
    try {
        const response = await axiosInstance.get(`/campaigns/drafts`);
        return response.data;
    } catch (error) {
        console.error("Error fetching campaign drafts:", error);
        throw error;
    }
};

export const getCampaigns = async () => {
    try {
        const response = await axiosInstance.get(`/campaigns`);
        return response.data;
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        throw error;
    }
};

export const getDraftById = async (draftId: string) => {
    try {
        const response = await axiosInstance.get(`/campaigns/drafts/${draftId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching campaign draft by ID:", error);
        throw error;
    }
}

export const getCampaignSummary = async (campaignId: string) => {
    try {
        const response = await axiosInstance.get(`/campaigns/${campaignId}/summary`)
        return response.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const storeCampaign = async (campaignId: string) => {
    try {
        const response = await axiosInstance.patch(`/campaigns/${campaignId}/store`);
        return response.data;
    } catch (error) {
        console.error("Error storing campaign:", error);
        throw error;
    }
}

export const getEligibleZonesForCampaign = async (campaignId: string) => {
    try {
        const response = await axiosInstance.get(`/campaigns/${campaignId}/eligible-zones`);
        return response.data;
    } catch (error) {
        console.error("Error fetching eligible zones:", error);
        throw error;
    }
}
