"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store/store";
import { AccountType } from "@/types/auth";
import AuthLoader from "@/components/auth/auth-loader";

type RoleGuardProps = {
    children: React.ReactNode;
    allowedAccountType: AccountType;
    redirectTo: string;
};

export function RoleGuard({ children, allowedAccountType, redirectTo }: RoleGuardProps) {
    const router = useRouter();
    const { user, isRefreshingUser } = useStore(useShallow((state) => ({
        user: state.user,
        isRefreshingUser: state.authState.isRefreshingUser,
    })));

    const accountType = typeof user?.accountType === "string"
        ? user.accountType.toUpperCase()
        : null;
    const hasRequiredRole = accountType === allowedAccountType;

    useEffect(() => {
        if (!isRefreshingUser && user && !hasRequiredRole) {
            router.replace(redirectTo);
        }
    }, [hasRequiredRole, isRefreshingUser, redirectTo, router, user]);

    return <>{children}</>;
}
