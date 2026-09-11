
import { Card } from "@/components/ui/card";
export default function BlockLayout({ children }: { children: React.ReactNode }) {
    return (
        <Card className="border border-gray-700 bg-transparent rounded-2xl p-4 hover:shadow-lg transition-shadow duration-300 max-w-[400px]">
            {children}
        </Card>
    );
}