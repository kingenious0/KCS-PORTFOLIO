
"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ManualRefresh() {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Force a hard reload from the server, satisfying the user's need for a "real" refresh
        window.location.reload();

        // Timeout is less relevant since page will reload, but keeps state consistent until unload
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    return (
        <button
            onClick={handleRefresh}
            className="fixed bottom-6 right-6 z-50 p-3 bg-black/50 hover:bg-black/80 backdrop-blur border border-white/10 rounded-full text-white/50 hover:text-neon-blue transition-all shadow-lg hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] active:scale-95 group"
            aria-label="Refresh Page"
        >
            <RefreshCw className={cn("w-5 h-5 transition-transform duration-700", isRefreshing && "animate-spin")} />
        </button>
    );
}
