"use client";

import { motion } from "framer-motion";
import { InlineText } from "@/components/admin/InlineText";
import { Mail, MessageCircle, Link as LinkIcon } from "lucide-react";
import { SocialsManager } from "@/components/admin/SocialsManager";
import { useContent } from "@/lib/ContentContext";
import { useAuth } from "@/lib/AuthContext";

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
                    className="absolute -top-3 -right-3 z-20 p-1.5 bg-black border border-neon-blue rounded-full text-neon-blue hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
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
        <section className="py-32 px-4 relative overflow-hidden">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-100/50 to-slate-200 dark:via-black/50 dark:to-neutral-900 -z-10" />

            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl md:text-7xl font-black mb-8 text-neutral-900 dark:text-white tracking-tighter">
                        <InlineText id="contactCTA" defaultValue="Let's Build Something Legendary." />
                    </h2>

                    <p className="text-xl text-slate-600 dark:text-neutral-400 mb-12 max-w-2xl mx-auto font-medium">
                        <InlineText id="contactSub" defaultValue="Got a vision? I have the sound and the code to bring it to life. Let's talk." />
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-6 mb-20">
                        <EditableButton
                            id="btnEmail"
                            defaultUrl="mailto:contact@elitehybrid.com"
                            defaultLabel="Email Me"
                            icon={Mail}
                            variant="neon"
                        />
                        <EditableButton
                            id="btnContact"
                            defaultUrl="https://wa.me/1234567890"
                            defaultLabel="Contact Me"
                            icon={MessageCircle}
                            variant="ghost"
                        />
                    </div>

                    {/* Socials Manager */}
                    <SocialsManager
                        id="socialLinks"
                        defaultValue={[
                            { name: "Instagram", url: "https://instagram.com" },
                            { name: "Twitter", url: "https://twitter.com" },
                            { name: "LinkedIn", url: "https://linkedin.com" },
                            { name: "GitHub", url: "https://github.com" }
                        ]}
                    />

                </motion.div>
            </div>
        </section>
    );
}
