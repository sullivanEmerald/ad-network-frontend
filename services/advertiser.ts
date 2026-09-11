import axiosInstance from "@/lib/axiosInstance";


export const createAdvertiser = async (data: any) => {
    try {
        const response = await axiosInstance.post(`/advertisers`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating advertiser:", error);
        throw error;
    }
};

export const getAdvertiser = async () => {
    try {
        const response = await axiosInstance.get(`/advertisers`);
        console.log('response', response)
        return response.data;
    } catch (error) {
        console.error("Error creating advertiser:", error);
        throw error;
    }
};