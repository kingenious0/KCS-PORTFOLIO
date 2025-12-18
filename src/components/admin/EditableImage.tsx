"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { useContent } from "@/lib/ContentContext";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableImageProps {
    id: string;
    defaultSrc: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    compact?: boolean;
}

export function EditableImage({ id, defaultSrc, alt, className, width, height, fill, compact }: EditableImageProps) {
    const { user } = useAuth();
    const { content, updateContent } = useContent();
    const [isUploading, setIsUploading] = useState(false);

    const currentSrc = content[id] || defaultSrc;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "portfolio");

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Upload failed");

            const data = await uploadRes.json();
            await updateContent(id, data.url);

        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={cn("relative group/image overflow-hidden", className)}>
            <Image
                src={currentSrc}
                alt={alt}
                width={width}
                height={height}
                fill={fill}
                loading="lazy"
                className={cn("transition-transform duration-700", fill ? "object-cover" : "", isUploading && "opacity-50 grayscale")}
            />

            {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                    <Loader2 className={cn("animate-spin text-neon-blue", compact ? "w-4 h-4" : "w-8 h-8")} />
                </div>
            )}

            {/* Admin Edit Controls */}
            {user && !isUploading && (
                <>
                    {/* 1. Permanent Edit Badge (Always Visible) */}
                    <div className="absolute top-2 right-2 z-[60]">
                        <label className="flex items-center justify-center w-8 h-8 bg-neon-blue text-black rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)] cursor-pointer hover:scale-110 transition-transform">
                            <Upload className="w-4 h-4" />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {/* 2. Center Overlay (On Hover) */}
                    <label
                        className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/image:opacity-100 transition-all duration-300 cursor-pointer z-50"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <div className="flex flex-col items-center text-white gap-2">
                            <span className="font-bold text-xs uppercase tracking-widest text-center drop-shadow-md">Click to Change</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                </>
            )}
        </div>
    );
}
