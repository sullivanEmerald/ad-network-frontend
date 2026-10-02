"use client";
import Avatar from "react-avatar";
export default function DisplayAvatar({ name, canShowName = true }: { name?: string, canShowName?: boolean }) {
    return (
        <div className="flex items-center space-x-4">
            <Avatar name={name} size="36" round={true} />
            {canShowName && <span className="text-white font-medium">{name}</span>}
        </div>
    );
}
