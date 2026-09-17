"use client";

import type { ReactNode } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import Button from "@/components/common/button";

type RightDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
};

export default function RightDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
}: RightDialogProps) {
    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right" >
            <DrawerContent className="bg-light-background border-gray-700 " >
                <DrawerHeader>
                    <DrawerTitle className="text-lg font-semibold text-white">{title}</DrawerTitle>
                    {description && (
                        <DrawerDescription className="text-gray-400">{description}</DrawerDescription>
                    )}
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto p-4">
                    {children}
                </div>
                <DrawerFooter>
                    {footer ?? (
                        <>
                            <Button>Submit</Button>
                            <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
                        </>
                    )}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}


