import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarImage,
} from "@/components/ui/avatar"

export function Users() {
    return (
        <AvatarGroup className="">
            <Avatar>
                <AvatarFallback className="bg-primary !text-white">C</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback className="bg-orange-600 !text-white">L</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback className="bg-pink-600 !text-white">S</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback className="bg-purple-500 !text-white">A</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback className="bg-yellow-700 !text-white">C</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback className="bg-blue-500 !text-white">M</AvatarFallback>
            </Avatar>
        </AvatarGroup>
    )
}
