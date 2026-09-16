import { Publisher } from "@/types/publisher"

type PublisherProps = {
    publisher: Publisher;
};

export default function Publishers({ publisher }: PublisherProps) {
    return (
        <main className="grid gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-center sm:px-6">
            <div className="min-w-0">
                <p className="truncate font-medium text-gray-200">{publisher.name}</p>
                <p className="mt-1 truncate text-sm text-gray-500">{publisher.emailAddress}</p>
            </div>
            <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-600">Website</p>
                <p className="mt-1 truncate text-xs text-gray-400">{publisher.website}</p>
            </div>
            <span className="w-fit rounded-full border border-primary/25 bg-green-600 px-3 py-1 text-xs font-medium text-white">
                Active
            </span>
        </main>
    )
}