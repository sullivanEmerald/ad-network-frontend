import {
    ArrowRight, ChevronDown, ChevronRight, Menu, X,
    Play, Sparkles, TrendingUp, Target, ShoppingBag,
    BarChart3, Users, Zap, Globe, MousePointer2
} from "lucide-react";

function FinalCTA() {
    return (
        <section className="px-6 pb-24 lg:px-12 bg-gray-900">
            <div className="mx-auto max-w-[1440px] overflow-hidden rounded-3xl bg-[#fe2c55] px-8 py-20 text-center text-white md:py-28">
                <p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-white/75">Your next chapter starts here</p>
                <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                    Ready to turn your ambition into results?
                </h2>
                <p className="mx-auto mt-6 max-w-xl leading-7 text-white/85">
                    Start building campaigns that connect with audiences and move your business forward.
                </p>
                <div className="mt-9">
                    <button className="rounded-full bg-white px-9 py-4 text-sm font-bold text-black transition hover:bg-neutral-100">
                        Get started <ArrowRight className="ml-2 inline" size={17} />
                    </button>
                </div>
            </div>
        </section>
    );
}

export { FinalCTA }