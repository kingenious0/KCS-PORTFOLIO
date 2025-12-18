"use client";

import { motion } from "framer-motion";
import { InlineText } from "@/components/admin/InlineText";
import { ToolManager } from "@/components/admin/ToolManager";
import { Code2, Music } from "lucide-react";

export function TechStackSection() {
    return (
        <section className="py-20 px-4 border-t border-white/5 bg-black/40">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold tracking-[0.3em] text-neon-blue uppercase mb-4">
                        <InlineText id="stackLabel" defaultValue="My Arsenal" />
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-black text-white">
                        <InlineText id="stackHeading" defaultValue="Tools of the Trade" />
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Web Dev Stack */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl bg-neutral-900/50 border border-white/10 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <Code2 className="w-8 h-8 text-neon-purple" />
                            <h4 className="text-2xl font-bold text-white">Development</h4>
                        </div>

                        <ToolManager
                            id="devTools"
                            defaultValue={[
                                { name: "Next.js" }, { name: "React" }, { name: "TypeScript" },
                                { name: "Tailwind CSS" }, { name: "Node.js" }, { name: "Firebase" }
                            ]}
                            colorClass="bc13fe" // Neon Purple Hex
                        />
                    </motion.div>

                    {/* Music Production Stack */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl bg-neutral-900/50 border border-white/10 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <Music className="w-8 h-8 text-neon-blue" />
                            <h4 className="text-2xl font-bold text-white">Production</h4>
                        </div>

                        <ToolManager
                            id="musicTools"
                            defaultValue={[
                                { name: "FL Studio" }, { name: "Ableton Live" }, { name: "Logic Pro" },
                                { name: "Kontakt" }, { name: "Omnisphere" }
                            ]}
                            colorClass="00f3ff" // Neon Blue Hex
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
