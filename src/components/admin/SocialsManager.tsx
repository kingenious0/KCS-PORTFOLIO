"use client";

import { useAuth } from "@/lib/AuthContext";
import { useContent } from "@/lib/ContentContext";
import { X, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

interface SocialItem {
    name: string;
    url: string;
}

interface SocialsManagerProps {
    id: string;
    defaultValue: SocialItem[];
}

export function SocialsManager({ id, defaultValue }: SocialsManagerProps) {
    const { user } = useAuth();
    const { content, updateContent } = useContent();

    let socials: SocialItem[] = defaultValue;
    try {
        const raw = content[id];
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) socials = parsed;
        }
    } catch (e) { console.error(e); }

    const save = async (newItems: SocialItem[]) => {
        await updateContent(id, JSON.stringify(newItems));
    };

    const handleAdd = () => {
        const name = prompt("Social Network Name (e.g. Instagram):");
        if (!name) return;
        const url = prompt("Profile URL:");
        if (!url) return;
        save([...socials, { name, url }]);
    };

    const handleRemove = (index: number) => {
        if (confirm("Remove this link?")) {
            const next = [...socials];
            next.splice(index, 1);
            save(next);
        }
    };

    const handleEdit = (index: number) => {
        const item = socials[index];
        const name = prompt("Network Name:", item.name);
        if (!name) return;
        const url = prompt("URL:", item.url);
        if (!url) return;

        const next = [...socials];
        next[index] = { name, url };
        save(next);
    };

    return (
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {socials.map((social, i) => {
                const slug = social.name.toLowerCase().replace(/\s/g, "");
                const iconUrl = `https://cdn.simpleicons.org/${slug}/fff`; // White icons

                return (
                    <div key={i} className="relative group">
                        {/* Admin Controls */}
                        {user && (
                            <div className="absolute -top-4 -right-4 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(i)} className="bg-blue-500/20 text-blue-400 p-1 rounded hover:bg-blue-500 hover:text-white" title="Edit Link">
                                    <ExternalLink className="w-3 h-3" />
                                </button>
                                <button onClick={() => handleRemove(i)} className="bg-red-500/20 text-red-400 p-1 rounded hover:bg-red-500 hover:text-white" title="Remove">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        <Link
                            href={social.url}
                            target="_blank"
                            className="block hover:scale-110 transition-transform opacity-70 hover:opacity-100"
                        >
                            <img
                                src={iconUrl}
                                alt={social.name}
                                className="w-8 h-8 md:w-10 md:h-10"
                                onError={(e) => {
                                    // Fallback to text if icon fails
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            <div className="hidden w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-white text-xs border border-white/20">
                                {social.name[0]}
                            </div>
                        </Link>
                    </div>
                );
            })}

            {/* Add Button */}
            {user && (
                <button onClick={handleAdd} className="flex items-center justify-center w-10 h-10 rounded-full border border-dashed border-white/20 hover:bg-white/10 hover:border-white transition-colors text-white/50 hover:text-white">
                    <Plus className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
