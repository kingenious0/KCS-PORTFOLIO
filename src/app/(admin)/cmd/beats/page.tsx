"use client";

import { BeatForm } from "@/components/admin/BeatForm";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Trash2, Play, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBeats } from "@/hooks/useBeats";
import { useState } from "react";
import { Beat } from "@/types";

export default function ManageBeatsPage() {
    const router = useRouter();
    const { beats, loading, deleteBeat } = useBeats();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingBeat, setEditingBeat] = useState<Beat | null>(null);

    const handleDelete = async (beatId: string) => {
        if (confirm("Are you sure you want to delete this beat? This action cannot be undone.")) {
            setDeletingId(beatId);
            try {
                await deleteBeat(beatId);
            } catch (error) {
                console.error("Failed to delete beat:", error);
                alert("Failed to delete beat");
            } finally {
                setDeletingId(null);
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header & Form Section */}
                <div>
                    <div className="flex flex-col items-start sm:flex-row sm:items-center gap-4 mb-8">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/cmd')}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-neon-blue">
                            {editingBeat ? `Edit: ${editingBeat.title}` : "Manage Beats"}
                        </h1>
                    </div>

                    <div className="p-6 border border-white/10 rounded-xl bg-white/5 relative">
                        {editingBeat && (
                            <div className="absolute top-0 right-0 p-2 bg-yellow-500/10 text-yellow-500 text-xs font-bold uppercase tracking-widest rounded-bl-lg">
                                Editing Mode
                            </div>
                        )}
                        <h2 className="text-xl font-bold mb-4">{editingBeat ? "Update Beat Details" : "Upload New Beat"}</h2>
                        <BeatForm
                            initialData={editingBeat}
                            onSuccess={() => setEditingBeat(null)} // Exit edit mode on success
                            onCancel={() => setEditingBeat(null)}
                        />
                    </div>
                </div>

                {/* Existing Beats List */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Existing Vault ({beats.length})</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading audio data...</p>
                    ) : (
                        <div className="grid gap-4">
                            {beats.map((beat) => (
                                <div key={beat.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg transition-colors group gap-4 sm:gap-0 ${editingBeat?.id === beat.id ? 'bg-neon-blue/10 border-neon-blue' : 'bg-neutral-900 border-white/5 hover:border-neon-blue/30'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center shrink-0">
                                            <Play className="w-4 h-4 text-neon-blue" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-white truncate">{beat.title}</h3>
                                            <div className="flex gap-2 text-xs text-gray-400">
                                                <span>{beat.bpm} BPM</span>
                                                <span>•</span>
                                                <span className="capitalize">{beat.type || "Beat"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                        <div className="text-right block">
                                            <div className="text-neon-green font-mono font-bold">${beat.price}</div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingBeat(beat);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>

                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(beat.id)}
                                                disabled={deletingId === beat.id}
                                            >
                                                {deletingId === beat.id ? "..." : <Trash2 className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {beats.length === 0 && (
                                <p className="text-gray-500 italic">No beats in the vault yet.</p>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
