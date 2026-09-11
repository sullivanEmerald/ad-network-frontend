import AuthInformation from "@/components/authentication/information"
import AuthStaticGuard from "@/guards/auth-guard"
export default function AuthenticationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthStaticGuard>
            <div className="relative min-h-screen bg-background">
                <AuthInformation />
                <main className="flex min-h-screen w-full flex-col justify-center px-6 py-12 sm:px-8 lg:pl-[45%] lg:pr-12">
                    <div className="mx-auto w-full max-w-md">{children}</div>
                </main>
            </div>
        </AuthStaticGuard>
    )
}