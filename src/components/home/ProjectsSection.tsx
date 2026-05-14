"use client";

import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/work/ProjectCard";
import { InlineText } from "@/components/admin/InlineText";
import { motion } from "framer-motion";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function ProjectsSection() {
    const { projects, loading } = useProjects();
    const featuredProjects = projects.slice(0, 3);

    return (
        <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        <InlineText id="projectsTitle" defaultValue="Stuffs I Have Built" />
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        <InlineText id="projectsSub" defaultValue="A selection of my favorite projects, architected with deep engineering and delivered with AI-powered speed." />
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <ProjectCard project={project} />
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <Link href="/work" className="inline-flex items-center gap-2 text-lg font-bold text-orange-500 hover:text-orange-600 transition-all">
                        View All Projects <span className="text-xl">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
