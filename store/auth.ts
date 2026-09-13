import { StateCreator } from "zustand";
import axios from "axios";
import { LoginInput } from "@/lib/schemas/auth-schema";
import { login, refreshToken, authMe } from "@/services/auth";
import { User } from "@/types/auth";
import { Store } from "@/types/store";

export type AuthSlice = {
    user: User | null;
    authState: {
        isLoading: boolean;
        isAuthenticated: boolean;
        isRefreshingUser: boolean;
    };
    login: (credentials: LoginInput) => Promise<User | null>;
    logout: () => void;
    setUser: (user: User | null) => void;
    getAuthMethod: () => Promise<User | null>;
};

export const createAuthSlice: StateCreator<Store, [["zustand/immer", never]], [], AuthSlice> = (set) => ({
    user: null,
    authState: {
        isLoading: false,
        isAuthenticated: false,
        isRefreshingUser: true
    },
    login: async (credentials) => {
        set((state) => {
            state.authState.isLoading = true;
        });

        try {
            const response = await login(credentials);
            const user = response.user || null;
            return user;
        } finally {
            set((state) => {
                state.authState.isLoading = false;
            });
        }
    },
    logout: () => {
        set((state) => {
            state.user = null;
            state.authState.isAuthenticated = false;
        });
    },
    setUser: (user) => {
        set((state) => {
            state.user = user;
            state.authState.isAuthenticated = Boolean(user);
        });
    },
    getAuthMethod: async () => {
        set((state) => {
            state.authState.isRefreshingUser = true;
        });

        try {
            const user = await authMe();
            const refreshedUser: User | null = user;
            set((state) => {
                state.user = refreshedUser;
                state.authState.isAuthenticated = Boolean(refreshedUser);
            });
            return refreshedUser;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                set((state) => {
                    state.user = null;
                    state.authState.isAuthenticated = false;
                });
                return null;
            }

            throw error;
        } finally {
            set((state) => {
                state.authState.isRefreshingUser = false;
            });
        }
    }
});