"use client";

import { motion } from "framer-motion";
import { InlineText } from "@/components/admin/InlineText";
import { ToolManager } from "@/components/admin/ToolManager";
import { Code2, Music } from "lucide-react";

export function TechStackSection() {
    return (
        <section className="py-24 px-4 bg-white dark:bg-black relative">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
                
                {/* Left Side: Editorial Content */}
                <div className="lg:w-5/12 space-y-10 lg:sticky lg:top-24">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-block px-4 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-bold tracking-wider mb-6">
                             <InlineText id="stackBadge" defaultValue="MY ARSENAL" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
                            <span className="block">Engineering</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700">Technical Excellence</span>
                        </h2>
                        <div className="text-lg text-slate-700 dark:text-slate-400 leading-relaxed font-medium">
                            <InlineText 
                                id="stackDesc" 
                                defaultValue="I don't just use tools; I master them. From complex full-stack architectures to intricate sound design, my workflow is built on speed, precision, and scalability." 
                            />
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <div className="flex gap-12 pt-8 border-t border-slate-200 dark:border-neutral-800">
                         <div>
                            <h4 className="text-3xl font-black text-slate-900 dark:text-white">100%</h4>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Delivery Rate</p>
                         </div>
                         <div>
                            <h4 className="text-3xl font-black text-slate-900 dark:text-white">50+</h4>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Projects Done</p>
                         </div>
                    </div>
                </div>

                {/* Right Side: Skill Blocks */}
                <div className="lg:w-7/12 w-full space-y-8">
                    {/* Web Dev Block */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 md:p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-teal-900/5 group"
                    >
                        <div className="flex items-start gap-6 mb-8">
                            <div className="p-4 bg-white dark:bg-black rounded-2xl shadow-sm text-teal-600 dark:text-teal-400">
                                <Code2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Full Stack Development</h4>
                                <p className="text-slate-600 dark:text-slate-400">Scalable, secure, and high-performance applications.</p>
                            </div>
                        </div>
                        <ToolManager
                            id="devTools"
                            defaultValue={[
                                { name: "Next.js" }, { name: "React" }, { name: "TypeScript" },
                                { name: "Tailwind" }, { name: "Node.js" }, { name: "PostgreSQL" },
                                { name: "Firebase" }, { name: "Framer Motion" }
                            ]}
                            colorClass="0d9488" // Teal Hex
                        />
                    </motion.div>

                    {/* Music Block */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="p-8 md:p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-teal-900/5 group"
                    >
                        <div className="flex items-start gap-6 mb-8">
                            <div className="p-4 bg-white dark:bg-black rounded-2xl shadow-sm text-purple-600 dark:text-purple-400">
                                <Music className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Audio Engineering & Production</h4>
                                <p className="text-slate-600 dark:text-slate-400">Industry-standard sound architecture and mixing.</p>
                            </div>
                        </div>
                        <ToolManager
                            id="musicTools"
                            defaultValue={[
                                { name: "FL Studio" }, { name: "Ableton Live" }, { name: "Pro Tools" },
                                { name: "Logic Pro" }, { name: "Kontakt" }, { name: "Omnisphere" },
                                { name: "Waves" }
                            ]}
                            colorClass="9333ea" // Purple Hex
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
