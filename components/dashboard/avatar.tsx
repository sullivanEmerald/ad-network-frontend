"use client";
import Avatar from "react-avatar";
export default function UserAvatar({ name, canShowName = true }: { name?: string, canShowName?: boolean }) {
    return (
        <div className="flex items-center space-x-4">
            <Avatar name={name} size="36" round={true} />
            {canShowName && <span className="hidden md:inline text-gray-200 font-medium">{name}</span>}
        </div>
    );
}
