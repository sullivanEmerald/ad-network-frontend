// --------------------------------------------------
// BUSINESS OBJECTIVES
// --------------------------------------------------
'use client'
import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading"
import {
    ArrowRight, ChevronDown, ChevronRight, Menu, X,
    Play, Sparkles, TrendingUp, Target, ShoppingBag,
    BarChart3, Users, Zap, Globe, MousePointer2
} from "lucide-react";
import GetStarted from "../layout/GetStarted";

const objectives = [
    { title: "Expand your reach", description: "Put your brand in front of over a billion users ready to discover it..", icon: Globe },
    { title: "Increase visibility", description: "Make your business impossible to overlook.", icon: TrendingUp },
    { title: "Drive engagement", description: "Build meaningful relationships with your audience.", icon: Users },
    { title: "Attract customers", description: "Turn interest into valuable customer relationships.", icon: Target },
    { title: "Increase sales", description: "Transform product discovery into purchases.", icon: ShoppingBag },
    { title: "Generate leads", description: "Connect with prospects who are ready to take action.", icon: MousePointer2 },
    { title: "Boost conversions", description: "Optimize every interaction for measurable results.", icon: BarChart3 },
    { title: "Grow your business", description: "Build sustainable growth with smarter campaigns.", icon: Zap },

];

function Objectives() {
    const [showAll, setShowAll] = useState(false);

    return (
        <section className="bg-[#f7f7f7] py-10 px-6 sm:px-12">
            <div className="flex flex-col sm:flex-row gap-4 max-w-[1440px]">
                <div className="w-full sm:w-[60%]">
                    <SectionHeading
                        eyebrow="Your business, your goals"
                        title="Turn attention into business results."
                        description="Reach highly engaged audiences and turn attention into measurable business growth.."
                    />
                    <div className="w-[40%]">
                        <GetStarted />
                    </div>
                </div>
                <section className="w-full s:w-[40%]">
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                        {(showAll ? objectives : objectives.slice(0, 6)).map((item, i, array) => {
                            const Icon = item.icon;
                            // const isLastRow = i === array[array.length - 1] ;
                            return (
                                <a key={item.title} href="#" className="group flex gap-3 min-h-[100px] border-b py-7 transition-all">
                                    <div className="w-[50%]">
                                        <div className="w-full flex items-center justify-center min-h-[120px] rounded-sm bg-black text-[#2dccd3] group-hover:text-[#fe2c55]">
                                            <Icon size={40} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{item.title}</h3>
                                        <p className="text-sm leading-6 text-neutral-500">{item.description}</p>
                                        <div className="mt-5 flex items-center gap-2 text-sm font-semibold group-hover:text-[#fe2c55]">
                                            Explore <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                    <button onClick={() => setShowAll(!showAll)} className="mx-auto mt-10 flex items-center gap-2 text-sm font-semibold">
                        {showAll ? "Show less" : "Show more"} <ChevronDown size={17} />
                    </button>
                </section>
            </div>
        </section>
    );
}

export { Objectives }