import { navLinks } from "@/lib/custom";
import Link from "next/link";

export default function AppNavigationLinks() {
    return (
        <nav className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            {navLinks.map((link) => (
                <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-gray-400 hover:text-primary transition-colors"
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    )
}