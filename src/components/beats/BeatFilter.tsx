
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface BeatFilterProps {
    onFilterChange: (filters: { query: string; genre: string | null; type: string | null }) => void;
    className?: string;
}

const PRESET_GENRES = [
    "Drill",
    "Afrobeat",
    "Rap",
    "Amapiano",
    "Trap",
    "Hip Hop",
    "R&B",
    "Dancehall"
];

const CONTENT_TYPES = [
    { label: "All", value: null },
    { label: "Beats", value: "Beat" },
    { label: "Remixes", value: "Remix" },
    { label: "Songs", value: "Full Song" },
    { label: "Other", value: "Other" }
];

export function BeatFilter({ onFilterChange, className }: BeatFilterProps) {
    const [query, setQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);

    // Debounce search query to avoid excessive filtering on every keystroke
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange({ query, genre: selectedGenre, type: selectedType });
        }, 300);

        return () => clearTimeout(timer);
    }, [query, selectedGenre, selectedType, onFilterChange]);

    const handleGenreClick = (genre: string) => {
        if (selectedGenre === genre) {
            setSelectedGenre(null); // Toggle off
        } else {
            setSelectedGenre(genre);
        }
    };

    const clearFilters = () => {
        setQuery("");
        setSelectedGenre(null);
        setSelectedType(null);
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Type Tabs */}
            <div className="flex p-1 bg-white/5 border border-white/10 rounded-lg w-max">
                {CONTENT_TYPES.map((type) => (
                    <button
                        key={type.label}
                        onClick={() => setSelectedType(type.value)}
                        className={`
                            px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                            ${selectedType === type.value
                                ? "bg-neon-blue text-black shadow-lg shadow-neon-blue/20"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }
                        `}
                    >
                        {type.label}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative max-w-md mx-auto md:mx-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search beats by title, artist, or mood..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue transition-colors text-sm font-mono placeholder:text-gray-500"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* Genre Chips */}
            <div className="flex flex-wrap gap-2">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest py-2 mr-2">Filter By Genre:</span>
                {PRESET_GENRES.map((genre) => (
                    <button
                        key={genre}
                        onClick={() => handleGenreClick(genre)}
                        className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
                ${selectedGenre === genre
                                ? "bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.2)]"
                                : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                            }
            `}
                    >
                        {genre}
                    </button>
                ))}

                {(selectedGenre || query || selectedType) && (
                    <button
                        onClick={clearFilters}
                        className="px-3 py-1.5 rounded-full text-xs font-medium text-red-400 hover:text-red-300 transition-colors ml-auto"
                    >
                        Clear All
                    </button>
                )}
            </div>
        </div>
    );
}
