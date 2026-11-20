import Link from "next/link"

export default function GetStarted() {
    return (
        <Link href={"/auth/login"} className="rounded-full text-sm font-semibold text-white bg-[#fe2c55] rounded-full flex items-center justify-center py-3 px-6 hover:bg-[#fe2c30] cursor-pointer">
            Get started
        </Link>
    )
}