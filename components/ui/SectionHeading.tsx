function SectionHeading({
    eyebrow,
    title,
    description,
    center = false,
    className = '',
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    center?: boolean;
    className?: string
}) {
    return (
        <div className={`mb-12 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
            {eyebrow && (
                <p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-[#fe2c55]">
                    {eyebrow}
                </p>
            )}
            <h2 className={`${className} text-3xl font-bold leading-tight tracking-tight md:text-5xl`}>
                {title}
            </h2>
            {description && (
                <p className="mt-5 text-base leading-7 text-neutral-500 md:text-lg">
                    {description}
                </p>
            )}
        </div>
    );
}

export { SectionHeading }