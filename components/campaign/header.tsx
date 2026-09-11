
export default function CampaignHeader({ title, description, note }: { title?: string; description?: string, note?: string }) {
    return (
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{note && note}</p>
                <h1 className="text-3xl font-semibold tracking-tight text-gray-300 sm:text-4xl">{title && title}</h1>
                <p className="max-w-2xl text-sm leading-6 text-gray-500">{description && description}</p>
            </div>
        </header>
    );
}