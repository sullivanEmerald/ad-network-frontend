import AuthInformation from "@/components/authentication/information"
import AuthStaticGuard from "@/guards/auth-guard"
import Header from "@/components/layout/Header"
export default function AuthenticationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthStaticGuard>
            <div className="relative min-h-screen">
                <Header />
                <div className="flex items-center justify-center lg:block">
                    <main className="px-6 pb-20 pt-8 lg:px-25 lg:pb-10 lg:pt-10">
                        {children}
                    </main>
                    <AuthInformation />
                </div>

            </div>
        </AuthStaticGuard>
    )
}