import axiosInstance from "@/lib/axiosInstance";
import type { PublisherFormData } from "@/lib/schemas/publisher-schema";
import type { ZoneFormData } from "@/lib/schemas/zone-schema";

export const createPublisher = async (data: PublisherFormData) => {
    const response = await axiosInstance.post("/publishers", data);
    return response.data;
};

export const getZones = async () => {
    try {
        const response = await axiosInstance.get('/zone')
        console.log("zones", response)
        return response.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getPublisherDetails = async (publisherId: string) => {
    try {
        const response = await axiosInstance.get(`/publishers/${publisherId}`);
        console.log(response)
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createZone = async (data: any) => {
    const response = await axiosInstance.post(`/zone`, data);
    return response.data;
};

export const getPublisherZones = async (publisherId: string) => {
    const response = await axiosInstance.get(`/publishers/${publisherId}/zones`);
    return response.data;
};

export const generateZoneTag = async (zoneId: string) => {
    console.log("zoneID", zoneId)
    const response = await axiosInstance.post(`/zone/${zoneId}/tag`, { codeType: "invocationTags:oxInvocationTags:async" });
    return response.data;
};
