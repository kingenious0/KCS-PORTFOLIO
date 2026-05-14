"use client";

import { motion } from "framer-motion";
import { InlineText } from "@/components/admin/InlineText";
import { Mail, MessageCircle, Link as LinkIcon } from "lucide-react";
import { SocialsManager } from "@/components/admin/SocialsManager";
import { useContent } from "@/lib/ContentContext";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

function EditableButton({ id, defaultUrl, defaultLabel, icon: Icon, variant = "neon" }: { id: string, defaultUrl: string, defaultLabel: string, icon: any, variant?: "neon" | "ghost" }) {
    const { user } = useAuth();
    const { content, updateContent } = useContent();

    const url = content[`${id}_url`] || defaultUrl;

    const handleEditUrl = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newUrl = prompt("Enter URL (e.g. mailto:me@example.com or https://wa.me/12345):", url);
        if (newUrl) {
            updateContent(`${id}_url`, newUrl);
        }
    };

    const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-wide uppercase transition-all duration-300 rounded-lg overflow-hidden px-12 py-6 text-lg";
    const variantStyles = variant === 'neon'
        ? "bg-black text-white hover:bg-neutral-800 border-none shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
        : "border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white";

    return (
        <div className="relative group">
            {user && (
                <button
                    onClick={handleEditUrl}
                    className="absolute -top-3 -right-3 z-20 p-1.5 bg-black border border-neon-blue rounded-full text-neon-blue hover:scale-110 shadow-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                    title="Edit Link URL"
                >
                    <LinkIcon className="w-3 h-3" />
                </button>
            )}

            <motion.a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`${baseStyles} ${variantStyles}`}
            >
                {/* Scanline effect for neon */}
                {variant === "neon" && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-scan" />
                )}

                <Icon className="mr-3 w-5 h-5 relative z-10" />
                <span className="relative z-10">
                    <InlineText id={`${id}_label`} defaultValue={defaultLabel} />
                </span>
            </motion.a>
        </div>
    );
}

export function ContactSection() {
    return (
        <section className="py-32 px-6 relative overflow-hidden border-t border-slate-100 dark:border-white/5">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-4xl mx-auto text-center space-y-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <h2 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                        <InlineText id="contactCTA" defaultValue="Got a project in mind? Let's talk" />
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                        <InlineText id="contactSub" defaultValue="I am currently available for new projects and collaborations. Let's build something exceptional together." />
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    <Link href="/contact" className="inline-flex items-center justify-center px-12 py-5 bg-orange-500 text-white rounded-full font-bold text-xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 group">
                        Let's Work Together <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </motion.div>
                
                {/* Minimal Socials */}
                <div className="pt-12">
                     <SocialsManager
                        id="socialLinks"
                        defaultValue={[
                            { name: "Instagram", url: "https://instagram.com" },
                            { name: "Twitter", url: "https://twitter.com" },
                            { name: "LinkedIn", url: "https://linkedin.com" },
                            { name: "GitHub", url: "https://github.com" }
                        ]}
                    />
                </div>
            </div>
        </section>
    );
}
