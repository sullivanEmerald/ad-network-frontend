
"use client";
import { AppLogo } from "../common/logo";

function Footer() {
    const columns = [
        { title: "Solutions", links: ["Branding", "Creative", "Commerce", "Measurement", "Performance"] },
        { title: "Business tools", links: ["Campaign Manager", "Business Center", "Analytics", "Creative Studio"] },
        { title: "Resources", links: ["Insights", "Case Studies", "Blog", "Guides", "Academy"] },
        { title: "Support", links: ["Help Center", "Contact us", "Partners", "About us"] },
    ];

    return (
        <footer className="bg-[#151515] text-white">
            <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12">
                <div className="flex flex-wrap items-start justify-between gap-10 border-b border-white/15 pb-14">
                    <div className="max-w-sm">
                        <AppLogo />
                        <p className="mt-6 text-sm leading-7 text-neutral-400">
                            Empowering businesses with innovative advertising solutions and tools to achieve meaningful growth.
                        </p>
                    </div>
                    <div className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-4">
                        {columns.map(column => (
                            <div key={column.title}>
                                <h4 className="mb-6 font-bold">{column.title}</h4>
                                <div className="space-y-4">
                                    {column.links.map(link => (
                                        <a key={link} href="#" className="block text-sm text-neutral-400 hover:text-white">{link}</a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap justify-between gap-5 pt-8 text-xs text-neutral-500">
                    <p>© 2026 Your Brand. All rights reserved.</p>
                    <div className="flex flex-wrap gap-6">
                        <a href="#">Privacy policy</a>
                        <a href="#">Terms of service</a>
                        <a href="#">Cookie policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export { Footer }


