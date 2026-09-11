import Link from "next/link"
const AppLogo = () => {
    return (
        <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-primary">AdCustex</p>
            </Link>
        </div>
    )
}

export { AppLogo }