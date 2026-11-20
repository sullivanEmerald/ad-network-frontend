import { SectionHeading } from "../ui/SectionHeading";
import { Placeholder } from "../ui/Placeholder";
import {
    ArrowRight, ChevronDown, ChevronRight, Menu, X,
    Play, Sparkles, TrendingUp, Target, ShoppingBag,
    BarChart3, Users, Zap, Globe, MousePointer2
} from "lucide-react";
const resources = [
    { title: "Learning Center", description: "Build your advertising knowledge with practical courses and guides.", tag: "EDUCATION" },
    { title: "Business Manager", description: "Manage your advertising activities and collaborate with your team.", tag: "MANAGEMENT" },
    { title: "Partner Network", description: "Discover trusted professionals to help scale your marketing.", tag: "PARTNERS" },
];

function ExploreMore() {
    return (
        <section className="bg-[#f7f7f7] py-24">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                <SectionHeading title="Explore more possibilities." />
                <div className="grid gap-6 md:grid-cols-3">
                    {resources.map((item, i) => (
                        <article key={item.title} className="overflow-hidden rounded-2xl bg-white">
                            <Placeholder className="h-52 rounded-none flex items-center justify-center">
                                {i === 0 ? <Sparkles size={40} /> : i === 1 ? <BarChart3 size={40} /> : <Users size={40} />}
                            </Placeholder>
                            <div className="p-7">
                                <p className="text-xs font-bold tracking-widest text-[#fe2c55]">{item.tag}</p>
                                <h3 className="mt-4 text-2xl font-bold">{item.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-neutral-500">{item.description}</p>
                                <a href="#" className="mt-7 flex items-center gap-2 text-sm font-semibold">Learn more <ArrowRight size={16} /></a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export { ExploreMore }