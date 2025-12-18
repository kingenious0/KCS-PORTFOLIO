"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Hand } from "lucide-react";

interface TapTempoProps {
    onBpmDetected: (bpm: number) => void;
}

export function TapTempo({ onBpmDetected }: TapTempoProps) {
    const [taps, setTaps] = useState<number[]>([]);
    const [bpm, setBpm] = useState<number | null>(null);

    const handleTap = useCallback(() => {
        const now = Date.now();
        setTaps((prev) => {
            let newTaps = [...prev];

            // Reset if it's been a while (2 seconds)
            if (newTaps.length > 0 && now - newTaps[newTaps.length - 1] > 2000) {
                newTaps = [];
            }

            newTaps.push(now);

            // Keep only last 4 taps for moving average
            if (newTaps.length > 4) {
                newTaps.shift();
            }

            // Calculate BPM if we have at least 2 taps
            if (newTaps.length >= 2) {
                const intervals = [];
                for (let i = 1; i < newTaps.length; i++) {
                    intervals.push(newTaps[i] - newTaps[i - 1]);
                }
                const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
                const calculatedBpm = Math.round(60000 / avgInterval);
                setBpm(calculatedBpm);
                onBpmDetected(calculatedBpm);
            }

            return newTaps;
        });
    }, [onBpmDetected]);

    return (
        <Button
            type="button"
            variant="ghost" // Changed to ghost to be subtle
            size="sm"
            onClick={handleTap}
            className="flex items-center justify-center px-4 h-10 ml-2 border border-white/10 hover:bg-white/10 active:scale-95 transition-all min-w-[100px]"
            title="Tap standard beat to set BPM"
        >
            <div className="flex items-center gap-2 text-xs text-neon-blue font-bold tracking-widest uppercase">
                <Hand className="w-3 h-3" />
                Tap BPM
            </div>
            {bpm && (
                <span className="text-[10px] text-gray-400 font-mono mt-1">
                    {bpm}
                </span>
            )}
        </Button>
    );
}
