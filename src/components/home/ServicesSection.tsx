"use client";

import { motion } from "framer-motion";
import { InlineText } from "@/components/admin/InlineText";
import { Mic2, Code2, Globe, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
    {
        icon: Mic2,
        titleId: "service1Title",
        defaultTitle: "Beat Production",
        descId: "service1Desc",
        defaultDesc: "Custom instrumentals tailored to your unique sound signature. Trap, Drill, R&B, and Afrobeat.",
        color: "text-neon-blue"
    },
    {
        icon: Code2,
        titleId: "service2Title",
        defaultTitle: "Web Development",
        descId: "service2Desc",
        defaultDesc: "High-performance websites built with Next.js, React, and Tailwind. Fast, SEO-optimized, and beautiful.",
        color: "text-neon-purple"
    },
    {
        icon: Globe,
        titleId: "service3Title",
        defaultTitle: "Full Stack Apps",
        descId: "service3Desc",
        defaultDesc: "Complex web applications with secure authentication, databases, and real-time features.",
        color: "text-neon-green"
    },
    {
        icon: Sparkles,
        titleId: "service4Title",
        defaultTitle: "Sound Design",
        descId: "service4Desc",
        defaultDesc: "Immersive soundscapes for games, films, and digital experiences. Sonic branding that sticks.",
        color: "text-pink-500"
    }
];

export function ServicesSection() {
    return (
        <section className="py-24 px-4 bg-slate-50 dark:bg-black/30">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold tracking-[0.3em] text-slate-500 dark:text-neutral-500 uppercase mb-4">
                        <InlineText id="servicesLabel" defaultValue="Expertise" />
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white">
                        <InlineText id="servicesHeading" defaultValue="My Creative Arsenal" />
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 transition-all hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] overflow-hidden"
                        >
                            <div className="flex items-start gap-6">
                                <div className={cn("p-4 rounded-2xl bg-black/5 dark:bg-white/10 shrink-0", s.color)}>
                                    <s.icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white group-hover:text-neon-blue transition-colors">
                                        <InlineText id={s.titleId} defaultValue={s.defaultTitle} />
                                    </h4>
                                    <p className="text-slate-600 dark:text-neutral-400 leading-relaxed text-sm">
                                        <InlineText id={s.descId} defaultValue={s.defaultDesc} />
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
