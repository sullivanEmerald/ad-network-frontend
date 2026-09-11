"use client";
import { useEffect } from "react";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/shallow";

export default function GetAuthMe() {
    const { authMe } = useStore(useShallow((state) => ({
        authMe: state.getAuthMethod,
    })));

    useEffect(() => {
        authMe();
    }, []);

    return null;

}