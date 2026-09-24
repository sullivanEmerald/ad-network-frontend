import type { StateCreator } from "zustand";
import type { PublisherFormData } from "@/lib/schemas/publisher-schema";
import type { ZoneFormData } from "@/lib/schemas/zone-schema";
import {
    createPublisher as createPublisherRequest,
    createZone as createZoneRequest,
    generateZoneTag as generateZoneTagRequest,
    getZones,
    getPublisherDetails,
    getPublisherZones as getPublisherZonesRequest,
} from "@/services/publisher";
import type { Zone, PublisherZone } from "@/types/publisher";
import type { Store } from "@/types/store";

export type PublisherSlice = {
    zones: Zone;
    publishers: Zone[] | [];
    createPublisher: (data: PublisherFormData) => Promise<void>;
    createZone: (data: ZoneFormData) => Promise<PublisherZone>;
    generateZoneTag: (zoneId: string) => Promise<{ tag: string, codeType: string }>;
    getZone: () => Promise<void>;
    getPublisherDetails: (publisherId: string) => Promise<Zone>;
    publisherState: {
        isLoading: boolean;
        isFetching: boolean;
        isGettingPublisherDetails: boolean;
        isCreatingZone: boolean;
        isGeneratingTag: boolean;
        isFetchingZones: boolean;
    };
};

export const createPublisherSlice: StateCreator<Store, [["zustand/immer", never]], [], PublisherSlice> = (set) => ({
    zones: [],
    publishers: [],
    publisherState: {
        isLoading: false,
        isFetching: false,
        isGettingPublisherDetails: false,
        isCreatingZone: false,
        isGeneratingTag: false,
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

    createZone: async (data) => {
        set((state) => {
            state.publisherState.isCreatingZone = true;
        });

        try {
            const response = await createZoneRequest(data);
            const zone = response?.data?.zone ?? response?.zone ?? response?.data ?? response;
            set((state) => {
                state.zones = [zone, ...state.zones];
            });

            return zone;
        } finally {
            set((state) => {
                state.publisherState.isCreatingZone = false;
            });
        }
    },

    generateZoneTag: async (zoneId) => {
        set((state) => {
            state.publisherState.isGeneratingTag = true;
        });
        try {
            return await generateZoneTagRequest(zoneId);
        } finally {
            set((state) => {
                state.publisherState.isGeneratingTag = false;
            });
        }
    },

    getZone: async () => {
        set((state: { publisherState: any }) => ({
            publisherState: {
                ...state.publisherState,
                isFetching: true
            }
        }));

        try {
            const response = await getZones();
            set({ zones: response });
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
            // set((state) => {
            //     state.publisher = publisher;
            // });
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
});
