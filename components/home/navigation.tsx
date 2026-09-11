"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import AppLogo from "../common/appLogo";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverTitle,
    PopoverDescription,
    PopoverHeader,
} from "@/components/ui/popover";
import { useState } from "react";
import { Briefcase, UserCheck } from "lucide-react";
import { navLinks } from "@/lib/custom";
import AppNavigationLinks from "./navlinks";
import Button from "../common/button";
import { AppLogo } from "../common/logo";


export function NavigationBar() {
    const router = useRouter();
    // const { isAuthenticated, userRole } = useAuth();
    const [open, setOpen] = useState(false);

    const handleSelect = (role: 'provider' | 'carer') => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('role', role);
        }
        router.push('/auth/login');
    };

    return (
        <header className="fixed top-0 w-full border-b border-gray-700 bg-background backdrop-blur-sm z-50 px-4 sm:px-8">
            <div className="flex h-16 items-center justify-between">
                <AppLogo />
                <AppNavigationLinks />
                <div className="flex items-center space-x-4 relative">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger>
                            <p className="hidden sm:block px-4 py-2 flex items-center justify-center">
                                Get Started
                                <svg className="inline ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </p>
                        </PopoverTrigger>
                        <PopoverContent className="z-50 w-40 rounded-lg bg-white border border-gray-200 shadow-lg p-2">
                            {/* <PopoverHeader>
                                <PopoverTitle className="text-base font-semibold">
                                    Continue As
                                    <Underline />
                                </PopoverTitle>
                            </PopoverHeader> */}
                            <div className=" flex flex-col gap-2">
                                <button
                                    className="flex items-center gap-2 w-full text-left hover:bg-primary/80 text-gray-700 rounded cursor-pointer"
                                    onClick={() => handleSelect('provider')}
                                >
                                    <Briefcase className="w-4 h-4 text-primary" />
                                    Provider
                                </button>
                                <button
                                    className="flex items-center gap-2 w-full text-left hover:bg-gray-100 text-gray-700 rounded cursor-pointer"
                                    onClick={() => handleSelect('carer')}
                                >
                                    <UserCheck className="w-4 h-4 text-primary" />
                                    Carer
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </header>
    );
}
