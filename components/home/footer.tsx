import { AppLogo } from "@/components/common/logo";
import { navLinks, SocialHandles } from "@/lib/custom";
import Link from "next/link";


const Footer = () => {
    return (
        <footer className="flex flex-col md:flex-row items-start py-8 px-4 sm:px-8 border-t border-gray-700 gap-6 bg-gray-800">
            {/* Logo Section */}
            <div className="flex flex-col items-start gap-2 w-full sm:w-1/1">
                <AppLogo />
                <div className="text-gray-400">
                    Custex is a cutting-edge SaaS advertising platform designed to empower businesses with advanced tools for managing and optimizing their advertising campaigns.
                </div>


                <p className="text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} Custex. All rights reserved.
                </p>
            </div>

            {/* Navigation + Social */}
            <div className="flex w-full gap-20 md:gap-1 md:justify-between">
                <nav className="flex flex-col items-start gap-2 w-full">
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

                <nav className="flex flex-col items-start gap-2">
                    {SocialHandles.map((link) => {
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-primary transition-colors"
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </footer>
    );
}

export { Footer };