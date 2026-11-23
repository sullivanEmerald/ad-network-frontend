"use client";
import Avatar from "react-avatar";
export default function UserAvatar({ name, canShowName = true }: { name?: string, canShowName?: boolean }) {
    return (
        <div className="flex items-center space-x-2">
            <Avatar name={name} size="36" round={true} />
            {canShowName && <span className="hidden md:inline text-black font-medium">{name}</span>}
        </div>
    );
}
