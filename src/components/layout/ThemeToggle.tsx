"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <div className="flex items-center gap-1 border-l border-white/10 pl-2 ml-2">
            <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-full transition-colors ${theme === 'light' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                title="Light Mode"
            >
                <Sun className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-full transition-colors ${theme === 'dark' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                title="Dark Mode"
            >
                <Moon className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-full transition-colors ${theme === 'system' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                title="System"
            >
                <Laptop className="w-4 h-4" />
            </button>
        </div>
    );
}
