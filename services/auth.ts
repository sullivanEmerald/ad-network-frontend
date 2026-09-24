import axiosInstance from "@/lib/axiosInstance";
import { authenticationEndpoints } from "@/endpoints/auth";
import { LoginInput } from "@/lib/schemas/auth-schema";

export const Register = async (registerData: any) => {
    alert(JSON.stringify(registerData, null, 2))
    const response = await axiosInstance.post(authenticationEndpoints.register, registerData);
    const data = response.data;
    return data;
}

export const login = async (credentials: LoginInput) => {
    const response = await axiosInstance.post(authenticationEndpoints.login, credentials);
    const data = response.data;

    return data.user ? data : { user: data };
};

export const authMe = async () => {
    const response = await axiosInstance.get(authenticationEndpoints.me);
    const data = response.data;
    return data;
};

export const refreshToken = async () => {
    const response = await axiosInstance.get(authenticationEndpoints.refreshToken);
    const data = response.data;
    return data;
};


export const logout = async () => {
    const response = await axiosInstance.post(authenticationEndpoints.logout);
    return response.data;
}