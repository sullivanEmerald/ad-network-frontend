import {
    ArrowRight,
} from "lucide-react";

function Button({
    children,
    dark = false,
}: {
    children: React.ReactNode;
    dark?: boolean;
}) {
    return (
        <button className={`inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-sm font-semibold transition-all hover:gap-5 ${dark
            ? "bg-black text-white hover:bg-neutral-800"
            : "bg-[#fe2c55] text-white hover:bg-[#e91e48]"
            }`}>
            {children}
            <ArrowRight size={17} />
        </button>
    );
}

export { Button }