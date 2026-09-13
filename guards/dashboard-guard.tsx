"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import AuthLoader from "@/components/auth/auth-loader";
import { authenticationEndpoints } from "@/endpoints/auth";



export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, isloading } = useStore(useShallow((state) => ({
        user: state.user,
        isloading: state.authState.isRefreshingUser,
    })))

    const router = useRouter();

    useEffect(() => {
        if (!isloading && !user) {
            router.push(authenticationEndpoints.login);
        }
    }, [isloading, user, router])

    if (isloading) return <AuthLoader />

    return <>{children}</>
}