"use client";

import { motion } from "framer-motion";
import { InlineText } from "@/components/admin/InlineText";


export function AboutSection() {
    return (
        <section className="py-24 px-4 relative overflow-hidden">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

                {/* Image Side Removed */}

                {/* Text Side */}
                <div className="w-full max-w-4xl mx-auto space-y-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 relative">
                            <InlineText
                                id="aboutTitle"
                                defaultValue="I Build Digital Legacies."
                                className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple pb-2"
                            />
                        </h2>

                        <div className="text-lg md:text-xl text-slate-700 dark:text-neutral-400 font-medium leading-relaxed mb-8">
                            <InlineText
                                id="aboutBio"
                                defaultValue="I'm a hybrid creative operating at the intersection of sound and code. Blending rhythmic precision with algorithmic complexity to craft experiences that resonate."
                            />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-8 border-t border-neutral-200 dark:border-white/10 pt-8">
                            <div>
                                <h3 className="text-3xl font-black text-neutral-900 dark:text-white mb-2">
                                    <InlineText id="stat1Value" defaultValue="3+" />
                                </h3>
                                <div className="text-sm uppercase tracking-widest text-slate-500 dark:text-neutral-500 font-bold">
                                    <InlineText id="stat1Label" defaultValue="Years Exp." />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-neutral-900 dark:text-white mb-2">
                                    <InlineText id="stat2Value" defaultValue="50+" />
                                </h3>
                                <div className="text-sm uppercase tracking-widest text-slate-500 dark:text-neutral-500 font-bold">
                                    <InlineText id="stat2Label" defaultValue="Projects" />
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
}
