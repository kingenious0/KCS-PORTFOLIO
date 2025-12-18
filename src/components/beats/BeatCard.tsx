"use client";

import { Beat } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Play, Pause, ShoppingCart, Info, Download } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BeatCardProps {
    beat: Beat;
    isPlaying: boolean;
    onPlay: () => void;
    onPause: () => void;
}

import { BeatDetailsModal } from "./BeatDetailsModal";

export function BeatCard({ beat, isPlaying, onPlay, onPause }: BeatCardProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

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
            // Fallback
            window.open(beat.audioUrl, '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Card className="group relative overflow-hidden flex flex-col gap-4" hoverEffect>
            {/* Cover Image with Overlay */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-900">
                <Image
                    src={beat.coverUrl || "/placeholder-cover.jpg"}
                    alt={beat.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 backdrop-blur-[2px]">
                    <button
                        onClick={isPlaying ? onPause : onPlay}
                        className="w-16 h-16 rounded-full bg-neon-blue text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.5)] hover:scale-110 transition-transform"
                    >
                        {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 ml-1 fill-current" />}
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg leading-tight truncate pr-2">{beat.title}</h3>
                    <span className={cn("font-mono font-bold", beat.price === 0 ? "text-neon-green" : "text-neon-blue")}>
                        {beat.price === 0 ? "FREE" : `$${beat.price}`}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                    <span>{beat.bpm} BPM</span>
                    <span>{beat.key}</span>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-auto">
                {beat.mood.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[10px] text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mt-2">
                <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setShowDetails(true)}>
                    <Info className="w-3 h-3 mr-1" /> Details
                </Button>
                {beat.price === 0 ? (
                    <Button
                        variant="neon"
                        size="sm"
                        className="w-full text-xs !bg-neon-green !border-neon-green text-black hover:!bg-neon-green/90"
                        onClick={handleDownload}
                        disabled={isDownloading}
                    >
                        {isDownloading ? (
                            <>Wait...</>
                        ) : (
                            <><Download className="w-3 h-3 mr-1" /> Download</>
                        )}
                    </Button>
                ) : (
                    <Button variant="neon" size="sm" className="w-full text-xs">
                        <ShoppingCart className="w-3 h-3 mr-1" /> Buy
                    </Button>
                )}
            </div>


            {/* Details Modal */}
            <BeatDetailsModal
                beat={beat}
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                isPlaying={isPlaying}
                onPlayPause={isPlaying ? onPause : onPlay}
            />
        </Card >
    );
}
