'use client'
import { useState } from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { Placeholder } from "../ui/Placeholder";
import {
    ArrowRight, ChevronDown
} from "lucide-react";

const faqs = [
    ["How do I get started?", "Create an account, configure your business profile, choose an advertising objective and launch your first campaign."],
    ["How much does advertising cost?", "Your advertising budget depends on your objectives, audience and campaign strategy. You can configure spending limits."],
    ["Can I target specific audiences?", "Yes. Audience targeting allows you to reach people using relevant demographic, interest and behavioral attributes."],
    ["How do I measure campaign performance?", "Use campaign analytics to monitor impressions, clicks, conversions, engagement and other important performance indicators."],
];
function FAQ() {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section className="py-24 bg-gray-900">
            <div className="mx-auto grid max-w-[1440px] gap-14 px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-12">
                <div>
                    <SectionHeading
                        eyebrow="Frequently asked questions"
                        title="Your questions, answered."
                        description="Find answers to common questions about getting started, managing campaigns and growing your business."
                        className="text-white"
                    />
                    <a href="#" className="inline-flex items-center gap-2 text-sm font-bold">Visit help center <ArrowRight size={17} /></a>
                </div>

                <div>
                    {faqs.map(([question, answer], i) => (
                        <div key={question} className="border-b border-neutral-200">
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="flex w-full items-center justify-between gap-5 py-7 text-left text-lg font-semibold text-white"
                            >
                                {question}
                                <ChevronDown className={`shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
                            </button>
                            {open === i && (
                                <p className="max-w-2xl pb-7 text-base leading-7 text-neutral-500">{answer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export { FAQ }
