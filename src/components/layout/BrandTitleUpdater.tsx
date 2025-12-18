"use client";

import { useEffect } from "react";
import { useContent } from "@/lib/ContentContext";

export function BrandTitleUpdater() {
    const { content } = useContent();
    const brandName = content["brandName"];

    useEffect(() => {
        if (brandName) {
            document.title = `${brandName} | Beatmaker & Developer`;
        }
    }, [brandName]);

    return null;
}
