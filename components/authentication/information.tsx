import React from "react";
import { ShieldCheck, UserPlus, LogIn, KeyRound, MessageCircle } from "lucide-react";
import { AppLogo } from "@/components/common/logo";

export default function AuthInformations() {
    return (
        <aside className="hidden h-screen w-full bg-gray-900 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-[45%] lg:flex-col lg:items-center lg:justify-center lg:overflow-hidden">
            <div className="relative flex h-full w-full max-w-xl flex-col items-center justify-center gap-8 px-6 py-12 lg:px-10">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-3xl font-bold text-primary/80">Welcome to <AppLogo /></h2>

                    <p className="max-w-md text-lg text-muted-foreground opacity-90">
                        AdCustEx is a cutting-edge SaaS advertising platform designed to empower businesses with advanced tools for managing and optimizing their advertising campaigns.
                    </p>
                </div>

                <div className="flex w-full max-w-md flex-col gap-6">
                    {[
                        { icon: UserPlus, label: "Wizard Campaign Creation" },
                        { icon: LogIn, label: "Streamlined Login Process" },
                        { icon: KeyRound, label: "Robust Security Features" },
                        { icon: MessageCircle, label: "Responsive Customer Support" },
                    ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3">
                            <div className="rounded-full bg-primary/70 p-2 text-white">
                                <Icon className="h-4 w-4" />
                            </div>
                            <span className="font-semibold">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-6 left-0 w-full text-center text-xs opacity-60">
                &copy; {new Date().getFullYear()} AdCustEx. All rights reserved.
            </div>
        </aside>
    );
}
