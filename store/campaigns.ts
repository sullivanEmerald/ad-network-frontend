import { StateCreator } from "zustand";
import { FullCampaignData } from "@/lib/schemas/campaign-schema";
import { Store } from "@/types/store";
import { createCampaign, getAllDrafts, saveCampaignDraft, getDraftById } from '@/services/campaign';
import { CampaignDraft } from "@/types/campaign";
import { showToaster } from "@/components/common/toast";


export type CampaignSlice = {
    campaignDraft: FullCampaignData | null;
    drafts: Array<Partial<CampaignDraft> & { id: string; currentStep: number; completedSteps: number[]; lastSavedAt: string | null, status: string }>;
    setCampaignDraft: (draft: FullCampaignData) => void;
    updateCampaignDraft: (updates: Partial<FullCampaignData>) => void;
    clearCampaignDraft: () => void;
    createCampaign: (draft: FullCampaignData) => Promise<void>;
    createDraft: (draft: Partial<CampaignDraft>, draftId?: string | null, status?: string) => Promise<void>;
    getCampaignDrafts: () => Promise<void>;
    getDraftById: (draftId: string) => Promise<CampaignDraft | null>;
    setDraftId: (draftId: string | null) => void;
    draftId: string | null;
    clearDraft: () => void;
    campaignState: {
        isSaving: false,
        isCreating: false,
        isfetching: false,
        isFetchingDraft: false,
    }
};

export const createCampaignSlice: StateCreator<Store, [['zustand/immer', never]], [], CampaignSlice> = (set: any): CampaignSlice => ({
    campaignDraft: null,
    drafts: [],
    draftId: null,
    campaignState: {
        isSaving: false,
        isCreating: false,
        isfetching: false,
        isFetchingDraft: false,
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
    createCampaign: async (draft, status = "draft", id?: string) => {
        set((state: { campaignState: any }) => ({
            campaignState: {
                ...state.campaignState,
                isCreating: true,
            },
        }));
        try {
            const response = await saveCampaignDraft(draft);
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
    createDraft: async (draft, draftId?: string | null, status: string = "draft") => {
        set((state: { campaignState: any }) => ({
            campaignState: {
                ...state.campaignState,
                isSaving: true,
            },
        }));
        try {
            const response = await saveCampaignDraft(draft, draftId, status);
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
            const draft = await getDraftById(draftId);
            console.log("Fetched draft by ID:", draft);
            set({ campaignDraft: { ...draft } });
            return draft;
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
