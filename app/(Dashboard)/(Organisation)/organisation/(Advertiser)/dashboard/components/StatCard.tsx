

interface StatCardProps {
    title: string;
    value: string;
}

export function StatCard({
    title,
    value,
}: StatCardProps) {
    return (
        <div className="rounded-lg border border-gray-700 bg-light-background p-5 h-40">
            <p className="text-sm text-muted-foreground">
                {title}
            </p>

            <p className="mt-1 text-2xl text-white font-semibold">
                {value}
            </p>
        </div>
    );
}