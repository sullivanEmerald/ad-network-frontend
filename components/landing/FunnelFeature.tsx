import {
    ArrowRight
} from "lucide-react";

function FunnelFeature() {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                <div className="grid overflow-hidden rounded-3xl bg-[#171717] text-white lg:grid-cols-2">
                    <div className="flex flex-col justify-center p-9 md:p-16 lg:p-20">
                        <p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-[#ff8297]">The bigger picture</p>
                        <h2 className="text-4xl font-bold leading-tight md:text-6xl">
                            Every stage. Every opportunity. One connected experience.
                        </h2>
                        <p className="mt-7 max-w-lg leading-7 text-neutral-400">
                            Build a connected advertising strategy that attracts attention, creates consideration and drives measurable action throughout the customer journey.
                        </p>
                        <div className="mt-9">
                            <button className="flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-black">
                                Explore the experience <ArrowRight size={17} />
                            </button>
                        </div>
                    </div>

                    <div className="flex min-h-[390px] items-center justify-center bg-[#242424] p-8 md:p-12">
                        <div className="w-full max-w-md space-y-3">
                            {[
                                ["01", "DISCOVERY", "Capture attention", "w-full"],
                                ["02", "CONSIDERATION", "Build interest", "w-[85%]"],
                                ["03", "CONVERSION", "Drive action", "w-[70%]"],
                                ["04", "LOYALTY", "Grow relationships", "w-[55%]"],
                            ].map((item, i) => (
                                <div key={item[0]} className={`${item[3]} rounded-xl border border-white/10 bg-white/5 p-5`}>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-[#ff8297]">{item[0]}</span>
                                        <div>
                                            <div className="text-[10px] font-bold tracking-widest text-neutral-400">{item[1]}</div>
                                            <div className="mt-1 font-semibold">{item[2]}</div>
                                        </div>
                                        <ArrowRight className="ml-auto text-neutral-500" size={18} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { FunnelFeature }