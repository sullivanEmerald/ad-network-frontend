import { Navigation } from "../layout/Navigation"
import { Footer } from "../layout/Footer"

interface LayoutProps {
    children: React.ReactNode
}

export function AppLayout({ children }: LayoutProps) {
    return (
        <div className="">
            <Navigation />
            <main className="">
                {children}
            </main>
            <footer className="mt-auto">
                <Footer />
            </footer>
        </div>
    )
}
