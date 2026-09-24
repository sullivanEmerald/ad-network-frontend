"use client"

import Input from "@/components/common/input";
import Button from "@/components/common/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticationEndpoints } from "@/endpoints/auth";
import { registerSchema, RegisterInput } from "@/lib/schemas/auth-schema";
import { Register } from "@/services/auth";
import { Building2, RadioTower } from "lucide-react";

export default function RegisterForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            accountType: "advertiser",
            advertiserName: "",
            advertiserEmail: "",
            publisherName: "",
            contactName: "",
            emailAddress: "",
            website: "",
            password: "",
            confirmPassword: "",
        },
    });
    const accountType = watch("accountType");

    const onSubmit = async (registerData: RegisterInput) => {
        const { accountType, password, ...roleFields } = registerData;
        const registrationPayload = accountType === "advertiser"
            ? {
                accountType,
                password,
                advertiserName: roleFields.advertiserName,
                advertiserEmail: roleFields.advertiserEmail,
            }
            : {
                accountType,
                password,
                publisherName: roleFields.publisherName,
                contactName: roleFields.contactName,
                publisherEmail: roleFields.emailAddress,
                website: roleFields.website,
            };
        await Register(registrationPayload);
        reset();
        router.push('/auth/login');
    };

    return (
        <div className="w-full mx-auto md:w-[90%]">
            <div className="mb-4 flex flex-col items-center">
                <span className="text-primary font-bold text-lg">Start advertising or monetizing your audience.</span>
            </div>
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
                <div className="grid grid-cols-2 gap-1" role="tablist" aria-label="Choose account type">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={accountType === "advertiser"}
                        onClick={() => setValue("accountType", "advertiser", { shouldValidate: true })}
                        className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${accountType === "advertiser" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                    >
                        <Building2 className="size-4" />
                        Advertiser
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={accountType === "publisher"}
                        onClick={() => setValue("accountType", "publisher", { shouldValidate: true })}
                        className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${accountType === "publisher" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                    >
                        <RadioTower className="size-4" />
                        Publisher
                    </button>
                </div>
                <p className="px-2 pt-2 text-center text-xs text-gray-500">
                    {accountType === "advertiser" ? "Promote your products with targeted campaigns." : "Monetize your audience with premium ad placements."}
                </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                <input type="hidden" {...register("accountType")} />
                {accountType === "advertiser" ? (
                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold text-white">Advertiser details</p>
                            <p className="mt-1 text-xs text-gray-500">Tell us about the business you want to advertise.</p>
                        </div>
                        <div>
                            <Input id="advertiserName" label="Advertiser name / Company" placeholder="Acme Inc." {...register("advertiserName")} />
                            {errors.advertiserName && <span className="text-xs text-red-500 mt-1 block">{errors.advertiserName.message}</span>}
                        </div>
                        <div>
                            <Input id="advertiserEmail" type="email" label="Advertiser email" placeholder="hello@acme.com" {...register("advertiserEmail")} />
                            {errors.advertiserEmail && <span className="text-xs text-red-500 mt-1 block">{errors.advertiserEmail.message}</span>}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold text-white">Publisher details</p>
                            <p className="mt-1 text-xs text-gray-500">Share your publication details so advertisers can find you.</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <Input id="publisherName" label="Publisher name" placeholder="TechBlog" {...register("publisherName")} />
                                {errors.publisherName && <span className="text-xs text-red-500 mt-1 block">{errors.publisherName.message}</span>}
                            </div>
                            <div>
                                <Input id="contactName" label="Contact name" placeholder="John Doe" {...register("contactName")} />
                                {errors.contactName && <span className="text-xs text-red-500 mt-1 block">{errors.contactName.message}</span>}
                            </div>
                        </div>
                        <div>
                            <Input id="emailAddress" type="email" label="Email address" placeholder="john@techblog.com" {...register("emailAddress")} />
                            {errors.emailAddress && <span className="text-xs text-red-500 mt-1 block">{errors.emailAddress.message}</span>}
                        </div>
                        <div>
                            <Input id="website" type="url" label="Website" placeholder="https://techblog.com" {...register("website")} />
                            {errors.website && <span className="text-xs text-red-500 mt-1 block">{errors.website.message}</span>}
                        </div>
                    </div>
                )}
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
