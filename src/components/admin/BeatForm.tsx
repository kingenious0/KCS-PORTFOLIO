"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { createBeat } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Music, Image as ImageIcon, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function BeatForm() {
    const { user } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        bpm: "",
        key: "",
        price: "",
        genre: "",
        mood: "",
        audioUrl: "",
        coverUrl: "",
        stemsAvailable: false,
    });

    if (!user) return null;

    const handleUpload = async (file: File, field: "audioUrl" | "coverUrl") => {
        try {
            setLoading(true);
            const data = new FormData();
            data.append("file", file);
            data.append("folder", field === "audioUrl" ? "portfolio/beats" : "portfolio/covers");

            const res = await fetch("/api/upload", {
                method: "POST",
                body: data,
            });

            if (!res.ok) throw new Error("Upload failed");

            const json = await res.json();
            setFormData(prev => ({ ...prev, [field]: json.url }));
        } catch (err) {
            console.error(err);
            setError("File upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.audioUrl || !formData.coverUrl) {
            setError("Please upload both audio and cover image.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await createBeat({
                title: formData.title,
                bpm: Number(formData.bpm),
                key: formData.key,
                price: Number(formData.price),
                genre: formData.genre.split(",").map(s => s.trim()),
                mood: formData.mood.split(",").map(s => s.trim()),
                audioUrl: formData.audioUrl,
                coverUrl: formData.coverUrl,
                stemsAvailable: formData.stemsAvailable,
            });

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFormData({
                    title: "",
                    bpm: "",
                    key: "",
                    price: "",
                    genre: "",
                    mood: "",
                    audioUrl: "",
                    coverUrl: "",
                    stemsAvailable: false,
                });
                router.refresh();
            }, 2000);
        } catch (err) {
            console.error(err);
            setError("Failed to save beat to database.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="BPM"
                        type="number"
                        value={formData.bpm}
                        onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
                        required
                    />
                    <Input
                        label="Key"
                        value={formData.key}
                        onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                        required
                    />
                </div>
                <Input
                    label="Price ($)"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                />
                <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.stemsAvailable}
                            onChange={(e) => setFormData({ ...formData, stemsAvailable: e.target.checked })}
                            className="accent-neon-blue w-4 h-4"
                        />
                        <span className="text-sm text-gray-400">Stems Available?</span>
                    </label>
                </div>
                <Input
                    label="Genre (comma separated)"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="Trap, Lo-Fi, Drill"
                />
                <Input
                    label="Mood (comma separated)"
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                    placeholder="Dark, Hype, Chill"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                {/* Audio Upload */}
                <div className="space-y-2">
                    <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Audio File (MP3/WAV)</label>
                    <div className="relative group">
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "audioUrl")}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`flex items-center justify-center p-4 border-2 border-dashed rounded-lg transition-colors ${formData.audioUrl ? 'border-neon-green bg-neon-green/10' : 'border-white/20 group-hover:border-neon-blue'}`}>
                            {loading ? <Loader2 className="animate-spin text-neon-blue" /> : formData.audioUrl ? <CheckCircle className="text-neon-green" /> : <Music className="text-gray-400" />}
                            <span className="ml-2 text-sm text-gray-400">{formData.audioUrl ? "Audio Uploaded" : "Upload Beat"}</span>
                        </div>
                    </div>
                </div>

                {/* Cover Upload */}
                <div className="space-y-2">
                    <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Cover Art</label>
                    <div className="relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "coverUrl")}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`flex items-center justify-center p-4 border-2 border-dashed rounded-lg transition-colors ${formData.coverUrl ? 'border-neon-green bg-neon-green/10' : 'border-white/20 group-hover:border-neon-blue'}`}>
                            {loading ? <Loader2 className="animate-spin text-neon-blue" /> : formData.coverUrl ? <CheckCircle className="text-neon-green" /> : <ImageIcon className="text-gray-400" />}
                            <span className="ml-2 text-sm text-gray-400">{formData.coverUrl ? "Cover Uploaded" : "Upload Image"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" variant={success ? "neon" : "primary"} className="w-full" disabled={loading}>
                {loading ? "Processing..." : success ? "BEAT ADDED TO VAULT" : "UPLOAD BEAT"}
            </Button>
        </form>
    );
}
