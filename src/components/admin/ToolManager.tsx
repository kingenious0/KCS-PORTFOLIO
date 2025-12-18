"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useContent } from "@/lib/ContentContext";
import { Upload, X, Plus, Loader2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ToolItem {
    name: string;
    iconUrl?: string; // Optional custom override
    isCustom?: boolean;
}

interface ToolManagerProps {
    id: string; // Firestore content key
    defaultValue: ToolItem[];
    colorClass: string;
}

export function ToolManager({ id, defaultValue, colorClass }: ToolManagerProps) {
    const { user } = useAuth();
    const { content, updateContent } = useContent();
    const [isUploading, setIsUploading] = useState<number | null>(null); // Index of item being uploaded

    // Parse content: Expecting JSON array, fallback to defaultValue
    let tools: ToolItem[] = defaultValue;
    try {
        const raw = content[id];
        if (raw) {
            // First try parsing as JSON
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) tools = parsed;
            } catch {
                // Legacy support: if it's a comma string, convert it
                tools = raw.split(',').map(s => ({ name: s.trim() }));
            }
        }
    } catch (e) {
        console.error("Error parsing tools", e);
    }

    const saveTools = async (newTools: ToolItem[]) => {
        // Optimistic UI update could go here if we had local state, but we rely on Context
        // For now, we update Firestore directly.
        // We actally usually just store stringified JSON for complex objects in this simple content system
        await updateContent(id, JSON.stringify(newTools));
    };

    const handleAdd = () => {
        const newName = prompt("Enter tool name:");
        if (newName) {
            saveTools([...tools, { name: newName }]);
        }
    };

    const handleRemove = (index: number) => {
        if (confirm("Remove this tool?")) {
            const next = [...tools];
            next.splice(index, 1);
            saveTools(next);
        }
    };

    const handleNameEdit = (index: number) => {
        const newName = prompt("Edit name:", tools[index].name);
        if (newName) {
            const next = [...tools];
            next[index].name = newName;
            saveTools(next);
        }
    };

    const handleUpload = async (index: number, file: File) => {
        try {
            setIsUploading(index);
            const data = new FormData();
            data.append("file", file);
            data.append("folder", "portfolio/tools");

            const res = await fetch("/api/upload", { method: "POST", body: data });
            if (!res.ok) throw new Error("Upload failed");

            const json = await res.json();

            const next = [...tools];
            next[index].iconUrl = json.url;
            next[index].isCustom = true;
            await saveTools(next);

        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setIsUploading(null);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Main Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {tools.map((tool, i) => {
                    // Logic for Icon URL
                    // If custom URL exists, use it. Else use SimpleIcons logic
                    let iconUrl = tool.iconUrl;
                    if (!iconUrl) {
                        const slug = tool.name.toLowerCase()
                            .replace(/\+/g, "plus")
                            .replace(/\./g, "dot")
                            .replace(/\s/g, "");
                        iconUrl = `https://cdn.simpleicons.org/${slug}/${colorClass.replace('#', '')}`;
                    }

                    return (
                        <div key={i} className="relative flex flex-col items-center justify-center p-3 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 transition-all group">

                            {/* Admin Controls Overlay */}
                            {user && (
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1 z-20">
                                    <button onClick={() => handleRemove(i)} className="bg-red-500/20 text-red-400 p-1 rounded hover:bg-red-500 hover:text-white transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}

                            {/* Icon Container with Upload Overlay */}
                            <div className="w-8 h-8 relative mb-2 group/icon">
                                {isUploading === i ? (
                                    <Loader2 className="w-full h-full animate-spin text-neon-blue" />
                                ) : (
                                    <>
                                        <img
                                            src={iconUrl}
                                            alt={tool.name}
                                            className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                        <span className="hidden w-full h-full flex items-center justify-center font-bold text-lg text-slate-500">
                                            {tool.name[0]}
                                        </span>
                                    </>
                                )}

                                {/* Upload Overlay (Admin) */}
                                {user && (
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/80 rounded cursor-pointer opacity-0 group-hover/icon:opacity-100 transition-opacity">
                                        <Upload className="w-4 h-4 text-white" />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(i, e.target.files[0])} />
                                    </label>
                                )}
                            </div>

                            {/* Name (Click to Edit) */}
                            {user ? (
                                <span onClick={() => handleNameEdit(i)} className="text-xs font-medium text-slate-400 group-hover:text-white text-center pb-1 cursor-pointer border-b border-transparent hover:border-slate-500">
                                    {tool.name}
                                </span>
                            ) : (
                                <span className="text-xs font-medium text-slate-400 group-hover:text-white text-center pb-1">
                                    {tool.name}
                                </span>
                            )}
                        </div>
                    );
                })}

                {/* Add New Button (Admin) */}
                {user && (
                    <button onClick={handleAdd} className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-white/20 hover:border-neon-blue hover:bg-neon-blue/10 transition-colors text-slate-500 hover:text-neon-blue">
                        <Plus className="w-8 h-8 mb-2" />
                        <span className="text-xs font-bold">ADD TOOL</span>
                    </button>
                )}
            </div>
        </div>
    );
}
