// --------------------------------------------------
// HERO
// --------------------------------------------------
import { Button } from "../ui/clickButton";
import { Placeholder } from "../ui/Placeholder";

function Hero() {
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-20 lg:px-12 lg:pb-28 lg:pt-28">
                <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
                    <div>
                        <p className="mb-7 text-sm font-bold uppercase tracking-[.2em] text-[#fe2c55]">
                            Advertising that moves business forward
                        </p>
                        <h2 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-[-.055em] md:text-6xl">
                            Discover new possibilities. <span className="text-[#fe2c55]">Grow your business.</span>
                        </h2>
                        <p className="mt-7 max-w-xl text-lg leading-8 text-neutral-500">
                            Connect with the right audiences, create meaningful experiences and turn attention into measurable business results.
                        </p>
                        <div className="mt-9 flex flex-wrap gap-4">
                            <Button>Start advertising</Button>
                            <button className="rounded-full border border-neutral-300 px-7 py-4 text-sm font-semibold hover:bg-neutral-50">
                                Explore solutions
                            </button>
                        </div>
                    </div>

                    <Placeholder className="min-h-[400px] lg:min-h-[510px] flex items-center justify-center">
                        <div className="w-full border px-8">
                            <div className="rounded-3xl bg-white p-6 text-left shadow-lg">
                                <div className="mb-8 flex items-center justify-between">
                                    <span className="text-sm font-bold">Campaign overview</span>
                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">Active</span>
                                </div>
                                <div className="mb-2 text-sm text-neutral-400">Total engagement</div>
                                <div className="text-4xl font-bold text-black">84,290</div>
                                <div className="mt-2 text-xs font-semibold text-green-600">↑ 28.4% this month</div>
                                <div className="mt-8 flex h-24 items-end gap-2">
                                    {[35, 55, 42, 75, 60, 90, 65, 100, 78, 95].map((h, i) => (
                                        <div key={i} style={{ height: `${h}%` }} className="flex-1 rounded-t-md bg-[#fe2c55]/70" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Placeholder>
                </div>
            </div>
        </section>
    );
}

export { Hero }