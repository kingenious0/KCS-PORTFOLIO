"use client";

import { useContent } from "@/lib/ContentContext";

interface BrandInitialsProps {
    defaultValue?: string;
    className?: string;
}

export function BrandInitials({ defaultValue = "ELITE HYBRID", className }: BrandInitialsProps) {
    const { content } = useContent();

    // Parse content safely to handle potentially JSON-stored text (from InlineText)
    const raw = content["brandName"];
    let brandName = defaultValue;

    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (typeof parsed === 'object' && parsed.text) {
                brandName = parsed.text;
            } else {
                brandName = String(raw);
            }
        } catch {
            brandName = String(raw);
        }
    }

    // Sanitize: remove non-alphanumeric chars (except spaces)
    const cleanName = brandName.replace(/[^a-zA-Z0-9\s]/g, "");

    const initials = cleanName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0])
        .join('')
        .toUpperCase();

    return (
        <div className={`w-full h-full flex items-center justify-center font-black text-white ${className}`}>
            {initials}
        </div>
    );
}
