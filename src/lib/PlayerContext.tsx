"use client";

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from "react";
import { Beat } from "@/types";

interface PlayerContextType {
    currentBeat: Beat | null;
    isPlaying: boolean;
    playBeat: (beat: Beat) => void;
    pauseBeat: () => void;
    resumeBeat: () => void;
    togglePlay: () => void;
    progress: number;
    duration: number;
    seek: (time: number) => void;
    volume: number;
    setVolume: (vol: number) => void;
    showPurchasePopup: boolean;
    closePurchasePopup: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(0.8);

    // Popup state management inside context so player component can render it
    const [showPurchasePopup, setShowPurchasePopup] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Paid beats preview limit in seconds
    const PREVIEW_LIMIT = 50;

    useEffect(() => {
        if (typeof window !== "undefined") {
            audioRef.current = new Audio();
            audioRef.current.volume = volume;

            const audio = audioRef.current;

            const updateProgress = () => {
                const currentTime = audio.currentTime;
                setProgress(currentTime);
                setDuration(audio.duration || 0);

                // Check for paid beat limit logic
                // We use a ref mechanism via a variable check here since we can't easily access currentBeat state 
                // inside this closure reliably without adding it to dependency array which causes re-attaches.
                // Instead, we'll handle the check in a separate effect or use a mutable ref for currentBeat.
            };

            const handleEnded = () => {
                setIsPlaying(false);
                setProgress(0);
            };

            audio.addEventListener("timeupdate", updateProgress);
            audio.addEventListener("loadedmetadata", updateProgress);
            audio.addEventListener("ended", handleEnded);

            return () => {
                audio.removeEventListener("timeupdate", updateProgress);
                audio.removeEventListener("loadedmetadata", updateProgress);
                audio.removeEventListener("ended", handleEnded);
                audio.pause();
            };
        }
    }, []);

    // Effect to monitor progress and enforce limit for paid beats
    useEffect(() => {
        if (currentBeat && currentBeat.price > 0 && progress >= PREVIEW_LIMIT) {
            pauseBeat();
            audioRef.current!.currentTime = 0; // Reset
            setProgress(0);
            setShowPurchasePopup(true);
        }
    }, [progress, currentBeat]);

    const playBeat = (beat: Beat) => {
        if (!audioRef.current) return;

        if (currentBeat?.id === beat.id) {
            togglePlay();
            return;
        }

        setCurrentBeat(beat);
        audioRef.current.src = beat.audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
        setShowPurchasePopup(false); // Reset popup state on new track
    };

    const resumeBeat = () => {
        audioRef.current?.play();
        setIsPlaying(true);
    };

    const pauseBeat = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (isPlaying) pauseBeat();
        else resumeBeat();
    };

    const seek = (time: number) => {
        // Prevent seeking past limit on paid beats
        if (currentBeat && currentBeat.price > 0 && time > PREVIEW_LIMIT) {
            // Do nothing or snap to limit
            return;
        }

        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setProgress(time);
        }
    };

    const setVolume = (vol: number) => {
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
        setVolumeState(vol);
    };

    const closePurchasePopup = () => setShowPurchasePopup(false);

    return (
        <PlayerContext.Provider
            value={{
                currentBeat,
                isPlaying,
                playBeat,
                pauseBeat,
                resumeBeat,
                togglePlay,
                progress,
                duration,
                seek,
                volume,
                setVolume,
                showPurchasePopup,
                closePurchasePopup
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error("usePlayer must be used within a PlayerProvider");
    }
    return context;
};
