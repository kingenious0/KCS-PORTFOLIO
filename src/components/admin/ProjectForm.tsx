"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { createProject } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Image as ImageIcon, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProjectForm() {
    const { user } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        techStack: "",
        liveUrl: "",
        githubUrl: "",
        caseStudy: "",
        screenshotUrl: "",
        impact: "",
        role: "",
    });

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
            setFormData(prev => ({ ...prev, screenshotUrl: json.url }));
        } catch (err) {
            console.error(err);
            setError("Image upload failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.screenshotUrl) {
            setError("Please upload a project screenshot.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await createProject({
                title: formData.title,
                techStack: formData.techStack.split(",").map(s => s.trim()),
                liveUrl: formData.liveUrl,
                githubUrl: formData.githubUrl,
                caseStudy: formData.caseStudy,
                screenshotUrl: formData.screenshotUrl,
                impact: formData.impact,
                role: formData.role,
            });

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFormData({
                    title: "",
                    techStack: "",
                    liveUrl: "",
                    githubUrl: "",
                    caseStudy: "",
                    screenshotUrl: "",
                    impact: "",
                    role: "",
                });
                router.refresh();
            }, 2000);
        } catch (err) {
            console.error(err);
            setError("Failed to save project.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Project Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="md:col-span-2"
                />
                <Input
                    label="Tech Stack (comma separated)"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    required
                    className="md:col-span-2"
                />
                <Input
                    label="Live URL (Optional)"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                />
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
                <Input
                    label="Impact Metric"
                    value={formData.impact}
                    onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                    placeholder="e.g. 50% faster, 10k users"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Case Study / Description</label>
                <textarea
                    className="w-full h-32 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-purple"
                    value={formData.caseStudy}
                    onChange={(e) => setFormData({ ...formData, caseStudy: e.target.value })}
                />
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Screenshot</label>
                <div className="relative group h-32">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg transition-colors ${formData.screenshotUrl ? 'border-neon-green bg-neon-green/10' : 'border-white/20 group-hover:border-neon-purple'}`}>
                        {loading ? <Loader2 className="animate-spin text-neon-purple" /> : formData.screenshotUrl ? <CheckCircle className="text-neon-green" /> : <ImageIcon className="text-gray-400" />}
                        <span className="mt-2 text-sm text-gray-400">{formData.screenshotUrl ? "Screenshot Uploaded" : "Upload Screenshot"}</span>
                    </div>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" variant={success ? "neon" : "secondary"} className="w-full !border-neon-purple !text-neon-purple" disabled={loading}>
                {loading ? "Processing..." : success ? "PROJECT LAUNCHED" : "PUBLISH PROJECT"}
            </Button>
        </form>
    );
}
