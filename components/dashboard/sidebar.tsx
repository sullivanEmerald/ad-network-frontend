import Link from "next/link";
import { AppLogo } from "../common/logo";
import { FaEdit } from "react-icons/fa"
import { dashboardEndpoints } from "@/endpoints/dashboard";
import { usePathname } from "next/navigation";

interface SidebarItem {
    to: string;
    icon: React.ElementType;
    label: string;
    paths?: string[];
}

interface SidebarProps {
    items: SidebarItem[];
    role?: string;
}

export default function Sidebar({ items, role }: SidebarProps) {
    const pathname = usePathname();
    return (
        <nav
            className="w-64 h-full bg-light-background border-r border-gray-800 flex flex-col gap-6 py-3 px-4 shadow-sm fixed inset-y-0 left-0 z-40 hidden sm:flex"
            aria-label="Sidebar"
        >
            <AppLogo />
            <ul className="flex-1">
                {/* <li className="mb-2">
                    <Link href={dashboardEndpoints.createCampaign} className="flex items-center gap-3 py-3 rounded-2xl px-2 text-lg hover:bg-primary/80  transition group focus:outline-none focus:ring-2 focus:ring-primary">
                        <FaEdit className="w-6 h-6 text-white group-hover:text-white group-hover:bg-primary rounded p-1 transition" />

                        <span className="text-primary group-hover:text-gray-300">Create Campaign</span>
                    </Link>
                </li> */}
                {items.map((item) => (
                    <li key={item.to}>
                        <Link href={item.to} className={pathname.endsWith(item.to) ? "flex items-center gap-3 py-3 rounded-2xl px-2 text-lg bg-primary/10 text-primary" : "flex items-center gap-3 py-3 rounded-2xl px-2 text-lg hover:bg-primary/10 transition group focus:outline-none focus:ring-2 focus:ring-primary"}>
                            <item.icon className="w-6 h-6 text-white group-hover:text-white group-hover:bg-primary rounded p-1 transition" />
                            <span className="text-gray-500 group-hover:text-gray-300">{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
