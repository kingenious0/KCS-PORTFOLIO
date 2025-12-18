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
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(0.8);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            audioRef.current = new Audio();
            audioRef.current.volume = volume;

            const audio = audioRef.current;

            const updateProgress = () => {
                setProgress(audio.currentTime);
                setDuration(audio.duration || 0);
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
                setVolume
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
