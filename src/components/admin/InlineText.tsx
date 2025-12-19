"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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

    // Admin Mode: Floating Editor (Portal)
    if (isEditing) {
        if (typeof window === 'undefined') return null;

        const EditorModal = (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-in fade-in duration-200">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    onClick={handleCancel}
                />

                {/* Editor Box */}
                <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 scale-100">

                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-mono text-gray-500 mr-2 uppercase tracking-wider">Format</span>
                            <div className="flex bg-black/50 rounded-lg p-0.5 border border-white/5">
                                <button onClick={() => setIsBold(!isBold)} className={cn("p-1.5 rounded-md transition-all", isBold ? "bg-neon-blue text-black shadow-lg shadow-neon-blue/20" : "text-gray-400 hover:text-white hover:bg-white/10")} title="Bold"><Bold className="w-4 h-4" /></button>
                                <button onClick={() => setIsItalic(!isItalic)} className={cn("p-1.5 rounded-md transition-all", isItalic ? "bg-neon-blue text-black shadow-lg shadow-neon-blue/20" : "text-gray-400 hover:text-white hover:bg-white/10")} title="Italic"><Italic className="w-4 h-4" /></button>
                            </div>
                            <div className="w-px h-4 bg-white/10 mx-2" />
                            <div className="flex bg-black/50 rounded-lg p-0.5 border border-white/5">
                                <button onClick={() => setAlignment('left')} className={cn("p-1.5 rounded-md transition-all", alignment === 'left' ? "bg-neon-blue text-black shadow-lg shadow-neon-blue/20" : "text-gray-400 hover:text-white hover:bg-white/10")} title="Align Left"><AlignLeft className="w-4 h-4" /></button>
                                <button onClick={() => setAlignment('center')} className={cn("p-1.5 rounded-md transition-all", alignment === 'center' ? "bg-neon-blue text-black shadow-lg shadow-neon-blue/20" : "text-gray-400 hover:text-white hover:bg-white/10")} title="Align Center"><AlignCenter className="w-4 h-4" /></button>
                                <button onClick={() => setAlignment('right')} className={cn("p-1.5 rounded-md transition-all", alignment === 'right' ? "bg-neon-blue text-black shadow-lg shadow-neon-blue/20" : "text-gray-400 hover:text-white hover:bg-white/10")} title="Align Right"><AlignRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <button onClick={handleCancel} className="p-1.5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                    </div>

                    {/* Text Area */}
                    <div className="p-4 bg-neutral-900/50">
                        <textarea
                            autoFocus
                            className={cn(
                                "w-full min-h-[150px] bg-transparent text-white text-lg placeholder:text-gray-700 outline-none resize-none leading-relaxed",
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
                            placeholder="Type here..."
                        />
                    </div>

                    {/* Footer / Actions */}
                    <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-white/10 bg-white/5">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2 bg-neon-blue text-black text-sm font-bold rounded-lg hover:bg-neon-blue/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)]"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        );

        return (
            <>
                <Tag className={cn(className, "opacity-50 blur-[2px]")}>
                    {value}
                </Tag>
                {createPortal(EditorModal, document.body)}
            </>
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
