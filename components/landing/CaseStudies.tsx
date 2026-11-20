'use client'
import { useState } from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { Placeholder } from "../ui/Placeholder";
import {
    ArrowRight, ChevronDown, ChevronRight, Menu, X,
    Play, Sparkles, TrendingUp, Target, ShoppingBag,
    BarChart3, Users, Zap, Globe, MousePointer2
} from "lucide-react";


const caseStudies = [
    { category: "Retail", brand: "Northstar Retail", description: "A retail brand transformed product discovery into a measurable growth channel.", metric1: "52%", label1: "Increase in purchases", metric2: "3.4x", label2: "Return on ad spend" },
    { category: "Technology", brand: "Nova Technologies", description: "A technology company improved customer acquisition through performance advertising.", metric1: "68%", label1: "Increase in leads", metric2: "41%", label2: "Lower acquisition cost" },
    { category: "Beauty", brand: "Bloom Beauty", description: "A growing beauty business built awareness and expanded its customer base.", metric1: "87%", label1: "Increase in sales", metric2: "2.8x", label2: "Return on ad spend" },
    { category: "Food", brand: "Fresh Table", description: "A food brand connected with new customers through targeted campaigns.", metric1: "45%", label1: "Increase in orders", metric2: "36%", label2: "Lower cost per order" },
    { category: "Finance", brand: "FinEdge", description: "A financial services company increased qualified customer acquisition.", metric1: "61%", label1: "More qualified leads", metric2: "32%", label2: "Lower cost per lead" },
];

function CaseStudies() {
    const categories = ["All", "Retail", "Technology", "Beauty", "Food", "Finance"];
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered = activeCategory === "All"
        ? caseStudies
        : caseStudies.filter(item => item.category === activeCategory);

    return (
        <section className="py-24">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <SectionHeading
                        eyebrow="Customer success"
                        title="See how businesses grow."
                        description="Discover how brands are turning advertising strategies into measurable business outcomes."
                    />
                    <a href="#" className="mb-12 flex items-center gap-2 text-sm font-semibold">All success stories <ArrowRight size={17} /></a>
                </div>

                <div className="mb-10 flex flex-wrap gap-3">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`rounded-full px-5 py-3 text-sm font-semibold transition-all ${activeCategory === category
                                ? "bg-black text-white"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map(item => (
                        <article key={item.brand} className="overflow-hidden rounded-2xl border border-neutral-200">
                            <Placeholder className="h-56 rounded-none flex items-center justify-center">
                                <div className="text-center">
                                    <TrendingUp size={38} />
                                    <p className="mt-3 text-sm font-semibold">{item.category} success story</p>
                                </div>
                            </Placeholder>
                            <div className="p-7">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#fe2c55]">{item.category}</span>
                                <h3 className="mt-3 text-2xl text-white font-bold">{item.brand}</h3>
                                <p className="mt-3 min-h-[75px] text-sm leading-6 text-neutral-500">{item.description}</p>
                                <div className="my-7 grid grid-cols-2 gap-4 border-y border-neutral-100 py-6">
                                    <div className="text-white">
                                        <div className="text-3xl font-bold">{item.metric1}</div>
                                        <p className="mt-2 text-xs text-neutral-500">{item.label1}</p>
                                    </div>
                                    <div className="text-white">
                                        <div className="text-3xl font-bold">{item.metric2}</div>
                                        <p className="mt-2 text-xs text-neutral-500">{item.label2}</p>
                                    </div>
                                </div>
                                <a href="#" className="flex items-center gap-2 text-sm text-red-500 font-bold">Read case study <ArrowRight size={17} /></a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export { CaseStudies }