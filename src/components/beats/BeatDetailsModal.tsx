"use client";

import { Beat } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Play, Pause, Download, ShoppingCart, Music, User, Clock, key } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BeatDetailsModalProps {
    beat: Beat | null;
    isOpen: boolean;
    onClose: () => void;
    isPlaying: boolean;
    onPlayPause: () => void;
}

export function BeatDetailsModal({ beat, isOpen, onClose, isPlaying, onPlayPause }: BeatDetailsModalProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    if (!beat) return null;

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const response = await fetch(beat.audioUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${beat.title}.mp3`;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
            window.open(beat.audioUrl, '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={beat.title}
        >
            <div className="space-y-6">
                {/* Header Section with Art and Basic Info */}
                <div className="flex flex-col sm:flex-row gap-6">
                    {/* Cover Art */}
                    <div className="relative w-full sm:w-40 aspect-square rounded-xl overflow-hidden bg-neutral-800 shrink-0 group shadow-lg shadow-neon-blue/10">
                        <Image
                            src={beat.coverUrl || "/placeholder-cover.jpg"}
                            alt={beat.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={onPlayPause}
                                className="w-12 h-12 bg-neon-blue rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,243,255,0.6)]"
                            >
                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
                            </button>
                        </div>
                    </div>

                    {/* Meta Data List */}
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-mono text-gray-400">PRICE</span>
                            <span className={cn("text-xl font-bold font-mono", beat.price === 0 ? "text-neon-green" : "text-neon-blue")}>
                                {beat.price === 0 ? "FREE" : `$${beat.price}`}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm border-t border-white/10 pt-3">
                            <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase font-mono block">Artist</span>
                                <div className="flex items-center gap-2 text-white">
                                    <User className="w-3 h-3 text-neon-purple" />
                                    <span className="font-medium truncate">{beat.artist || "Unknown Artist"}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase font-mono block">Produced By</span>
                                <div className="flex items-center gap-2 text-white">
                                    <Music className="w-3 h-3 text-neon-blue" />
                                    <span className="font-medium truncate">{beat.producedBy || "Kingenious"}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase font-mono block">BPM</span>
                                <div className="flex items-center gap-2 text-white">
                                    <Clock className="w-3 h-3 text-neon-green" />
                                    <span className="font-medium">{beat.bpm}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase font-mono block">Key</span>
                                <div className="flex items-center gap-2 text-white">
                                    {/* Using generic icon for Key as Lucide might not have 'Key' music symbol specifically, using text or simple icon */}
                                    <span className="font-mono font-bold text-neon-pink text-xs bg-white/10 px-1.5 py-0.5 rounded">#</span>
                                    <span className="font-medium">{beat.key || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Extended Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    <div>
                        <span className="text-xs text-gray-500 uppercase font-mono block mb-2">Genre</span>
                        <div className="flex flex-wrap gap-2">
                            {beat.genre.map(g => (
                                <span key={g} className="px-2 py-1 bg-white/5 rounded-md text-xs text-gray-300 border border-white/5">{g}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 uppercase font-mono block mb-2">Mood</span>
                        <div className="flex flex-wrap gap-2">
                            {beat.mood.map(m => (
                                <span key={m} className="px-2 py-1 bg-white/5 rounded-md text-xs text-gray-300 border border-white/5">{m}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stems Info */}
                <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between border border-white/5">
                    <span className="text-sm text-gray-400">Stems Included?</span>
                    <span className={cn("text-xs font-bold px-2 py-1 rounded", beat.stemsAvailable ? "bg-neon-green/20 text-neon-green" : "bg-red-500/20 text-red-400")}>
                        {beat.stemsAvailable ? "YES" : "NO"}
                    </span>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                    {beat.price === 0 ? (
                        <Button
                            variant="neon"
                            className="w-full !bg-neon-green !border-neon-green text-black hover:!bg-neon-green/90 font-bold"
                            onClick={handleDownload}
                            disabled={isDownloading}
                        >
                            {isDownloading ? "Preparing Download..." : <><Download className="w-4 h-4 mr-2" /> FREE DOWNLOAD</>}
                        </Button>
                    ) : (
                        <Button variant="neon" className="w-full font-bold">
                            <ShoppingCart className="w-4 h-4 mr-2" /> PURCHASE LICENSE (${beat.price})
                        </Button>
                    )}
                    <p className="text-[10px] text-gray-500 text-center mt-2">
                        {beat.type || "Beat"} License • Instant Delivery via Email
                    </p>
                </div>
            </div>
        </Modal>
    );
}
