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
                className={`flex flex-col justify-start px-4 py-8 shadow-lg border border-gray-200 rounded-lg mx-auto ${className}`}
                style={{ minWidth: 320, maxWidth: 480 }}
                {...(className ? {} : { "data-aos": "fade-up" })}
            >
                <h2 className="text-lg font-normal text-black text-center">{title}</h2>
                {subTitle && (
                    <p className="text-base text-gray-500 text-center">{subTitle}</p>
                )}
                {buttonText && onButtonClick && (
                    <Button
                        onClick={onButtonClick}
                        className="mt-4"
                    >
                        {buttonText}
                    </Button>
                )}
            </div>
        </div>
    );
};
