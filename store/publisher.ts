import type { StateCreator } from "zustand";
import type { PublisherFormData } from "@/lib/schemas/publisher-schema";
import type { ZoneFormData } from "@/lib/schemas/zone-schema";
import {
    createPublisher as createPublisherRequest,
    createZone as createZoneRequest,
    getAllPublishers,
    getPublisherDetails,
    getPublisherZones as getPublisherZonesRequest,
} from "@/services/publisher";
import type { Publisher, PublisherZone } from "@/types/publisher";
import type { Store } from "@/types/store";

export type PublisherSlice = {
    publisher: Publisher | null;
    publishers: Publisher[] | [];
    publisherZones: PublisherZone[];
    createPublisher: (data: PublisherFormData) => Promise<void>;
    createZone: (publisherId: string, data: ZoneFormData) => Promise<PublisherZone>;
    getAllPublishers: () => Promise<void>;
    getPublisherDetails: (publisherId: string) => Promise<Publisher>;
    getPublisherZones: (publisherId: string) => Promise<void>;
    publisherState: {
        isLoading: boolean;
        isFetching: boolean;
        isGettingPublisherDetails: boolean;
        isCreatingZone: boolean;
        isFetchingZones: boolean;
    };
};

export const createPublisherSlice: StateCreator<Store, [["zustand/immer", never]], [], PublisherSlice> = (set) => ({
    publisher: null,
    publishers: [],
    publisherZones: [],
    publisherState: {
        isLoading: false,
        isFetching: false,
        isGettingPublisherDetails: false,
        isCreatingZone: false,
        isFetchingZones: false,
    },
    createPublisher: async (data) => {
        set((state) => {
            state.publisherState.isLoading = true;
        });

        try {
            const response = await createPublisherRequest(data);
            const publisher = response?.data?.publisher ?? response?.publisher ?? response;
            set((state) => {
                state.publishers = [publisher, ...state.publishers];
            });
        } finally {
            set((state) => {
                state.publisherState.isLoading = false;
            });
        }
    },

    createZone: async (publisherId, data) => {
        set((state) => {
            state.publisherState.isCreatingZone = true;
        });

        try {
            const response = await createZoneRequest(publisherId, data);
            const zone = response?.data?.zone ?? response?.zone ?? response?.data ?? response;

            set((state) => {
                state.publisherZones = [zone, ...state.publisherZones];

                if (state.publisher?.id === publisherId) {
                    state.publisher.zones = [zone, ...(state.publisher.zones ?? [])];
                }
            });

            return zone;
        } finally {
            set((state) => {
                state.publisherState.isCreatingZone = false;
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
    },

    getPublisherDetails: async (publisherId) => {
        set((state: { publisherState: any }) => ({
            publisherState: {
                ...state.publisherState,
                isGettingPublisherDetails: true
            }
        }));
        try {
            const response = await getPublisherDetails(publisherId);
            const publisher = response?.data?.publisher ?? response?.publisher ?? response?.data ?? response;
            set((state) => {
                state.publisher = publisher;
            });
            return publisher;
        } catch (error) {

        } finally {
            set((state: { publisherState: any }) => ({
                publisherState: {
                    ...state.publisherState,
                    isGettingPublisherDetails: false
                }
            }));
        }
    },

    getPublisherZones: async (publisherId) => {
        set((state) => {
            state.publisherState.isFetchingZones = true;
        });

        try {
            const response = await getPublisherZonesRequest(publisherId);
            const zones = response?.data?.zones ?? response?.zones ?? response?.data ?? response;

            set((state) => {
                state.publisherZones = Array.isArray(zones) ? zones : [];

                if (state.publisher?.id === publisherId) {
                    state.publisher.zones = state.publisherZones;
                }
            });
        } finally {
            set((state) => {
                state.publisherState.isFetchingZones = false;
            });
        }
    }
});
