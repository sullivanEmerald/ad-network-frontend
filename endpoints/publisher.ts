
export const publisherEndpoints = {
    dashboard: "/organisation/publisher/dashboard",
    publisherInventory: (publisherId: string) => `/organisation/publisher/${publisherId}`,
}