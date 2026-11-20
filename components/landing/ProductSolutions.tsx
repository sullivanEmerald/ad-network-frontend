import { SectionHeading } from "../ui/SectionHeading";
import { Placeholder } from "../ui/Placeholder";
import {
    ArrowRight, ChevronDown, ChevronRight, Menu, X,
    Play, Sparkles, TrendingUp, Target, ShoppingBag,
    BarChart3, Users, Zap, Globe, MousePointer2
} from "lucide-react";

const solutions = [
    { number: "01", title: "Branding", description: "Create lasting impressions and build brand awareness across every touchpoint.", icon: Sparkles, color: "#f6d7ce" },
    { number: "02", title: "Creative", description: "Discover, create and optimize content that captures audience attention.", icon: Play, color: "#dce8ff" },
    { number: "03", title: "Commerce", description: "Connect discovery with shopping experiences that convert.", icon: ShoppingBag, color: "#e5e9d7" },
    { number: "04", title: "Measurement", description: "Understand campaign performance and measure your business impact.", icon: BarChart3, color: "#f5e5b9" },
    { number: "05", title: "Performance", description: "Use intelligent advertising solutions to maximize your returns.", icon: TrendingUp, color: "#e8d9f4" },
];

function ProductSolutions() {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                <SectionHeading
                    eyebrow="Explore our products"
                    title="Everything you need to grow."
                    description="A connected ecosystem of advertising tools and solutions designed to help you achieve your business objectives."
                />

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {solutions.map(item => {
                        const Icon = item.icon;
                        return (
                            <article key={item.title} className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all hover:shadow-xl">
                                <div className="p-7 pb-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold tracking-widest text-neutral-400">{item.number}</span>
                                        <span className="rounded-full p-3" style={{ background: item.color }}>
                                            <Icon size={22} />
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-2xl font-bold">{item.title}</h3>
                                    <p className="mt-3 min-h-[60px] text-sm leading-6 text-neutral-500">{item.description}</p>
                                    <a href="#" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold group-hover:text-[#fe2c55]">
                                        Explore solutions <ArrowRight size={16} />
                                    </a>
                                </div>
                                <Placeholder className="mx-5 mb-5 h-44 rounded-xl flex items-center justify-center">
                                    <Icon size={48} />
                                </Placeholder>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export { ProductSolutions }