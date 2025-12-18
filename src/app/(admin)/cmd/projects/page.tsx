"use client";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Trash2, Code, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { useState } from "react";
import Image from "next/image";
import { WebProject } from "@/types";

export default function ManageProjectsPage() {
    const router = useRouter();
    const { projects, loading, deleteProject } = useProjects();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingProject, setEditingProject] = useState<WebProject | null>(null);

    const handleDelete = async (projectId: string) => {
        if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            setDeletingId(projectId);
            try {
                await deleteProject(projectId);
            } catch (error) {
                console.error("Failed to delete project:", error);
                alert("Failed to delete project");
            } finally {
                setDeletingId(null);
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header & Upload Section */}
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/cmd')}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <h1 className="text-3xl font-bold text-neon-purple">
                            {editingProject ? `Edit: ${editingProject.title}` : "Manage Projects"}
                        </h1>
                    </div>

                    <div className="p-6 border border-white/10 rounded-xl bg-white/5 relative">
                        {editingProject && (
                            <div className="absolute top-0 right-0 p-2 bg-yellow-500/10 text-yellow-500 text-xs font-bold uppercase tracking-widest rounded-bl-lg">
                                Editing Mode
                            </div>
                        )}
                        <h2 className="text-xl font-bold mb-4">{editingProject ? "Update Project Details" : "Add New Project"}</h2>
                        <ProjectForm
                            initialData={editingProject}
                            onSuccess={() => setEditingProject(null)}
                            onCancel={() => setEditingProject(null)}
                        />
                    </div>
                </div>

                {/* Existing Projects List */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Portfolio Projects ({projects.length})</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading projects...</p>
                    ) : (
                        <div className="grid gap-4">
                            {projects.map((project) => (
                                <div key={project.id} className={`flex items-center justify-between p-4 border rounded-lg transition-colors group ${editingProject?.id === project.id ? 'bg-neon-purple/10 border-neon-purple' : 'bg-neutral-900 border-white/5 hover:border-neon-purple/30'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-10 rounded overflow-hidden bg-neutral-800 shrink-0">
                                            {project.imageUrl ? (
                                                <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <Code className="w-4 h-4 text-neon-purple" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{project.title}</h3>
                                            <p className="text-xs text-gray-400 truncate max-w-[200px]">{project.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-2 invisible sm:visible">
                                            {project.techStack.slice(0, 3).map((tech, i) => (
                                                <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5">{tech}</span>
                                            ))}
                                            {project.techStack.length > 3 && <span className="text-[10px] px-2 py-1">+{project.techStack.length - 3}</span>}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingProject(project);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>

                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(project.id)}
                                                disabled={deletingId === project.id}
                                            >
                                                {deletingId === project.id ? "..." : <Trash2 className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && (
                                <p className="text-gray-500 italic">No projects in the portfolio yet.</p>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
