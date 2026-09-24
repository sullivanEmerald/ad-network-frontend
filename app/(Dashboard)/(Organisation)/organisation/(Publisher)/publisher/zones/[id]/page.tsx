"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useShallow } from "zustand/shallow";
import CampaignHeader from "@/components/campaign/header";
import { useStore } from "@/store/store";
import { Loader } from "@/components/common/loader";

export default function PlacementZone() {
    const { id } = useParams<{ id: string }>();
    const { zone, zoneCampaigns, getZoneCampaigns, isFetching, error } = useStore(
        useShallow((state) => ({
            zone: state.zone,
            zoneCampaigns: state.zoneCampaigns,
            getZoneCampaigns: state.getZoneCampaigns,
            isFetching: state.zoneCampaignState.isFetching,
            error: state.zoneCampaignState.error,
        })),
    );

    useEffect(() => {
        void getZoneCampaigns(id);
    }, [getZoneCampaigns, id]);

    return (
        <main className="space-y-8">
            <CampaignHeader
                note="Zone placement"
                title={zone?.name ?? "Campaigns for this zone"}
                description={zone
                    ? `Showing campaigns with banners matching ${zone.width} x ${zone.height}px.`
                    : "View campaigns with banners sized to fit this zone perfectly."}
            />
            {isFetching ? <Loader /> : error ? (
                <p className="text-sm text-red-400">{error}</p>
            ) : zoneCampaigns.length === 0 ? (
                <p className="text-sm text-gray-400">No campaigns have banners matching this zone yet.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {zoneCampaigns.map(({ campaign, banners }) => (
                        <section key={campaign.id} className="rounded-lg border border-gray-700 bg-light-background p-5">
                            <h2 className="text-xl font-semibold text-white">
                                {campaign.campaignName ?? "Unnamed campaign"}
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">{banners.length} matching banner{banners.length === 1 ? "" : "s"}</p>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                {banners.map((banner) => (
                                    <div key={banner.id} className="overflow-hidden rounded-lg border border-white/10 bg-black/20">
                                        {banner.src ? (
                                            <img src={banner.src} alt={banner.name} className="aspect-video w-full object-cover" />
                                        ) : null}
                                        <div className="p-3">
                                            <p className="truncate font-medium text-white">{banner.name}</p>
                                            <p className="mt-1 text-xs text-gray-400">{banner.width} x {banner.height}px</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </main>
    )
}