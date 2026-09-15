import { Briefcase, Users, BarChart2, CreditCard, MessageCircle, User, Building2, FileText, Settings, Store, Loader, CheckCircle, Clock, Send, UserCheck, BadgeCheck, Wallet, HelpCircle, Eye, Trash2, ArchiveX, X, Play, CalendarDays, FileEdit, BarChart3, Globe } from "lucide-react";


export const CAMPAIGN_MAIN_NAV = [
    {
        to: "/organisation/dashboard",
        icon: Briefcase,
        label: "Dashboard",
        paths: [],
    },
    {
        to: "/organisation/campaign",
        icon: BarChart2,
        label: "Campaigns",
        paths: [],
    },
    {
        to: "/organisation/advertisers",
        icon: User,
        label: "Advertisers",
        paths: [],
    },

];

export const PUBLISHER_MENU_BARS = [
    {
        label: "Ad marketplace",
        to: "/organisation/publisher/marketplace",
        icon: BarChart3,
        paths: []
    },
    {
        label: "Websites",
        to: "/organisation/publisher/websites",
        icon: Globe,
        paths: []
    },
    {
        label: "Ad units",
        to: "/publisher/ad-units",
        icon: BarChart3,
        paths: []
    },
];

export const CAMPAIGN_PROFILE_NAV = [
    {
        to: "/dashboard",
        icon: Briefcase,
        label: "Dashboard",
        paths: [],
    },
];

export const CAMPAIGN_SETTINGS_NAV = [
    {
        to: "/campaign/dashboard",
        icon: Briefcase,
        label: "Dashboard",
        paths: [],
    },
];


export const getStatusColor = (status: string) => {
    switch (status) {
        case "pending":
            return "#140f30";
        case "published":
            return "#F2720C";
        case "inProgress":
            return "#600D07";
        case "completed":
            return "#1C4C2D";
        case "assigned":
            return "#224074";
        case "workers":
            return '#FCB404';
        case "approved":
            return "#2E7D32";
        case "applied":
            return "#B91C1C";
        case "paid":
            return "#0F766E";
        case "totalEarnings":
            return "#7C3AED";
        case "directInvitations":
            return "#B91C1C";
        case "assigned":
            return "#7C3AED";
        case "upcomingShifts":
            return "#6B7280";
        case "totalShifts":
            return "#140f30";
        case "totalWorkers":
            return "#6B7280";
        default:
            return "#6B7280";
    }
};

export const getIcon = (action: string) => {
    switch (action) {
        case "view":
            return Eye;
        case "publish":
            return Send;
        case "unpublish":
            return ArchiveX;
        case "edit":
            return FileText;
        case "delete":
            return Trash2;
        case "pending":
            return Clock;
        case "published":
            return Users;
        case "inProgress":
            return Briefcase;
        case "completed":
        case "mark as completed":
            return CheckCircle;
        case "assigned":
            return UserCheck;
        case "workers":
            return Users;
        case "approved":
        case "approve":
            return BadgeCheck;
        case "start":
            return Play;
        case "applied":
            return FileText;
        case "paid":
            return CreditCard;
        case "totalEarnings":
            return Wallet;
        case "directInvitations":
            return Send;
        case "reject":
            return X;
        case "totalWorkers":
            return Users;
        case "totalShifts":
            return CalendarDays;
        case "draft":
            return FileEdit;
        default:
            return HelpCircle;
    }
}

export const getAccountTypeDisplay = (type: string | null) => {
    if (!type) return '';
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    return capitalizedType;
}


export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const timeFormatRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
export const urlRegex =
    /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,6})?(\/[\w\d-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
export const validNamePattern = /^[A-Za-z0-9\s]+$/;
export const phonePattern = /^\+?[0-9\s\-()]{7,20}$/;

export const validatePassword = (password: any) => {
    if (!password) {
        return "Password is required";
    }
    if (password.length < 8) {
        return "Your password is not strong enough. Use at least 8 characters";
    }
    if (!/[0-9]/.test(password)) {
        return "Use at least 1 digit";
    }
    if (!/[A-Z]/.test(password)) {
        return "Use at least 1 Uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
        return "Use at least 1 Lowercase letter";
    }
    return "";
};