import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="">
                {label && (
                    <label className="block text-md text-black font-bold">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`w-full border border-gray-600 placeholder:text-gray-400 rounded-sm px-2 py-2 bg-gray-100 text-black ${className}`}
                    {...props}
                />
                {error && (
                    <span className="text-xs text-red-500 mt-1 block">{error}</span>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
