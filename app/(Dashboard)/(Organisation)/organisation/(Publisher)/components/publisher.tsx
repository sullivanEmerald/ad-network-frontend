import { Publisher } from "@/types/publisher"
import Button from "@/components/common/button";

type PublisherProps = {
    publisher: Publisher;
    onViewInventory: (id: string) => void;
};

export default function Publishers({ publisher, onViewInventory }: PublisherProps) {
    return (
        <article className="flex h-full flex-col justify-between gap-5 rounded-xl border border-white/10 bg-black/10 p-5 transition hover:border-primary/40">
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="truncate font-medium text-gray-200">{publisher.name}</p>
                        <p className="mt-1 truncate text-sm text-gray-500">{publisher.emailAddress}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-primary/25 bg-green-600 px-3 py-1 text-xs font-medium text-white">
                        Active
                    </span>
                </div>
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-600">Website</p>
                    <p className="mt-1 truncate text-xs text-gray-400">{publisher.website}</p>
                </div>
            </div>
            <Button
                type="button"
                className="w-1/2 self-end px-2 py-2"
                onClick={() => onViewInventory(publisher.id)}
            >
                View Inventory
            </Button>
        </article>
    )
}