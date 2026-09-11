

export const organisationEndpoints = {
    dashboard: "/organisation/dashboard",
    createCampaign: "/organisation/campaign/new",
    advertisers: "/organisation/advertisers",
    campaigns: "/organisation/campaign",
    campaignDetails: (campaignId: string) => `/organisation/campaigns/${campaignId}`,
    advertiserDetails: (advertiserId: string) => `/organisation/advertisers/${advertiserId}`,
    getDraft: (draftId: string) => `/organisation/campaign/new?draftId=${draftId}`,
}