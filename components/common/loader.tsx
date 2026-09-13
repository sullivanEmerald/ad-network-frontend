import { Loader2 } from "lucide-react"

export function Loader() {
    return (
        <div className="flex items-center justify-center py-10 mt-20">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
    );
}
