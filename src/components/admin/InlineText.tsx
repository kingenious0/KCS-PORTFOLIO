"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useContent } from "@/lib/ContentContext";
import { cn } from "@/lib/utils";
import { Edit2, Save, X, Bold, Italic, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface InlineTextProps {
    id: string; // Key in Firestore
    defaultValue: string;
    className?: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "span" | "div";
}

export function InlineText({ id, defaultValue, className, as: Tag = "span" }: InlineTextProps) {
    const { user } = useAuth();
    const { content, updateContent } = useContent();

    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const [tempValue, setTempValue] = useState(defaultValue);

    // State for Rich Text
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');

    useEffect(() => {
        const raw = content[id];
        if (!raw) {
            setValue(defaultValue);
            return;
        }

        try {
            // Try parsing as JSON for rich text
            const parsed = JSON.parse(raw);
            if (typeof parsed === 'object') {
                // If text is empty (deleted), fallback to default to prevent invisible layout
                setValue(parsed.text || defaultValue);
                setIsBold(parsed.bold || false);
                setIsItalic(parsed.italic || false);
                setAlignment(parsed.align || 'left');
            } else {
                setValue(String(parsed) || defaultValue);
            }
        } catch (e) {
            // Not JSON, treat as plain string
            setValue(raw || defaultValue);
        }
    }, [content, id, defaultValue]);

    const handleSave = async () => {
        try {
            // Save as JSON string to persist styles + text
            const payload = JSON.stringify({
                text: tempValue,
                bold: isBold,
                italic: isItalic,
                align: alignment
            });
            await updateContent(id, payload);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save content", error);
        }
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    if (!user) {
        return (
            <Tag
                className={cn(
                    className,
                    isBold && "font-bold",
                    isItalic && "italic",
                    alignment === 'center' ? "text-center block" : alignment === 'right' ? "text-right block" : "inline-block"
                )}
            >
                {value}
            </Tag>
        );
    }

    // Admin Mode: Floating Editor
    if (isEditing) {
        return (
            <div className="relative inline-block w-full group/editor z-[100]">
                {/* Editor Toolbar */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex items-center gap-1 bg-neutral-900 border border-white/20 rounded-md p-1 shadow-xl z-[110]">
                    <div className="flex gap-0.5 border-r border-white/10 pr-1 mr-1">
                        <button onClick={() => setIsBold(!isBold)} className={cn("p-1.5 rounded hover:bg-white/10 transition-colors", isBold && "text-neon-blue bg-white/10")} title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setIsItalic(!isItalic)} className={cn("p-1.5 rounded hover:bg-white/10 transition-colors", isItalic && "text-neon-blue bg-white/10")} title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex gap-0.5 border-r border-white/10 pr-1 mr-1">
                        <button onClick={() => setAlignment('left')} className={cn("p-1.5 rounded hover:bg-white/10 transition-colors", alignment === 'left' && "text-neon-blue bg-white/10")} title="Align Left"><AlignLeft className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setAlignment('center')} className={cn("p-1.5 rounded hover:bg-white/10 transition-colors", alignment === 'center' && "text-neon-blue bg-white/10")} title="Align Center"><AlignCenter className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setAlignment('right')} className={cn("p-1.5 rounded hover:bg-white/10 transition-colors", alignment === 'right' && "text-neon-blue bg-white/10")} title="Align Right"><AlignRight className="w-3.5 h-3.5" /></button>
                    </div>
                    <button onClick={handleCancel} className="p-1.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-500 transition-colors" title="Cancel"><X className="w-3.5 h-3.5" /></button>
                </div>

                <textarea
                    autoFocus
                    className={cn(
                        "w-full min-h-[100px] bg-neutral-900 text-white px-3 py-2 rounded-md border border-neon-blue outline-none resize shadow-[0_0_15px_rgba(0,243,255,0.1)]",
                        className,
                        isBold && "font-bold",
                        isItalic && "italic",
                        alignment === 'center' ? "text-center" : alignment === 'right' ? "text-right" : "text-left"
                    )}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSave();
                        }
                        if (e.key === 'Escape') handleCancel();
                    }}
                />

                {/* Custom Pill Save Button */}
                <button
                    onClick={handleSave}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 flex items-center justify-center gap-2 px-8 py-2.5 bg-black text-white text-base font-bold rounded-full hover:scale-105 transition-transform shadow-2xl z-[110] whitespace-nowrap border border-white/20"
                >
                    Save Changes
                </button>
            </div>
        );
    }

    // Default View (Admin)
    return (
        <Tag
            className={cn(
                className,
                "relative cursor-pointer hover:ring-1 hover:ring-neon-blue hover:bg-neon-blue/5 rounded px-1 -mx-1 transition-all group",
                isBold && "font-bold",
                isItalic && "italic",
                alignment === 'center' ? "text-center block" : alignment === 'right' ? "text-right block" : "inline-block"
            )}
            onClick={() => {
                setTempValue(value);
                setIsEditing(true);
            }}
        >
            {value}
            <span className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-neon-blue text-black p-1 rounded-full z-10 pointer-events-none shadow-lg">
                <Edit2 className="w-3 h-3" />
            </span>
        </Tag>
    );
}
