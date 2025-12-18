"use client";

import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkPage() {
    const { projects, loading, error } = useProjects();

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-10 h-10 text-neon-purple animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-20">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-white"
                    >
                        DEV LAB
                    </motion.h1>
                    <p className="text-gray-400 font-mono">
                        Running experiments & shipping products.
                    </p>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
                    <p className="text-gray-500">No projects deployed yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProjectCard project={project} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
