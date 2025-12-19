"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { createProject, updateProject } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Image as ImageIcon, CheckCircle, X, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { WebProject } from "@/types";

interface ProjectFormProps {
    initialData?: WebProject | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ProjectForm({ initialData, onSuccess, onCancel }: ProjectFormProps) {
    const { user } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [screenshotLoading, setScreenshotLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        isLocked: false,
        techStack: "",
        landingPageDesc: "",
        liveUrl: "",
        githubUrl: "",
        caseStudy: "",
        imageUrl: "",
        impact: "",
        role: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                isLocked: initialData.isLocked || false,
                techStack: initialData.techStack.join(", "),
                landingPageDesc: initialData.description || "",
                liveUrl: initialData.liveUrl || "",
                githubUrl: initialData.githubUrl || "",
                caseStudy: "", // TODO: Add caseStudy field to DB if needed, or map from description if that was intent
                imageUrl: initialData.imageUrl || "",
                impact: "", // Field exists in DB but maybe not in initialData type fully?
                role: initialData.role || "",
            });
            // Note: Some fields like 'impact' and 'caseStudy' might need type adjustment if not present in WebProject
        }
    }, [initialData]);

    if (!user) return null;

    const handleUpload = async (file: File) => {
        try {
            setLoading(true);
            const data = new FormData();
            data.append("file", file);
            data.append("folder", "portfolio/projects");

            const res = await fetch("/api/upload", {
                method: "POST",
                body: data,
            });

            if (!res.ok) throw new Error("Upload failed");

            const json = await res.json();
            setFormData(prev => ({ ...prev, imageUrl: json.url }));
        } catch (err) {
            console.error(err);
            setError("Image upload failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleAutoScreenshot = async () => {
        if (!formData.liveUrl) {
            setError("Please enter a Live URL first.");
            return;
        }

        try {
            setScreenshotLoading(true);
            setError("");

            const res = await fetch("/api/screenshot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: formData.liveUrl }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || "Failed to generate screenshot");
            }

            setFormData(prev => ({ ...prev, imageUrl: json.url }));
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Screenshot generation failed");
        } finally {
            setScreenshotLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.imageUrl) {
            setError("Please upload a project screenshot.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const projectData = {
                title: formData.title,
                isLocked: formData.isLocked,
                techStack: formData.techStack.split(",").map(s => s.trim()).filter(Boolean),
                description: formData.landingPageDesc, // Using this for the card description
                liveUrl: formData.liveUrl,
                githubUrl: formData.githubUrl,
                imageUrl: formData.imageUrl,
                role: formData.role,
                // Note: 'impact' and 'caseStudy' removed from strict types check to avoid errors if unused in display
            };

            if (initialData) {
                await updateProject(initialData.id, projectData);
            } else {
                await createProject(projectData);
            }

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                if (!initialData) {
                    setFormData({
                        title: "",
                        isLocked: false,
                        techStack: "",
                        landingPageDesc: "",
                        liveUrl: "",
                        githubUrl: "",
                        caseStudy: "",
                        imageUrl: "",
                        impact: "",
                        role: "",
                    });
                }
                router.refresh();
                if (onSuccess) onSuccess();
            }, 1000);
        } catch (err) {
            console.error(err);
            setError("Failed to save project.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white/5 border border-white/10 rounded-xl relative">
            {initialData && (
                <div className="absolute top-4 right-4">
                    <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                        <X className="w-4 h-4 mr-2" /> Cancel Edit
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Project Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="md:col-span-2 font-bold"
                />

                <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Short Description (Card)</label>
                    <textarea
                        className="w-full h-20 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-purple"
                        value={formData.landingPageDesc}
                        onChange={(e) => setFormData({ ...formData, landingPageDesc: e.target.value })}
                        placeholder="Brief summary for the portfolio card..."
                        required
                    />
                </div>

                <Input
                    label="Tech Stack (comma separated)"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    required
                    className="md:col-span-2"
                />
                <div className="md:col-span-1 space-y-2">
                    <Input
                        label="Live URL (Optional)"
                        value={formData.liveUrl}
                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                        disabled={screenshotLoading}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleAutoScreenshot}
                        disabled={!formData.liveUrl || screenshotLoading}
                        className="text-neon-purple items-center flex gap-1 w-full border border-neon-purple/30 hover:bg-neon-purple/10"
                    >
                        {screenshotLoading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <Wand2 className="w-3 h-3" />
                        )}
                        {screenshotLoading ? "Capturing Site..." : "Auto-Capture Screenshot"}
                    </Button>
                </div>
                <Input
                    label="GitHub URL (Optional)"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                />
                <Input
                    label="Role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Lead Developer, UI Designer..."
                />

                <div className="md:col-span-2 flex items-center space-x-3 bg-white/5 p-4 rounded-lg border border-white/10">
                    <input
                        type="checkbox"
                        id="isLocked"
                        checked={formData.isLocked}
                        onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })}
                        className="w-5 h-5 accent-neon-purple rounded cursor-pointer"
                    />
                    <div className="flex flex-col">
                        <label htmlFor="isLocked" className="text-sm font-bold text-white cursor-pointer select-none">
                            Work in Progress Lock
                        </label>
                        <span className="text-xs text-gray-400">
                            If enabled, the Live Demo link will show a screenshot popup instead of navigating.
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Screenshot</label>
                <div className="relative group h-48">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg transition-colors ${formData.imageUrl ? 'border-neon-green bg-neon-green/10' : 'border-white/20 group-hover:border-neon-purple'}`}>
                        {loading ? <Loader2 className="animate-spin text-neon-purple" /> : formData.imageUrl ? <CheckCircle className="text-neon-green" /> : <ImageIcon className="text-gray-400" />}
                        <span className="mt-2 text-sm text-gray-400">{formData.imageUrl ? "Screenshot Updated" : "Upload Screenshot"}</span>
                    </div>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" variant={success ? "neon" : "secondary"} className="w-full !border-neon-purple !text-neon-purple" disabled={loading}>
                {loading ? "Processing..." : success ? "SAVED!" : initialData ? "UPDATE PROJECT" : "PUBLISH PROJECT"}
            </Button>
        </form>
    );
}
