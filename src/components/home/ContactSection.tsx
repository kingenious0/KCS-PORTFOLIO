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
        <section className="py-24 px-4 bg-slate-50 dark:bg-black/50 overflow-hidden relative">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
                
                {/* Left Side: Info */}
                <div className="lg:w-1/2 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                         <h2 className="text-sm font-bold tracking-[0.3em] text-teal-600 dark:text-teal-400 uppercase mb-4">
                            <InlineText id="contactPre" defaultValue="GET IN TOUCH" />
                        </h2>
                        <h3 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mb-8">
                            <InlineText id="contactCTA" defaultValue="Start Your Next Project" />
                        </h3>
                        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium max-w-lg">
                            <InlineText id="contactSub" defaultValue="Have an idea? Let's build something that makes a noise in the industry." />
                        </p>
                    </motion.div>

                    {/* Contact Cards */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-6 p-6 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Email Me</h4>
                                <a href="mailto:kingenious0@gmail.com" className="text-xl font-bold text-slate-900 dark:text-white hover:text-teal-600 transition-colors">
                                    <InlineText id="contactEmail" defaultValue="kingenious0@gmail.com" />
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 p-6 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">WhatsApp</h4>
                                <a href="https://wa.me/233000000000" className="text-xl font-bold text-slate-900 dark:text-white hover:text-teal-600 transition-colors">
                                    <InlineText id="contactPhone" defaultValue="+233 00 000 0000" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Socials */}
                    <div>
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

                {/* Right Side: Big CTA Block (Simulating 'Send Message' form visual weight) */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:w-1/2"
                >
                    <div className="h-full bg-slate-900 dark:bg-teal-950 rounded-[3rem] p-10 md:p-16 flex flex-col justify-between relative overflow-hidden text-white group">
                        {/* Decorative */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="relative z-10">
                            <h3 className="text-3xl md:text-5xl font-black mb-6">Ready to Collaborate?</h3>
                            <p className="text-lg text-slate-300 dark:text-teal-200/80 leading-relaxed mb-12">
                                I am currently available for freelance projects and open to full-time opportunities. Secure your slot on my timeline.
                            </p>
                        </div>

                        <a 
                            href="mailto:kingenious0@gmail.com"
                            className="relative z-10 w-full py-6 bg-white text-slate-900 dark:bg-teal-400 dark:text-teal-950 rounded-2xl font-black text-xl text-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                        >
                            Send Message
                        </a>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
