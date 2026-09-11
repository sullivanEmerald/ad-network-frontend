import { Button as ShadcnButton } from "@/components/ui/button";
import React from "react";

interface ButtonProps extends React.ComponentProps<typeof ShadcnButton> {
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ className = "", children, ...props }) => {
    return (
        <ShadcnButton
            className={`w-auto bg-primary text-white text-md py-5 px-4 rounded-full font-semibold hover:bg-primary/80 transition cursor-pointer shadow-sm shadow-primary hover:shadow-sm border-none ${className}`}
            {...props}
        >
            {children}
        </ShadcnButton>
    );
};

export default Button;
