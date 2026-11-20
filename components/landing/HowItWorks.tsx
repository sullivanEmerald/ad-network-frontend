'use client'
import { useState } from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { Placeholder } from "../ui/Placeholder";
import {
    ArrowRight, ChevronDown, ChevronRight, Menu, X,
    Play, Sparkles, TrendingUp, Target, ShoppingBag,
    BarChart3, Users, Zap, Globe, MousePointer2
} from "lucide-react";

const steps = [
    ["Create your account", "Get access to your advertising workspace and all the tools you need to manage campaigns."],
    ["Define your objective", "Choose the business outcome you want to achieve with your advertising."],
    ["Find your audience", "Reach the right people through flexible audience targeting and discovery."],
    ["Set your budget", "Choose your spending limits and configure your campaign delivery."],
    ["Launch your campaign", "Publish your creative, monitor performance and optimize your results."],
];

function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <section className="bg-[#f7f7f7] py-24">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                <SectionHeading
                    eyebrow="Getting started"
                    title="Your next big idea starts here."
                    description="Getting your first advertising campaign running is easier than you think."
                />

                <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
                    <div className="space-y-2">
                        {steps.map((step, i) => (
                            <button
                                key={step[0]}
                                onClick={() => setActiveStep(i)}
                                className={`flex w-full items-center gap-5 rounded-xl p-5 text-left transition-all ${activeStep === i ? "bg-white shadow-md" : "hover:bg-white/70"
                                    }`}
                            >
                                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${activeStep === i ? "bg-[#fe2c55] text-white" : "bg-neutral-200"
                                    }`}>
                                    0{i + 1}
                                </span>
                                <span className="flex-1 text-lg font-semibold">{step[0]}</span>
                                <ChevronRight size={19} className={activeStep === i ? "text-[#fe2c55]" : "text-neutral-400"} />
                            </button>
                        ))}
                    </div>

                    <div className="flex min-h-[390px] flex-col justify-center rounded-3xl bg-white p-8 md:p-14">
                        <span className="text-sm font-bold text-[#fe2c55]">STEP 0{activeStep + 1}</span>
                        <h3 className="mt-6 text-3xl font-bold md:text-4xl">{steps[activeStep][0]}</h3>
                        <p className="mt-5 max-w-lg leading-7 text-neutral-500">{steps[activeStep][1]}</p>
                        <Placeholder className="mt-8 h-36 flex items-center justify-center">
                            <MousePointer2 size={35} />
                        </Placeholder>
                        <div className="mt-7 flex items-center justify-between">
                            <span className="text-sm text-neutral-400">{activeStep + 1} of 5</span>
                            <button onClick={() => setActiveStep((activeStep + 1) % 5)} className="flex items-center gap-2 text-sm font-bold">
                                Next step <ArrowRight size={17} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { HowItWorks }