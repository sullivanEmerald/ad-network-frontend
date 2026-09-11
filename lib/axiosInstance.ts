// create an axios instance with base url and default headers
import axios from "axios"
import { useStore } from "@/store/store";


const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

export default axiosInstance

let isRefreshing = false;

let failedQueue: {
    resolve: () => void;
    reject: (error: any) => void;
}[] = [];

const processQueue = (error?: any) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });

    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Don't try to refresh for auth endpoints
        const isAuthRoute = originalRequest.url?.startsWith("/auth");

        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            isAuthRoute
        ) {
            return Promise.reject(error);
        }

        // Queue requests while a refresh is already in progress
        if (isRefreshing) {
            return new Promise<void>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => axiosInstance(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            // Browser automatically sends the refreshToken cookie
            await axiosInstance.post("/auth/refresh");

            // Retry queued requests
            processQueue();

            // Retry the original request
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            // Reject queued requests
            processQueue(refreshError);

            // Clear auth state
            useStore.getState().setUser(null);

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);