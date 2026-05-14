"use client";

import { useAuth } from "@/lib/AuthContext";
import { useContent } from "@/lib/ContentContext";
import { X, Plus, ExternalLink, Instagram, Github, Linkedin, Twitter, Youtube, Globe, Mail } from "lucide-react";
import Link from "next/link";

interface SocialItem {
    name: string;
    url: string;
}

interface SocialsManagerProps {
    id: string;
    defaultValue: SocialItem[];
}

// Map common names to Lucide icons
const iconMap: Record<string, any> = {
    instagram: Instagram,
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    x: Twitter,
    youtube: Youtube,
    gmail: Mail,
    email: Mail,
    website: Globe,
    portfolio: Globe
};

// Map common names to SimpleIcons slugs
const slugMap: Record<string, string> = {
    linkedin: "linkedin",
    github: "github",
    instagram: "instagram",
    x: "x",
    twitter: "x",
    youtube: "youtube",
    facebook: "facebook",
    twitch: "twitch",
    discord: "discord",
    spotify: "spotify"
};

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
        const name = prompt("Social Network Name (e.g. LinkedIn, GitHub, X):");
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
                const normalizedName = social.name.toLowerCase().trim();
                const LucideIcon = iconMap[normalizedName] || Globe;
                const slug = slugMap[normalizedName] || normalizedName.replace(/\s/g, "");
                const iconUrl = `https://cdn.simpleicons.org/${slug}/fff`; // White icons

                return (
                    <div key={i} className="relative group">
                        {/* Admin Controls */}
                        {user && (
                            <div className="absolute -top-4 -right-4 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(i)} className="bg-orange-500/20 text-orange-400 p-1 rounded hover:bg-orange-500 hover:text-white" title="Edit Link">
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
                            className="flex flex-col items-center gap-2 hover:scale-110 transition-transform group/link"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all group-hover/link:border-orange-500/50 group-hover/link:bg-orange-500/5">
                                <img
                                    src={iconUrl}
                                    alt={social.name}
                                    className="w-5 h-5 md:w-6 md:h-6 object-contain"
                                    onError={(e) => {
                                        // Fallback to Lucide Icon if SimpleIcons fails
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <div className="hidden">
                                    <LucideIcon className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover/link:text-orange-500 transition-colors" />
                                </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover/link:text-white transition-colors">
                                {social.name}
                            </span>
                        </Link>
                    </div>
                );
            })}

            {/* Add Button */}
            {user && (
                <button onClick={handleAdd} className="flex flex-col items-center gap-2 group/add">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-dashed border-slate-300 dark:border-white/20 flex items-center justify-center hover:bg-orange-500/5 hover:border-orange-500/50 transition-all text-slate-300 dark:text-white/20 hover:text-orange-500">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover/add:opacity-100 transition-opacity">Add</span>
                </button>
            )}
        </div>
    );
}
