import { NavigationBar } from "./navigation"
import { Footer } from "./footer"

interface LayoutProps {
    children: React.ReactNode
}

export function AppLayout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavigationBar />
            <main className="mt-30 sm:mt-40">
                {children}
            </main>
            <footer className="mt-auto">
                <Footer />
            </footer>
        </div>
    )
}
