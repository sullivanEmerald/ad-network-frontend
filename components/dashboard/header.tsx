"use client"
import Avatar from "react-avatar";
import { FaBell, FaPlus } from "react-icons/fa";
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    User,
    Settings,
    HelpCircle,
    CreditCard,
    LogOut
} from "lucide-react";
import Link from "next/link";
import UserAvatar from "@/components/dashboard/avatar";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";
import { authenticationEndpoints } from "@/endpoints/auth";
// import { useAuth } from "@/hooks/userAuth";
// import { getFirstName } from "@/utility/util";




type MenuItem = {
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    to?: string;
};


const menuItems: MenuItem[] = [
    {
        label: "Profile",
        icon: User,
        to: "/dashboard/profile/personal-information",
    },
    {
        label: "Settings",
        icon: Settings,
        to: "/dashboard/settings",
    },
    {
        label: "Help",
        icon: HelpCircle,
        to: "/dashboard/help",
    },
    {
        label: "Payments",
        icon: CreditCard,
        to: "/dashboard/payments",
    },
    {
        label: "Logout",
        icon: LogOut,
    },
];



export default function UserHeader() {
    // const { user, logout } = useAuth();
    const walletBalance = 1200.5;
    const router = useRouter();

    const handleAddFunds = () => {
        alert("Add funds clicked!");
    };

    return (
        <header className="w-full flex items-center bg-light-background justify-between shadow px-4 py-3 sticky border-b border-gray-800 backdrop-blur-md top-0 z-30 h-16">
            <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400 tracking-tight">Hello, Sullivan Amadike</span>
            </div>
            <div className="flex items-center gap-6">
                <button className="relative p-2 rounded-full hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-primary" title="Notifications">
                    <FaBell size={20} className="text-gray-500" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <Popover>
                    <PopoverTrigger >
                        <div className="flex items-center gap-2 cursor-pointer">
                            <UserAvatar name={'Sullivan Amadike'} />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="bg-light-background">
                        <PopoverHeader>
                            <PopoverTitle className='text-gray-300'>Account menu</PopoverTitle>
                        </PopoverHeader>
                        <div className="bg-light-background">
                            {menuItems.map(({ label, icon: Icon, to }, index) => (
                                <div key={label}>
                                    {to ? (
                                        <>
                                            <Link href={to} className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-100 rounded-lg group transition">
                                                <Icon size={18} className="text-gray-200 group-hover:text-gray-800" />
                                                <span className="text-sm font-medium text-gray-200 group-hover:text-gray-800">
                                                    {label}
                                                </span>
                                            </Link>
                                            <hr className="border-gray-200 mx-4" />
                                        </>
                                    ) : (
                                        <button
                                            className="flex items-center gap-3 py-3 w-full cursor-pointer hover:bg-gray-100 rounded-lg group transition border-none outline-none bg-transparent focus:outline-none"
                                            onClick={async () => {
                                                await logout();
                                                router.push(authenticationEndpoints.login);
                                            }}
                                        >
                                            <Icon size={18} className="text-gray-200 group-hover:text-gray-800" />
                                            <span className="text-sm font-medium text-gray-200 group-hover:text-gray-800">
                                                {label}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </header>
    );
}