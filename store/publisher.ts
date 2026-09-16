import type { StateCreator } from "zustand";
import type { PublisherFormData } from "@/lib/schemas/publisher-schema";
import { createPublisher as createPublisherRequest, getAllPublishers } from "@/services/publisher";
import type { Publisher } from "@/types/publisher";
import type { Store } from "@/types/store";

export type PublisherSlice = {
    publisher: Publisher | null;
    publishers: Publisher[] | [];
    createPublisher: (data: PublisherFormData) => Promise<void>;
    getAllPublishers: () => Promise<void>;
    publisherState: {
        isLoading: boolean;
        isFetching: boolean;
    };
};

export const createPublisherSlice: StateCreator<Store, [["zustand/immer", never]], [], PublisherSlice> = (set) => ({
    publisher: null,
    publishers: [],
    publisherState: {
        isLoading: false,
        isFetching: false,
    },
    createPublisher: async (data) => {
        set((state) => {
            state.publisherState.isLoading = true;
        });

        try {
            const response = await createPublisherRequest(data);
            const publisher = response?.data?.publisher ?? response?.publisher ?? response;
            set((state) => {
                state.publisher = publisher;
            });
        } finally {
            set((state) => {
                state.publisherState.isLoading = false;
            });
        }
    },

    getAllPublishers: async () => {
        set((state: { publisherState: any }) => ({
            publisherState: {
                ...state.publisherState,
                isFetching: true
            }
        }));

        try {
            const response = await getAllPublishers();
            set({ publishers: response });
            return response;
        } catch (error) {
            console.log(error)
        } finally {
            set((state: { publisherState: any }) => ({
                publisherState: {
                    ...state.publisherState,
                    isFetching: false
                }
            }));
        }
    }
});
