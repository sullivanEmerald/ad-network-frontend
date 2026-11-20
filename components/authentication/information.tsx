import React from "react";
import { ShieldCheck, UserPlus, LogIn, KeyRound, MessageCircle } from "lucide-react";
import { AppLogo } from "@/components/common/logo";
import Image from "next/image";

export default function AuthInformations() {
    return (
        <aside className="hidden h-screen text-white lg:fixed w-1/2 lg:inset-y-0 lg:right-10 lg:flex lg:overflow-hidden">

            <Image
                src="/images/login.avif"
                alt="Advertising analytics dashboard showing campaign growth"
                fill
                priority
                className="object-cover"
            />
            <div className="absolute bottom-6 left-0 w-full text-center text-xs opacity-60">
                &copy; {new Date().getFullYear()} AdCustEx. All rights reserved.
            </div>
        </aside>
    );
}
