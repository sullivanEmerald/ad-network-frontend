import axiosInstance from "@/lib/axiosInstance";
import type { CreateBannerData } from "@/types/banner";

export const createBanner = async (campaignId: string | null, data: CreateBannerData) => {
    alert(JSON.stringify(data, null, 2))
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("destinationUrl", data.destinationUrl);
    formData.append("image", data.image);
    const width = data.width;
    const height = data.height;
    if (width !== undefined) formData.append("width", width);
    if (height !== undefined) formData.append("height", height);


    const response = await axiosInstance.post(`/campaigns/${campaignId}/banners`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const getBanners = async (campaignId: string) => {
    const response = await axiosInstance.get(`/campaigns/${campaignId}/banners`);
    return response.data;
};

export const deleteBanner = async (campaignId: string, bannerId: string) => {
    const response = await axiosInstance.delete(`/campaigns/${campaignId}/banners/${bannerId}`);
    return response.data;
};
