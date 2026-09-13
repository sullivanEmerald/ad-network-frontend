import Image from "next/image";
import Button from "./button";

interface NotFoundComponentProps {
    title: string;
    subTitle?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    className?: string;
}

export const NotFoundComponent = ({
    title,
    subTitle,
    buttonText,
    onButtonClick,
    className = "",
}: NotFoundComponentProps) => {
    return (
        <div className="flex items-center justify-center w-full h-full min-h-[60vh]">
            <div
                className={`flex flex-col gap-6 justify-start bg-gray-200 px-3 py-4 shadow-lg outline rounded-lg mx-auto ${className}`}
                style={{ minWidth: 320, maxWidth: 480 }}
                {...(className ? {} : { "data-aos": "fade-up" })}
            >
                <h2 className="text-2xl font-semibold text-black text-center">{title}</h2>
                {subTitle && (
                    <p className="text-base text-gray-500">{subTitle}</p>
                )}
                {buttonText && onButtonClick && (
                    <Button
                        onClick={onButtonClick}
                        className="p-6"
                    >
                        {buttonText}
                    </Button>
                )}
            </div>
        </div>
    );
};
