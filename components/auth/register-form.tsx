"use client"

import Input from "@/components/common/input";
import Button from "@/components/common/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticationEndpoints } from "@/endpoints/auth";
import { registerSchema, RegisterInput } from "@/lib/schemas/auth-schema";
import { Register } from "@/services/auth";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const users = [
    { label: "Advertiser", value: "advertiser" },
    { label: "Publisher", value: "publisher" },
]

export default function RegisterForm() {
    const router = useRouter();
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            businessEmail: "",
            organizationName: "",
            accountType: "advertiser",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (registerData: RegisterInput) => {
        const { confirmPassword: _confirmPassword, ...registrationPayload } = registerData;
        void _confirmPassword;
        const response = await Register(registrationPayload);
        void registrationPayload;
        reset();
        router.push('/auth/login');
    };

    return (
        <div className="w-full mx-auto md:w-[90%]">
            <div className="mb-4 flex flex-col items-center">
                <span className="text-primary font-bold text-lg">Start advertising or monetizing your audience.</span>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                    <Input
                        id="firstName"
                        label="first Name"
                        type="text"
                        autoComplete="given-name"
                        required
                        placeholder="Enter your first name"
                        {...register("firstName")}
                    />
                    {errors.firstName && <span className="text-xs text-red-500 mt-1 block">{errors.firstName.message}</span>}
                </div>
                <div>
                    <Input
                        id="lastName"
                        label="Last Name"
                        type="text"
                        autoComplete="family-name"
                        required
                        placeholder="Enter your last name"
                        {...register("lastName")}
                    />
                    {errors.lastName && <span className="text-xs text-red-500 mt-1 block">{errors.lastName.message}</span>}
                </div>
                <div>
                    <Input
                        id="organizationName"
                        label="Organization Name"
                        type="text"
                        autoComplete="organization name"
                        required
                        placeholder="Enter your organization name"
                        {...register("organizationName")}
                    />
                    {errors.organizationName && <span className="text-xs text-red-500 mt-1 block">{errors.organizationName.message}</span>}
                </div>
                <div>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        label="Business Email"
                        required
                        placeholder="Enter your business email"
                        {...register("businessEmail")}
                    />
                    {errors.businessEmail && <span className="text-xs text-red-500 mt-1 block">{errors.businessEmail.message}</span>}
                </div>
                <div>
                    <Controller
                        name="accountType"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger
                                    className="w-full text-white data-placeholder:text-white border border-gray-600"
                                    aria-invalid={!!errors.accountType}
                                >
                                    <SelectValue placeholder="Account type" />
                                </SelectTrigger>
                                <SelectContent className="">
                                    <SelectGroup>
                                        {users.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.accountType && <span className="text-xs text-red-500 mt-1 block">{errors.accountType.message}</span>}
                </div>
                <div>
                    <Input
                        id="password"
                        label="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder="Enter your password"
                        {...register("password")}
                    />
                    {errors.password && <span className="text-xs text-red-500 mt-1 block">{errors.password.message}</span>}
                </div>
                <div>
                    <Input
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder="Confirm your password"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && <span className="text-xs text-red-500 mt-1 block">{errors.confirmPassword.message}</span>}
                </div>
                <div className="w-full flex">
                    <Button type="submit" disabled={isSubmitting} className="w-full mx-auto self-end">
                        {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </Button>
                </div>
            </form>
            <p className="text-center text-muted-foreground pt-2 mb-6">Already have an account? <Link href={authenticationEndpoints.login} className="text-red-500 underline">Login</Link></p>
        </div>
    );
}
