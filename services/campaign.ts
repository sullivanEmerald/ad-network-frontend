import axiosInstance from "@/lib/axiosInstance";

export const createCampaign = async (data: any, status: string, id?: string) => {
    try {
        const response = await axiosInstance.post(`/campaigns/${id}`, { ...data, status });
        return response.data;
    } catch (error) {
        console.error("Error creating campaign:", error);
        throw error;
    }
};

export const saveCampaignDraft = async (data: any, draftId?: string | null, status?: string) => {
    try {
        const response = await axiosInstance.post(`/campaigns`, { ...data, draftId, status });
        return response.data;
    } catch (error) {
        console.error("Error saving campaign draft:", error);
        throw error;
    }
};


export const createDraft = async (data: any, draftId?: string | null, status?: string) => {
    alert(JSON.stringify(data, null, 2))
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


