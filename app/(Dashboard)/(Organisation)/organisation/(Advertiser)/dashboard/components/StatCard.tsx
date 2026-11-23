

interface StatCardProps {
    title: string;
    value: string;
}

export function StatCard({
    title,
    value,
}: StatCardProps) {
    return (
        <div className="rounded-lg border border-gray-200 p-5 h-40 flex flex-col justify-center items-center text-center shadow-sm bg-white">
            <p className="text-md text-muted-foreground">
                {title}
            </p>

            <p className="mt-1 text-2xl text-black font-semibold">
                {value}
            </p>
        </div>
    );
}