import {
    ArrowRight,
    BarChart3,
} from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Placeholder } from "../ui/Placeholder";
import Image from "next/image";

function Newsroom() {
    return (
        <section className="bg-[#f7f7f7] py-24">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
                    <SectionHeading
                        eyebrow="Newsroom"
                        title="Ideas that inspire action."
                        description="Explore perspectives, stories and insights that help businesses move forward."
                    />
                    <a href="#" className="mb-12 flex items-center gap-2 text-sm font-semibold">Visit newsroom <ArrowRight size={17} /></a>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <article className="group">
                        <Placeholder className="aspect-[16/9]">
                            <img
                                src="/images/ops/innovation.png"
                                alt="Advertising analytics dashboard showing campaign growth"
                                className="object-cover w-full"
                            />
                        </Placeholder>
                        <p className="mt-6 text-xs font-bold tracking-widest text-[#fe2c55]">BUSINESS INSIGHTS</p>
                        <h3 className="mt-3 text-2xl font-bold">The changing landscape of digital discovery</h3>
                        <p className="mt-3 text-neutral-500">Understand how audience behaviors are transforming the way brands connect with customers.</p>
                        <a href="#" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">Read article <ArrowRight size={16} /></a>
                    </article>
                    <article className="group">
                        <Placeholder className="aspect-[16/9]">
                            <img
                                src="/images/ops/ip.png"
                                alt="Advertising analytics dashboard showing campaign growth"
                                className="object-cover w-full"
                            />
                        </Placeholder>
                        <p className="mt-6 text-xs font-bold tracking-widest text-[#fe2c55]">MARKETING TRENDS</p>
                        <h3 className="mt-3 text-2xl font-bold">Making smarter decisions with advertising data</h3>
                        <p className="mt-3 text-neutral-500">Learn how data-driven strategies can improve campaign performance and long-term growth.</p>
                        <a href="#" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">Read article <ArrowRight size={16} /></a>
                    </article>
                </div>
            </div>
        </section>
    );
}

export { Newsroom }