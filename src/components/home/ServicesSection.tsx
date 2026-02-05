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
        <section className="py-24 px-4 relative overflow-hidden bg-slate-50/50 dark:bg-black/20">
             {/* Decorative Blobs */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-6">
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        <span className="text-teal-600 dark:text-teal-400">Professional Services</span> <br />
                        <InlineText id="servicesHeading" defaultValue="For Your Digital Growth" />
                    </h3>
                     <p className="text-lg text-slate-700 dark:text-slate-400 max-w-2xl mx-auto">
                        <InlineText id="servicesSub" defaultValue="Comprehensive solutions designed to elevate your brand's sonic and digital identity." />
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group p-8 pt-12 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden"
                        >
                            <div className="w-20 h-20 rounded-full bg-teal-50 dark:bg-teal-900/20 mb-8 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                                <s.icon className="w-8 h-8" />
                            </div>
                            
                            <h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                                <InlineText id={s.titleId} defaultValue={s.defaultTitle} />
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
                                <InlineText id={s.descId} defaultValue={s.defaultDesc} />
                            </p>

                            {/* Pseudo-Button/Link style */}
                            <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <span className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-2">
                                    Learn More <span className="text-lg">→</span>
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
