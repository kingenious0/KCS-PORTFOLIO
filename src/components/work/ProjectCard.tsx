"use client";

import { useState } from "react";

import { WebProject } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Github, ExternalLink, Activity, Lock, Construction } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
    project: WebProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const [showLockModal, setShowLockModal] = useState(false);

    return (
        <>
            <Modal isOpen={showLockModal} onClose={() => setShowLockModal(false)} title="Work in Progress">
                <div className="space-y-6">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
                        <Image
                            src={project.imageUrl || "/placeholder-project.jpg"}
                            alt={project.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-xl border border-white/10">
                        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
                            <Construction className="w-6 h-6 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Under Construction</h3>
                        <p className="text-gray-400">
                            The live demo for <span className="text-neon-purple font-bold">{project.title}</span> is currently unavailable as we implement final improvements.
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={() => setShowLockModal(false)} variant="ghost" size="sm">
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>

            <Card className="group flex flex-col h-full overflow-hidden" hoverEffect>
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-900 border border-white/5">
                    <Image
                        src={project.imageUrl || "/placeholder-project.jpg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 p-2 pt-4 flex-1">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-neon-purple transition-colors">{project.title}</h3>
                        {project.role && <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-wide">{project.role}</p>}

                        {/* Tech Stack - Moved here */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {project.techStack.map(tech => (
                                <span key={tech} className="px-2 py-0.5 text-[10px] font-bold bg-white/5 border border-white/10 text-gray-300 rounded uppercase tracking-wider">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Impact Stat */}
                    {project.impact && (
                        <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 p-2 rounded border border-white/5">
                            <Activity className="w-4 h-4 text-neon-green" />
                            <span>{project.impact}</span>
                        </div>
                    )}

                    <p className="text-gray-400 text-sm line-clamp-3">
                        {project.description || "No description available."}
                    </p>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
                        {project.githubUrl && (
                            <Button variant="secondary" size="sm" className="w-full text-xs" onClick={() => {
                                const url = project.githubUrl!.startsWith('http') ? project.githubUrl! : `https://${project.githubUrl}`;
                                window.open(url, '_blank');
                            }}>
                                <Github className="w-3 h-3 mr-1" /> Code
                            </Button>
                        )}
                        {project.liveUrl && (
                            <Button
                                variant="neon"
                                size="sm"
                                className="w-full text-xs !border-neon-purple !text-neon-purple !shadow-[0_0_10px_rgba(188,19,254,0.2)] hover:!bg-neon-purple/10"
                                onClick={() => {
                                    if (project.isLocked) {
                                        setShowLockModal(true);
                                    } else {
                                        const url = project.liveUrl!.startsWith('http') ? project.liveUrl! : `https://${project.liveUrl}`;
                                        window.open(url, '_blank');
                                    }
                                }}
                            >
                                {project.isLocked ? <Lock className="w-3 h-3 mr-1" /> : <ExternalLink className="w-3 h-3 mr-1" />}
                                {project.isLocked ? "Locked" : "Live Demo"}
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </>
    );
}
