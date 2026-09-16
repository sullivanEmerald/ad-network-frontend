import axiosInstance from "@/lib/axiosInstance";
import type { PublisherFormData } from "@/lib/schemas/publisher-schema";

export const createPublisher = async (data: PublisherFormData) => {
    alert(JSON.stringify(data, null, 2))
    const response = await axiosInstance.post("/publishers", data);
    return response.data;
};

export const getAllPublishers = async () => {
    try {
        const response = await axiosInstance.get('/publishers')
        console.log("publishers", response)
        return response.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}
