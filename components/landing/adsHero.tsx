
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AdsHero() {
    return (
        <section className="relative isolate min-h-[650px] overflow-hidden bg-[#071b49] text-white lg:min-h-[720px]">

            {/* Background artwork */}
            <Image
                src="/images/ads-hero-background.png"
                alt="Advertising analytics dashboard showing campaign growth"
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
            />

            {/* Blue overlays for text readability */}
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-[#061a46]/95 via-[#073b91]/65 to-transparent" />

            <div className="absolute inset-0 -z-0 bg-gradient-to-t from-[#061a46]/40 via-transparent to-transparent" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex min-h-[650px] max-w-[1440px] items-center px-6 py-24 lg:min-h-[720px] lg:px-12">

                <div className="max-w-[650px]">

                    <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-md">
                        Smarter advertising. Bigger possibilities.
                    </span>

                    <h1 className="mt-8 text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                        Turn attention into{" "}
                        <span className="text-[#fe2c55]">
                            real business growth.
                        </span>
                    </h1>

                    <p className="mt-7 max-w-[540px] text-lg leading-8 text-white/85 sm:text-xl">
                        Discover smarter ways to reach your audience, create
                        meaningful connections and drive measurable results
                        with powerful advertising solutions.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-5">

                        <Link
                            href="/register"
                            className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-[#09285e] transition-all hover:bg-[#dceeff] hover:gap-5"
                        >
                            Start advertising
                            <ArrowRight size={19} />
                        </Link>

                        <Link
                            href="#solutions"
                            className="inline-flex items-center gap-2 font-semibold text-white transition hover:text-[#8dcaff]"
                        >
                            Explore solutions
                            <ArrowRight size={18} />
                        </Link>

                    </div>

                    <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70">
                        <span>✓ Reach new audiences</span>
                        <span>✓ Optimize campaigns</span>
                        <span>✓ Measure results</span>
                    </div>

                </div>
            </div>
        </section>
    );
}
