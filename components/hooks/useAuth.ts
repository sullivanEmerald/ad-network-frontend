import { useStore } from "@/store/store";
import { useShallow } from "zustand/shallow";
import { useMemo } from "react";

export const useAuth = () => {
    const { user, isloading } = useStore(
        useShallow((state) => ({
            user: state.user,
            isloading: state.authState.isRefreshingUser,
        }))
    );

    const isAuthenticated = useMemo(() => {
        return !isloading && Boolean(user);
    }, [user, isloading]);

    return { user, isloading, isAuthenticated };

}