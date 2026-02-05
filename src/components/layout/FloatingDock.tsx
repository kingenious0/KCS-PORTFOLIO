"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Music, Code, ShieldCheck, User, MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useState, useEffect } from "react";

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Beats", href: "/beats", icon: Music },
    { name: "Work", href: "/work", icon: Code },
    { name: "Contact", href: "/contact", icon: MessageCircle },
];

export function FloatingDock() {
    const pathname = usePathname();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Triple Tap for Admin
    const [taps, setTaps] = useState(0);
    useEffect(() => {
        if (taps === 3) {
            router.push("/cmd");
            setTaps(0);
        }
        const timer = setTimeout(() => setTaps(0), 1000);
        return () => clearTimeout(timer);
    }, [taps, router]);

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                    "flex items-center gap-2 p-2 rounded-2xl border transition-all duration-300",
                    "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-black/5 dark:border-white/10 shadow-2xl",
                    scrolled ? "scale-90 opacity-80 hover:opacity-100 hover:scale-100" : "scale-100"
                )}
            >
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:h-12 rounded-2xl transition-all duration-300 min-w-[60px] sm:min-w-auto",
                                isActive 
                                    ? "bg-black dark:bg-white text-white dark:text-black shadow-lg" 
                                    : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            )}
                        >
                            <Icon className="w-5 h-5 sm:w-4 sm:h-4" />
                            <span className="text-[10px] sm:text-sm font-bold leading-none">
                                {item.name}
                            </span>

                            {isActive && (
                                <motion.span
                                    layoutId="dock-bubble"
                                    className="absolute -top-1 -right-1 w-2 h-2 bg-teal-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}

                <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-1" />

                <ThemeToggle />

                {/* Profile / Admin Trigger */}
                <button
                    onClick={() => setTaps(t => t + 1)}
                    className="flex items-center justify-center w-12 h-12 rounded-xl text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
                >
                    <User className="w-5 h-5" />
                </button>

            </motion.div>
        </div>
    );
}
