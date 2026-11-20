import { Placeholder } from "../ui/Placeholder";
import {
    ArrowRight, Sparkles,
} from "lucide-react";
function Announcement() {
    return (
        <section className="py-16">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                <div className="grid items-center gap-10 md:grid-cols-2">
                    <Placeholder className="min-h-[300px] flex items-center justify-center">
                        <div className="text-center">
                            <Sparkles size={45} className="mx-auto mb-4" />
                            <p className="text-sm font-semibold">Featured event / announcement</p>
                        </div>
                    </Placeholder>
                    <div className="py-8">
                        <p className="mb-4 text-xs font-bold tracking-widest text-[#fe2c55]">FEATURED ANNOUNCEMENT</p>
                        <h2 className="text-4xl text-black font-bold leading-tight md:text-5xl">
                            Discover what's next for modern advertising.
                        </h2>
                        <p className="mt-6 leading-7 text-neutral-500">
                            Explore new ideas, emerging trends and innovative solutions shaping the future of digital marketing.
                        </p>
                        <a href="#" className="mt-8 inline-flex items-center gap-3 font-semibold">
                            Discover more <ArrowRight size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Announcement }