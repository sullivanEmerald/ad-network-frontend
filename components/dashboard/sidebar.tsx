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
            className="w-64 h-full bg-white border-r border-gray-200 flex flex-col gap-6 py-3 px-4 shadow-sm fixed inset-y-0 left-0 z-40 hidden sm:flex"
            aria-label="Sidebar"
        >
            <AppLogo />
            <ul className="flex-1">
                {items.map((item) => (
                    <li key={item.to}>
                        <Link href={item.to} className={`${pathname.endsWith(item.to) ? "text-primary" : ""} px-2 text-lg hover:text-primary hover:bg-gray-100 hover:rounded-sm transition group flex items-center gap-2 py-2`}>
                            <item.icon className={`w-6 h-6 text-gray-500 ${pathname.endsWith(item.to) ? "text-primary" : "group-hover:text-gray-500"} rounded p-1 transition`} />
                            <span className={`text-gray-500 ${pathname.endsWith(item.to) ? "text-primary" : "group-hover:text-gray-500"} transition`}>
                                {item.label}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
