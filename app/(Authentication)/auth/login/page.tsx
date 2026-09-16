"use client"
import Input from "@/components/common/input";
import Button from "@/components/common/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToaster } from "@/components/common/toast";
import { LineLoader } from "@/components/common/lineLoader";
import { Eye, EyeOff } from "lucide-react";
import { authenticationEndpoints } from "@/endpoints/auth";
import { dashboardEndpoints } from "@/endpoints/dashboard";
import { loginSchema, LoginInput } from "@/lib/schemas/auth-schema";
import { useStore } from "@/store/store";
import { organisationEndpoints } from "@/endpoints/organisation";
import { publisherEndpoints } from "@/endpoints/publisher";

export default function LoginPage() {
    const router = useRouter();
    const login = useStore((state) => state.login);
    const authMe = useStore((state) => state.getAuthMethod);
    const isLoading = useStore((state) => state.authState.isLoading);
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            businessEmail: "",
            password: "",
        },
    });

    const onSubmit = async (credentials: LoginInput) => {
        try {
            const user = await login(credentials);
            await authMe();
            showToaster("Login successful", "success");
            const dashboard = user?.accountType.toLowerCase() === "publisher" ? publisherEndpoints.dashboard : organisationEndpoints.dashboard
            router.push(dashboard);
        } catch (error) {
            console.error("Login error:", error);
            const responseMessage = axios.isAxiosError(error) ? error.response?.data?.message : null;
            const message = Array.isArray(responseMessage)
                ? responseMessage.join(", ")
                : typeof responseMessage === "string"
                    ? responseMessage
                    : "Unable to log in. Please check your credentials.";

            setError("root", { message });
            showToaster(message, "error");
        }
    };

    return (
        <div className="w-full py-12 px-4 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-primary">Hello, Welcome Back, Catch up</h2>
            <p className="text-muted-foreground mb-6">Please enter your credentials to continue</p>
            <form className="space-y-6 w-full md:w-[80%]" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="relative ">
                    <Input
                        id="businessEmail"
                        label="Business Email"
                        type="email"
                        autoComplete="email"
                        {...register("businessEmail")}
                        required
                        placeholder="Enter your business email"
                    />
                    {errors.businessEmail && <span className="text-xs text-red-500 mt-1 block">{errors.businessEmail.message}</span>}
                </div>
                <div className="relative">
                    <Input
                        id="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        {...register("password")}
                        required
                        placeholder="Enter your password"
                    />
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-12 transform -translate-y-1/2 text-muted-foreground focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                    {errors.password && <span className="text-xs text-red-500 mt-1 block">{errors.password.message}</span>}
                </div>
                <div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <div className="flex items-center justify-center gap-2"><LineLoader /> <span>Logging in...</span></div> : "Login"}
                    </Button>
                </div>
                {errors.root && <p className="text-center text-sm text-red-500">{errors.root.message}</p>}
            </form>
            <p className="text-center text-muted-foreground pt-2">Don't have an account? <Link href={authenticationEndpoints.register} className="text-primary text-bold">Create one</Link></p>
        </div>
    );
}