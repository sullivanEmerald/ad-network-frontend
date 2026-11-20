function Placeholder({
    className = "",
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className={`relative overflow-hidden rounded-2xl bg-[#f1f1f1] ${className}`}>
            {/* <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/70 blur-2xl" />
            <div className="absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-[#dedede]/70 blur-2xl" /> */}
            <div className="relative z-10 text-center text-neutral-400">
                {children}
            </div>
        </div>
    );
}

export { Placeholder }