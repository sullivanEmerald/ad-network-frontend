import { StateCreator } from "zustand";
import { FullCampaignData } from "@/lib/schemas/campaign-schema";
import { Store } from "@/types/store";
import { createCampaign, getAllDrafts, getCampaigns as getCampaignsRequest, saveCampaignDraft, getDraftById, createDraft } from '@/services/campaign';
import { CampaignDraft, CampaignRecord } from "@/types/campaign";
import { showToaster } from "@/components/common/toast";


export type CampaignSlice = {
    campaignDraft: FullCampaignData | null;
    campaigns: Array<Partial<CampaignRecord> & { id: string }>;
    drafts: Array<Partial<CampaignDraft> & { id: string; currentStep: number; completedSteps: number[]; lastSavedAt: string | null, status: string }>;
    setCampaignDraft: (draft: FullCampaignData) => void;
    updateCampaignDraft: (updates: Partial<FullCampaignData>) => void;
    clearCampaignDraft: () => void;
    createCampaign: (draft: FullCampaignData, draftId: string | null, status: string) => Promise<void>;
    createDraft: (draft: Partial<CampaignDraft>, draftId?: string | null, status?: string) => Promise<void>;
    getCampaignDrafts: () => Promise<void>;
    getCampaigns: () => Promise<void>;
    getDraftById: (draftId: string) => Promise<CampaignDraft | null>;
    setDraftId: (draftId: string | null) => void;
    draftId: string | null;
    clearDraft: () => void;
    campaignState: {
        isSaving: false,
        isCreating: false,
        isfetching: false,
        isFetchingDraft: false,
        isGettingCampaigns: false
    }
};

export const createCampaignSlice: StateCreator<Store, [['zustand/immer', never]], [], CampaignSlice> = (set: any): CampaignSlice => ({
    campaignDraft: null,
    campaigns: [],
    drafts: [],
    draftId: null,
    campaignState: {
        isSaving: false,
        isCreating: false,
        isfetching: false,
        isFetchingDraft: false,
        isGettingCampaigns: false
    },
    setCampaignDraft: (draft) => set({ campaignDraft: draft }),
    updateCampaignDraft: (updates) => {
        set((state: { campaignDraft: FullCampaignData | null }) => {
            const currentDraft = state.campaignDraft;
            const hasChanges = Object.keys(updates).some((key) => {
                const currentValue = currentDraft?.[key as keyof FullCampaignData];
                const nextValue = updates[key as keyof FullCampaignData];

                return JSON.stringify(currentValue) !== JSON.stringify(nextValue);
            });

            if (!hasChanges) {
                return;
            }

            return {
                campaignDraft: {
                    ...currentDraft,
                    ...updates,
                },
            };
        });
    },
    clearCampaignDraft: () => set({ campaignDraft: null }),
    createCampaign: async (draft, draftId, status) => {
        set((state: { campaignState: any }) => ({
            campaignState: {
                ...state.campaignState,
                isCreating: true,
            },
        }));
        try {
            const response = await saveCampaignDraft(draft, draftId, status);
            showToaster("Campaign Launched", "success");
            return response;
        } catch (error) {
            console.error("Error auto-saving campaign:", error);
            throw error;
        } finally {
            set((state: { campaignState: any }) => ({
                campaignState: {
                    ...state.campaignState,
                    isCreating: false,
                },
            }));
        }
    },
    getCampaignDrafts: async () => {
        set((state: { campaignState: any }) => ({
            campaignState: {
                ...state.campaignState,
                isFetching: true,
            },
        }));

        try {
            const resonse = await getAllDrafts();
            set({ drafts: resonse });
        } catch (error) {
            console.log(error)
        } finally {
            set((state: { campaignState: any }) => ({
                campaignState: {
                    ...state.campaignState,
                    isFetching: false,
                },
            }));
        }
    },
    getCampaigns: async () => {
        set((state: { campaignState: any }) => ({
            campaignState: {
                ...state.campaignState,
                isGettingCampaigns: true,
            },
        }));

        try {
            const response = await getCampaignsRequest();
            set({ campaigns: response });
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        } finally {
            set((state: { campaignState: any }) => ({
                campaignState: {
                    ...state.campaignState,
                    isGettingCampaigns: false,
                },
            }));
        }
    },
    createDraft: async (draft, draftId, status) => {
        set((state: { campaignState: any }) => ({
            campaignState: {
                ...state.campaignState,
                isSaving: true,
            },
        }));
        try {
            const response = await createDraft(draft, draftId, status);
            showToaster("Draft saved successfully!", "success");
            return response;
        } catch (error) {
            console.error("Error saving campaign draft:", error);
            throw error;
        } finally {
            set((state: { campaignState: any }) => ({
                campaignState: {
                    ...state.campaignState,
                    isSaving: false,
                },
            }));
        }
    },
    getDraftById: async (draftId) => {
        set((state: { campaignState: any }) => ({
            campaignState: {
                ...state.campaignState,
                isFetchingDraft: true,
            },
        }));
        try {
            const response = await getDraftById(draftId);
            set({ campaignDraft: { ...response } });
            return response;
        } catch (error) {
            console.error("Error fetching campaign draft by ID:", error);
            throw error;
        } finally {
            set((state: { campaignState: any }) => ({
                campaignState: {
                    ...state.campaignState,
                    isFetchingDraft: false,
                },
            }));
        }
    },

    setDraftId: (draftId) => set({ draftId }),
    clearDraft: () => set({ campaignDraft: null, draftId: null, }),

});
