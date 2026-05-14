"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, Code2, Zap, Layout, Database } from "lucide-react";

const workflow = [
    {
        title: "Modern IDEs",
        icon: Terminal,
        items: ["Cursor", "Windsurf", "Google Antigravity"],
        desc: "My primary environments for AI-assisted coding and rapid prototyping."
    },
    {
        title: "AI Automation",
        icon: Cpu,
        items: ["Vercel AI SDK", "GitHub Copilot"],
        desc: "Automating repetitive tasks and scaling logic with agentic workflows."
    },
    {
        title: "Core Stack",
        icon: Layout,
        items: ["React (Next.js)", "Supabase", "Tailwind CSS"],
        desc: "The rock-solid foundation I use to build performant, fullstack products."
    }
];

export function WorkflowSection() {
    return (
        <section className="px-6 md:px-12 py-20">
            <div className="max-w-6xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-orange-500 mb-4">The Stack</h2>
                    <h3 className="text-4xl md:text-6xl font-black tracking-tighter">
                        Augmented <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Workflow</span>
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-2xl font-medium">
                        I don't just write code; I orchestrate it. By combining traditional engineering with state-of-the-art AI tools, I deliver results that are faster, cleaner, and more scalable.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {workflow.map((group, i) => (
                        <motion.div
                            key={group.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group hover:border-orange-500/30 transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <group.icon className="w-7 h-7 text-orange-500" />
                            </div>
                            <h4 className="text-2xl font-black mb-3">{group.title}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                                {group.desc}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {group.items.map(item => (
                                    <span 
                                        key={item} 
                                        className="px-4 py-1.5 rounded-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 shadow-sm"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
