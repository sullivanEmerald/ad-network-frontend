"use client";
import { useAuth } from "../components/hooks/useAuth";
import { useEffect } from "react";
import { organisationEndpoints } from "@/endpoints/organisation";
import { useRouter } from "next/navigation";

export default function AuthStaticGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push(organisationEndpoints.dashboard);
        }
    }, [isAuthenticated, router]);

    return <>{children}</>;
}