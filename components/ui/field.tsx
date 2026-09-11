import type { ReactNode } from "react";

interface FieldProps {
    label?: string;
    htmlFor: string;
    error?: string;
    hint?: string;
    children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
    return (
        <div className="mb-5">
            {label && (
                <label htmlFor={htmlFor} className="mb-1 block text-md text-gray-400">
                    {label}
                </label>
            )}
            {children}
            {hint && !error && <p className="mt-1 text-sm text-green-500">{hint}</p>}
            {error && (
                <p className="mt-1 text-xs text-red-500" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
