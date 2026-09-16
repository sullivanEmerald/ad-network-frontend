"use client"
import { CAMPAIGN_MAIN_NAV, CAMPAIGN_PROFILE_NAV, CAMPAIGN_SETTINGS_NAV, PUBLISHER_MENU_BARS } from "@/data/constants";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import UserHeader from "@/components/dashboard/header";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/guards/dashboard-guard";
import { useStore } from "@/store/store";


export default function DashboardNav({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const user = useStore((state) => state.user)
    const isProfile = pathname.includes("/profile");
    const isSettings = pathname.includes("/settings");
    const [activeNav, setActiveNav] = useState(CAMPAIGN_MAIN_NAV);
    const isPublisher = user?.accountType.toLowerCase() === 'publisher'

    useEffect(() => {
        if (isProfile) {
            if (!isPublisher) {
                setActiveNav(CAMPAIGN_PROFILE_NAV);
            } else {
                setActiveNav(CAMPAIGN_PROFILE_NAV);
            }
        } else if (isSettings) {
            setActiveNav(CAMPAIGN_SETTINGS_NAV);
        } else {
            if (!isPublisher) {
                setActiveNav(CAMPAIGN_MAIN_NAV);
            } else {
                setActiveNav(PUBLISHER_MENU_BARS);
            }

        }
    }, [pathname, isPublisher]);

    return (
        <AuthGuard>
            <div className="flex min-h-screen">
                {/* Fixed sidebar for desktop, overlay for mobile */}
                <aside className="hidden sm:fixed sm:inset-y-0 sm:flex sm:w-64 z-40">
                    <Sidebar items={activeNav} role='provider' />
                </aside>
                <div className="flex-1 flex flex-col sm:ml-64 min-h-screen">
                    <UserHeader />
                    <main className="flex-1 overflow-y-auto pt-4 pb-8 px-4">
                        <div className="max-w-[1400px] mx-auto w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}