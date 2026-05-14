"use client";

import { motion } from "framer-motion";
import { InlineText } from "@/components/admin/InlineText";
import { ToolManager } from "@/components/admin/ToolManager";
import { Code2, Music } from "lucide-react";

export function TechStackSection() {
    return (
        <section className="py-32 px-6 bg-slate-50 dark:bg-black/40 relative">
            <div className="max-w-5xl mx-auto text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4 mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        <InlineText id="stackTitle" defaultValue="Things I Know" />
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        <InlineText id="stackDesc" defaultValue="A collection of tools and technologies I use to bring ideas to life." />
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-4">
                    <ToolManager
                        id="devTools"
                        defaultValue={[
                            { name: "React" }, { name: "Next.js" }, { name: "TypeScript" },
                            { name: "Tailwind CSS" }, { name: "Node.js" }, { name: "Firebase" },
                            { name: "PostgreSQL" }, { name: "Framer Motion" }, { name: "FL Studio" },
                            { name: "Ableton Live" }, { name: "Logic Pro" }, { name: "Sound Design" }
                        ]}
                        colorClass="f97316"
                    />
                </div>
            </div>
        </section>
    );
}
