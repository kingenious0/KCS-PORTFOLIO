"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { createBeat, updateBeat } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Music, Image as ImageIcon, CheckCircle, X, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Beat } from "@/types";
import { parseBlob } from "music-metadata-browser";

import * as beatDetector from 'web-audio-beat-detector';

interface BeatFormProps {
    initialData?: Beat | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function BeatForm({ initialData, onSuccess, onCancel }: BeatFormProps) {
    const { user } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Keep reference to the actual file for analysis
    const [audioFile, setAudioFile] = useState<File | null>(null);

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
        producedBy: "Kingenious",
        artist: "",
        type: "Beat"
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                bpm: initialData.bpm.toString(),
                key: initialData.key,
                price: initialData.price.toString(),
                genre: initialData.genre.join(", "),
                mood: initialData.mood.join(", "),
                audioUrl: initialData.audioUrl,
                coverUrl: initialData.coverUrl,
                stemsAvailable: initialData.stemsAvailable,
                producedBy: initialData.producedBy || "Kingenious",
                artist: initialData.artist || "",
                type: initialData.type || "Beat"
            });
        }
    }, [initialData]);

    if (!user) {
        return (
            <div className="text-center p-6 text-red-400 border border-red-500/20 bg-red-500/10 rounded-lg">
                Please log in to manage beats.
            </div>
        );
    }

    const handleAnalyzeAudio = async () => {
        if (!audioFile) {
            setError("No audio file selected to analyze.");
            return;
        }

        try {
            setAnalyzing(true);
            setError("");

            // 1. Read file as ArrayBuffer
            const arrayBuffer = await audioFile.arrayBuffer();

            // 2. Decode Audio Data
            const offlineContext = new OfflineAudioContext(2, 44100 * 40, 44100); // Create offline context usually safer
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // 3. Detect BPM
            const detectedBpm = await beatDetector.analyze(audioBuffer);

            if (detectedBpm) {
                setFormData(prev => ({ ...prev, bpm: Math.round(detectedBpm).toString() }));
            } else {
                setError("Could not detect BPM automatically.");
            }

        } catch (err) {
            console.error("Analysis failed:", err);
            setError("BPM Analysis failed. Try 'Tap BPM' instead.");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleUpload = async (file: File, field: "audioUrl" | "coverUrl") => {
        try {
            setLoading(true);

            if (field === "audioUrl") {
                setAudioFile(file); // Save for analysis
                try {
                    const metadata = await parseBlob(file);

                    // Fallback to filename regex if metadata missing
                    const filenameBase = file.name.replace(/\.[^/.]+$/, "");

                    // Regex Patterns
                    const bpmRegex = /(\d{2,3})\s*(?:bpm|BPM)/;
                    const keyRegex = /(?:Key|key)[_\s:-]*([A-G][#b]?\s?(?:m|min|maj|major|minor)?)/i;

                    const detectedBpm = metadata.common.bpm
                        ? Math.round(metadata.common.bpm).toString()
                        : filenameBase.match(bpmRegex)?.[1] || "";

                    const detectedKey = metadata.common.key
                        || filenameBase.match(keyRegex)?.[1]
                        || "";

                    setFormData(prev => ({
                        ...prev,
                        title: prev.title || metadata.common.title || filenameBase,
                        bpm: detectedBpm || prev.bpm,
                        key: detectedKey || prev.key,
                        genre: metadata.common.genre ? metadata.common.genre.join(", ") : prev.genre,
                        artist: metadata.common.artist || prev.artist,
                    }));
                } catch (e) {
                    console.warn("Metadata parsing failed", e);
                }
            }

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

        if (!formData.audioUrl) {
            setError("Audio file is required.");
            return;
        }

        const finalCoverUrl = formData.coverUrl || "/KCS LION HEAD.png";

        setLoading(true);
        setError("");

        try {
            const beatData = {
                title: formData.title,
                bpm: Number(formData.bpm),
                key: formData.key,
                price: Number(formData.price),
                genre: formData.genre.split(",").map(s => s.trim()).filter(Boolean),
                mood: formData.mood.split(",").map(s => s.trim()).filter(Boolean),
                audioUrl: formData.audioUrl,
                coverUrl: finalCoverUrl,
                stemsAvailable: formData.stemsAvailable,
                producedBy: formData.producedBy,
                artist: formData.artist,
                type: formData.type as any,
            };

            if (initialData) {
                await updateBeat(initialData.id, beatData);
            } else {
                await createBeat(beatData);
            }

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                if (!initialData) {
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
                        producedBy: "Kingenious",
                        artist: "",
                        type: "Beat"
                    });
                    setAudioFile(null);
                }
                router.refresh();
                if (onSuccess) onSuccess();
            }, 1000);
        } catch (err) {
            console.error(err);
            setError("Database operation failed.");
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
                <div className="col-span-1 md:col-span-2">
                    <Input
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="text-lg font-bold"
                    />
                </div>

                <Input
                    label="Artist (Optional)"
                    value={formData.artist}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    placeholder="e.g. Drake type"
                />

                <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Type</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-neon-blue outline-none"
                    >
                        <option value="Beat">Beat</option>
                        <option value="Remix">Remix</option>
                        <option value="Full Song">Full Song</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* BPM & Key Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">BPM</label>
                        <Input
                            value={formData.bpm}
                            onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
                            required
                            type="number"
                            className="!mt-0 w-full"
                        />
                    </div>

                    <Input
                        label="Key (Optional)"
                        value={formData.key}
                        onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    />
                </div>

                <Input
                    label="Price GH¢"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                />

                <Input
                    label="Produced By"
                    value={formData.producedBy}
                    onChange={(e) => setFormData({ ...formData, producedBy: e.target.value })}
                    required
                />

                <div className="flex items-end pb-3">
                    <label className="flex items-center gap-2 cursor-pointer p-2 bg-white/5 rounded w-full border border-white/5 hover:border-neon-blue transition-colors">
                        <input
                            type="checkbox"
                            checked={formData.stemsAvailable}
                            onChange={(e) => setFormData({ ...formData, stemsAvailable: e.target.checked })}
                            className="accent-neon-blue w-4 h-4"
                        />
                        <span className="text-sm text-gray-300">Stems Included?</span>
                    </label>
                </div>

                <Input
                    label="Genre"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="Trap, Lo-Fi"
                />
                <Input
                    label="Mood"
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                    placeholder="Dark, Hype"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                {/* Audio Upload */}
                <div className="space-y-2">
                    <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Audio File</label>
                    <div className="relative group">
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "audioUrl")}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`flex items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${formData.audioUrl ? 'border-neon-green bg-neon-green/10' : 'border-white/20 group-hover:border-neon-blue'}`}>
                            {loading ? <Loader2 className="animate-spin text-neon-blue" /> : formData.audioUrl ? <CheckCircle className="text-neon-green" /> : <Music className="text-gray-400" />}
                            <span className="ml-2 text-sm text-gray-400 truncate max-w-[200px]">{formData.audioUrl ? "Audio Ready" : "Select Audio File"}</span>
                        </div>
                    </div>
                    {/* Analyze Button - Only show if audio file is present */}
                    {audioFile && (
                        <div className="flex justify-center">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleAnalyzeAudio}
                                disabled={analyzing}
                                className="w-full text-xs"
                            >
                                {analyzing ? (
                                    <><Loader2 className="w-3 h-3 animate-spin mr-2" /> Analyzing...</>
                                ) : (
                                    <><Sparkles className="w-3 h-3 mr-2 text-neon-purple" /> Analyze BPM (AI)</>
                                )}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Cover Upload */}
                <div className="space-y-2">
                    <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Cover Art (Optional)</label>
                    <div className="relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "coverUrl")}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`flex items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${formData.coverUrl ? 'border-neon-green bg-neon-green/10' : 'border-white/20 group-hover:border-neon-blue'}`}>
                            {loading ? <Loader2 className="animate-spin text-neon-blue" /> : formData.coverUrl ? <CheckCircle className="text-neon-green" /> : <ImageIcon className="text-gray-400" />}
                            <span className="ml-2 text-sm text-gray-400">{formData.coverUrl ? "Cover Ready" : "Default: Lion"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" variant={success ? "neon" : "primary"} className="w-full" disabled={loading}>
                {loading ? "Processing..." : success ? "SAVED SUCCESSFULLY" : initialData ? "UPDATE BEAT" : "UPLOAD BEAT"}
            </Button>
        </form>
    );
}
