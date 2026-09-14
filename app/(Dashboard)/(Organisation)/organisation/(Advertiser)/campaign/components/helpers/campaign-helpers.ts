import type { CampaignRecord } from "@/types/campaign";

export function formatDate(value?: string | Date | null) {
    if (!value) return "Not set";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "Not set"
        : date.toLocaleDateString(undefined, { dateStyle: "medium" });
}

export function formatLabel(value?: string | null) {
    if (!value) return "Not set";
    return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatGeo(geo?: CampaignRecord["geo"]) {
    if (!geo?.length) return "Not set";
    return geo.map((location) => location.label).join(", ");
}

export function formatDevices(devices?: CampaignRecord["devices"]) {
    if (!devices?.length) return "Not set";
    return devices.map(formatLabel).join(", ");
}

