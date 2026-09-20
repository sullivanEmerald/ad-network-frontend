"use client";

import { CalendarDays } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type DatePickerProps = InputHTMLAttributes<HTMLInputElement>;

export function DatePicker({ className, ...props }: DatePickerProps) {
    return (
        <div className="relative">
            <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
                type="date"
                className={cn(
                    "flex h-11 w-full rounded-lg border border-input bg-transparent px-3 py-2 pl-10 text-sm text-foreground shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            />
        </div>
    );
}