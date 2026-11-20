// --------------------------------------------------
// NAVIGATION
// --------------------------------------------------
"use client"
import { useState } from "react";
import {
    ArrowRight, ChevronDown, ChevronRight, Menu, X,
} from "lucide-react";
import { Button } from "../ui/clickButton";
import Link from "next/link";
import { AppLogo } from "../common/logo";
import GetStarted from "./GetStarted";

function Navigation() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState("");

    const menus = [
        { label: "Solutions", items: ["Branding", "Creative", "Commerce", "Measurement", "Performance"] },
        { label: "Create", items: ["Campaign Manager", "Business Center", "Creative Studio", "Analytics"] },
        { label: "Learn", items: ["Insights", "Case Studies", "Blog", "Guides"] },
        { label: "Resources", items: ["Help Center", "Marketing Partners", "Academy"] },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
            <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-6 lg:px-12">
                <AppLogo />
                <nav className="hidden items-center gap-8 lg:flex">
                    {menus.map(menu => (
                        <div
                            key={menu.label}
                            className="relative"
                            onMouseEnter={() => setActiveDropdown(menu.label)}
                            onMouseLeave={() => setActiveDropdown("")}
                        >
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === menu.label ? "" : menu.label)}
                                className="flex items-center gap-2 text-sm font-medium hover:text-[#fe2c55]"
                            >
                                {menu.label}
                                <ChevronDown size={15} />
                            </button>

                            {activeDropdown === menu.label && (
                                <div className="absolute left-0 top-full w-64 rounded-xl border border-neutral-100 bg-white p-3 shadow-xl">
                                    {menu.items.map(item => (
                                        <a key={item} href="#" className="block rounded-lg px-4 py-3 text-sm hover:bg-neutral-100">
                                            {item}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="hidden items-center gap-4 lg:flex">
                    <Link href={"/auth/login"} className="text-sm font-semibold border border-gray-200 rounded-full flex items-center justify-center py-3 px-6 hover:border-black transition-all cursor-pointer">Log in</Link>
                    <GetStarted />
                </div>

                <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t bg-white p-6 lg:hidden">
                    {menus.map(menu => (
                        <div key={menu.label} className="border-b py-3">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === menu.label ? "" : menu.label)}
                                className="flex w-full justify-between font-semibold"
                            >
                                {menu.label}
                                <ChevronDown size={18} />
                            </button>
                            {activeDropdown === menu.label && (
                                <div className="mt-3 space-y-3 pl-4">
                                    {menu.items.map(item => (
                                        <a key={item} href="#" className="block text-sm text-neutral-500">{item}</a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="mt-6 flex flex-col gap-4">
                        <Link href={"/auth/login"} className="text-sm font-semibold border border-gray-200 rounded-full flex items-center justify-center py-3 px-6 hover:border-black transition-all cursor-pointer">Log in</Link>
                        <Link href={"/auth/login"} className="rounded-full text-sm font-semibold text-white bg-[#fe2c55] rounded-full flex items-center justify-center py-3 px-6 hover:bg-[#fe2c30] cursor-pointer">
                            Get started
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

export { Navigation }