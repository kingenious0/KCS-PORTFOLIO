"use client";

import { useBeats } from "@/hooks/useBeats";
import { usePlayer } from "@/lib/PlayerContext";
import { BeatCard } from "@/components/beats/BeatCard";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function BeatsPage() {
    const { beats, loading, error } = useBeats();
    const { currentBeat, isPlaying, playBeat, pauseBeat } = usePlayer();

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-10 h-10 text-neon-blue animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-20">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white"
                    >
                        BEAT VAULT
                    </motion.h1>
                    <p className="text-gray-400 font-mono">
                        {beats.length} tracks available // Premium Rights
                    </p>
                </div>
                {/* Filter bar could go here */}
            </div>

            {beats.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
                    <p className="text-gray-500">No beats uploaded yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {beats.map((beat) => (
                        <BeatCard
                            key={beat.id}
                            beat={beat}
                            isPlaying={isPlaying && currentBeat?.id === beat.id}
                            onPlay={() => playBeat(beat)}
                            onPause={pauseBeat}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
