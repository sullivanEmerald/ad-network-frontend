import { StateCreator } from "zustand";
import { FullCampaignData } from "@/lib/schemas/campaign-schema";
import { Store } from "@/types/store";
import { createCampaign, getAllDrafts, getCampaigns as getCampaignsRequest, getDraftById, createDraft, getCampaignSummary, setCampaigns, storeCampaign, getEligibleZonesForCampaign } from '@/services/campaign';
import { CampaignCreationResponse, CampaignDraft, CampaignRecord, CampaignReviewSummary } from "@/types/campaign";
import { showToaster } from "@/components/common/toast";
import { campaignSchema } from "@/lib/schemas/campaign-schema";
import { BannerFormData } from "@/lib/schemas/banner";
import { createBanner } from "@/services/banner";
import { CreateBannerData } from "@/types/banner";
import { PublisherZone } from "@/types/publisher";


export type CampaignSlice = {
    campaignDraft: FullCampaignData | null;
    campaignZones: PublisherZone[] | [];
    campaignReview: CampaignReviewSummary | null;
    campaigns: Array<Partial<CampaignRecord> & { id: string }>;
    drafts: Array<Partial<CampaignDraft> & { id: string; currentStep: number; completedSteps: number[]; lastSavedAt: string | null, status: string }>;
    setCampaignDraft: (draft: FullCampaignData) => void;
    updateCampaignDraft: (updates: Partial<FullCampaignData>) => void;
    clearCampaignDraft: () => void;
    launchCampaign: (campaignId: string, zoneId?: string | null) => Promise<void>;
    storeCampaign: (campaignId: string) => Promise<void>;
    createCampaign: (data: Partial<FullCampaignData>) => Promise<CampaignCreationResponse>;
    createCampaignBanner: (data: CreateBannerData, campaignId: string | null) => Promise<void>;
    createDraft: (draft: Partial<CampaignDraft>, draftId?: string | null, status?: string) => Promise<CampaignCreationResponse>;
    getCampaignDrafts: () => Promise<void>;
    getCampaigns: () => Promise<void>;
    getDraftById: (draftId: string) => Promise<CampaignDraft | null>;
    setDraftId: (draftId: string | null) => void;
    draftId: string | null;
    campaignId: string | null;
    setReviveCampaignId: (campaignId: string | null) => void;
    clearDraft: () => void;
    getCampaignSummary: (campaignId: string) => Promise<CampaignReviewSummary>;
    getEligibleZonesForCampaign: (campaignId: string) => Promise<void>;
    campaignState: {
        isSaving: false,
        isCreating: false,
        isfetching: false,
        isFetchingDraft: false,
        isGettingCampaigns: false,
        isCreatingCampaign: false,
        isGettingSummary: false,
        isStoringCampaign: false
    }
};

export const createCampaignSlice: StateCreator<Store, [['zustand/immer', never]], [], CampaignSlice> = (set: any): CampaignSlice => ({
    campaignDraft: null,
    campaignReview: null,
    campaigns: [],
    drafts: [],
    campaignZones: [],
    draftId: null,
    campaignId: null,
    campaignState: {
        isSaving: false,
        isCreating: false,
        isfetching: false,
        isFetchingDraft: false,
        isGettingCampaigns: false,
        isCreatingCampaign: false,
        isGettingSummary: false,
        isStoringCampaign: false
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
    launchCampaign: async (campaignId, zoneId = null) => {
        set((state: { campaignState: any }) => ({
            campaignState: {
                ...state.campaignState,
                isCreating: true,
            },
        }));
        try {
            const response = await setCampaigns(campaignId, zoneId);
            if (response.zonesLinked === 0 && response.zonesFailed === 0) {
                set((state: { campaigns: any[] }) => ({
                    campaigns: state.campaigns.map((campaign) =>
                        campaign.id === campaignId ? { ...campaign, status: "assigned", isRunning: new Date(campaign.startDate).getTime() <= Date.now() && (!campaign.endDate || new Date(campaign.endDate).getTime() >= Date.now()) } : campaign
                    ),
                }));
                showToaster("No zone found matching banner height and width. Campaign has been queued for automatic placement.", "success");
                return response;
            }
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
            if (!draftId) {
                const savedDraftId = response?.draftId ?? response?.id?.toString();
                if (savedDraftId) set({ draftId: savedDraftId });
            }
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
            if (response?.reviveCampaignId) {
                set({ reviveCampaignId: response.reviveCampaignId.toString() });
            }
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
    createCampaign: async (data) => {
        set((state: { campaignState: any }) => ({
            campaignState: {
                ...state.campaignState,
                isCreatingCampaign: true,
            },
        }));
        try {
            const response = await createCampaign(data);
            if (response.campaignId) {
                set({ campaignId: response.campaignId });
            }
            showToaster('Campaign created. Add banners', 'success');
            return response;
        } catch (error) {
            console.log(error)
            throw error;
        } finally {
            set((state: { campaignState: any }) => ({
                campaignState: {
                    ...state.campaignState,
                    isCreatingCampaign: false,
                },
            }));
        }
    },

    createCampaignBanner: async (data, campaignId) => {
        try {
            const response = await createBanner(campaignId, data)
            return response
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    getCampaignSummary: async (campaignId) => {
        set((state: { campaignState: any }) => ({
            campaignState: {
                ...state.campaignState,
                isGettingSummary: true,
            },
        }));

        try {
            const campaignSummary = await getCampaignSummary(campaignId)
            set({ campaignReview: campaignSummary })
            return campaignSummary;
        } catch (error) {

        } finally {
            set((state: { campaignState: any }) => ({
                campaignState: {
                    ...state.campaignState,
                    isGettingSummary: false,
                },
            }));
        }
    },

    storeCampaign: async (campaignId) => {
        set((state: { campaignState: any }) => ({
            campaignState: {
                ...state.campaignState,
                isStoringCampaign: true,
            },
        }));

        try {
            const response = await storeCampaign(campaignId)
            showToaster('Campaign stored successfully', 'success');
            return response;
        } catch (error) {
            console.error("Error storing campaign:", error);
            throw error;
        } finally {
            set((state: { campaignState: any }) => ({
                campaignState: {
                    ...state.campaignState,
                    isStoringCampaign: false,
                },
            }));
        }
    },

    getEligibleZonesForCampaign: async (campaignId) => {
        // set((state: { campaignState: any }) => ({
        //     campaignState: {
        //         ...state.campaignState,
        //         isFetching: true,
        //     },
        // }));

        try {
            const eligibleZones = await getEligibleZonesForCampaign(campaignId);
            set({ campaignZones: eligibleZones });
            return eligibleZones;
        } catch (error) {
            console.error("Error fetching eligible zones:", error);
            throw error;
        } finally {
            // set((state: { campaignState: any }) => ({
            //     campaignState: {
            //         ...state.campaignState,
            //         isFetching: false,
            //     },
            // }));
        }
    },

    setDraftId: (draftId) => set({ draftId }),
    setReviveCampaignId: (reviveCampaignId) => set({ reviveCampaignId }),
    clearDraft: () => set({ campaignDraft: null, draftId: null, reviveCampaignId: null }),

});
