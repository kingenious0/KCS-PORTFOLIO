"use client";

import { useBeats } from "@/hooks/useBeats";
import { usePlayer } from "@/lib/PlayerContext";
import { BeatCard } from "@/components/beats/BeatCard";
import { BeatFilter } from "@/components/beats/BeatFilter";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Pagination } from "@/components/ui/Pagination";
import { useState, useEffect } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";

export default function BeatsPage() {
    const { beats, loading, error } = useBeats();
    const { currentBeat, isPlaying, playBeat, pauseBeat } = usePlayer();
    const windowSize = useWindowSize();
    const [currentPage, setCurrentPage] = useState(1);

    const [filters, setFilters] = useState<{ query: string; genre: string | null; type: string | null }>({
        query: "",
        genre: null,
        type: null
    });

    // Determine items per page based on device width
    const isMobile = (windowSize.width || 1024) < 768;
    const itemsPerPage = isMobile ? 10 : 15;

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, isMobile]);

    // Filter beats logic
    const filteredBeats = beats.filter((beat) => {
        const matchesQuery = !filters.query ||
            beat.title.toLowerCase().includes(filters.query.toLowerCase()) ||
            beat.artist?.toLowerCase().includes(filters.query.toLowerCase()) ||
            beat.mood?.some(m => m.toLowerCase().includes(filters.query.toLowerCase()));

        const matchesGenre = !filters.genre ||
            beat.genre?.some(g => g.toLowerCase().trim() === filters.genre?.toLowerCase().trim()) ||
            // Also check if the genre string contains the filter
            beat.genre?.some(g => g.toLowerCase().includes(filters.genre!.toLowerCase()));

        const matchesType = !filters.type || beat.type === filters.type;

        return matchesQuery && matchesGenre && matchesType;
    });

    const totalPages = Math.ceil(filteredBeats.length / itemsPerPage);
    const paginatedBeats = filteredBeats.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white"
                    >
                        BEAT VAULT
                    </motion.h1>
                    <p className="text-gray-400 font-mono">
                        {filteredBeats.length} tracks available // Premium Rights
                    </p>
                </div>

                <div className="w-full lg:w-auto">
                    <BeatFilter onFilterChange={setFilters} />
                </div>
            </div>

            {filteredBeats.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
                    <p className="text-gray-400 text-lg mb-2">No beats found.</p>
                    <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
                    <button
                        onClick={() => setFilters({ query: "", genre: null, type: null })}
                        className="mt-4 text-neon-blue hover:underline text-sm"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {paginatedBeats.map((beat) => (
                            <BeatCard
                                key={beat.id}
                                beat={beat}
                                isPlaying={isPlaying && currentBeat?.id === beat.id}
                                onPlay={() => playBeat(beat)}
                                onPause={pauseBeat}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
}
