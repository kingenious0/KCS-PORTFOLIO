
"use client";

import { usePlayer } from "@/lib/PlayerContext";
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from "lucide-react";
import Image from "next/image";
// import { Slider } from "@/components/ui/Slider"; // Need to build this
import { motion, AnimatePresence } from "framer-motion";
import { PurchasePopup } from "./PurchasePopup";

export function GlobalPlayer() {
    const { currentBeat, isPlaying, togglePlay, progress, duration, seek, volume, setVolume, showPurchasePopup, closePurchasePopup } = usePlayer();

    if (!currentBeat) return null;

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <>
            <AnimatePresence>
                <motion.div
                    key="global-player-bar"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/5 px-4 py-3"
                >
                    <div className="container mx-auto flex items-center justify-between gap-4">

                        {/* Track Info */}
                        <div className="flex items-center gap-4 w-1/4">
                            <div className="relative w-12 h-12 rounded bg-neutral-800 overflow-hidden shrink-0">
                                <Image
                                    src={currentBeat.coverUrl || "/placeholder-cover.jpg"}
                                    alt={currentBeat.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-bold text-white truncate text-sm">{currentBeat.title}</h4>
                                <p className="text-xs text-gray-400 truncate">{currentBeat.bpm} BPM • {currentBeat.key}</p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
                            <div className="flex items-center gap-6">
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    <SkipBack className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={togglePlay}
                                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                                >
                                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
                                </button>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    <SkipForward className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="w-full flex items-center gap-3 text-xs font-mono text-gray-400">
                                <span>{formatTime(progress)}</span>
                                <input
                                    type="range"
                                    min={0}
                                    max={duration || 100}
                                    value={progress}
                                    onChange={(e) => seek(Number(e.target.value))}
                                    className="flex-1 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-blue"
                                />
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Volume & Extras */}
                        <div className="flex items-center justify-end gap-3 w-1/4">
                            <Volume2 className="w-4 h-4 text-gray-400" />
                            <div className="w-24">
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={volume}
                                    onChange={(e) => setVolume(Number(e.target.value))}
                                    className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                />
                            </div>
                            <button className="text-gray-400 hover:text-white ml-2">
                                <Maximize2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Purchase Requirement Popup */}
            <PurchasePopup
                isOpen={showPurchasePopup}
                onClose={closePurchasePopup}
                beatTitle={currentBeat.title}
                beatPrice={`${currentBeat.currency || "GH¢"}${currentBeat.price}`}
            />
        </>
    );
}
