"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { ShieldCheck, LogOut, User } from "lucide-react";
import { InlineText } from "@/components/admin/InlineText";
import { BrandTitleUpdater } from "@/components/layout/BrandTitleUpdater";
import { BrandInitials } from "@/components/layout/BrandInitials";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Beats", href: "/beats" },
    { name: "Work", href: "/work" },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, login, logout } = useAuth();

    // Secret Access Logic
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                router.push('/cmd');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    // Triple Tap Logic
    const tapRef = useRef(0);
    const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSecretTap = (e: React.MouseEvent) => {
        // Clear existing reset timer
        if (tapTimeoutRef.current) {
            clearTimeout(tapTimeoutRef.current);
        }

        tapRef.current += 1;

        if (tapRef.current === 3) {
            e.preventDefault();
            e.stopPropagation();
            router.push('/cmd');
            tapRef.current = 0; // Reset
            return;
        }

        // Set timer to reset count if no more taps happen quickly
        tapTimeoutRef.current = setTimeout(() => {
            tapRef.current = 0;
        }, 800);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none">
            <BrandTitleUpdater />
            <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">

                {/* Logo Area */}
                <Link href="/" className="group flex items-center gap-2" onClick={handleSecretTap}>
                    <div className="relative w-10 h-10 bg-gradient-to-tr from-neon-blue to-neon-purple rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,243,255,0.3)] group-hover:shadow-[0_0_30px_rgba(188,19,254,0.5)] transition-shadow">
                        <BrandInitials className="text-xl tracking-tighter" />
                    </div>
                    <span className="font-bold text-lg text-slate-900 dark:text-white hidden md:block tracking-wide group-hover:text-neon-blue dark:group-hover:text-neon-blue transition-colors">
                        <InlineText id="brandName" defaultValue="KINGENIOUS WORKS" />
                    </span>
                </Link>

                {/* Center Nav - Floating Pill */}
                <div className="glass px-2 py-2 rounded-full flex items-center gap-1 dark:text-gray-400">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative px-5 py-2 text-sm font-medium transition-colors hover:text-slate-900 dark:hover:text-white",
                                    isActive ? "text-slate-900 dark:text-neon-blue" : "text-slate-600 dark:text-gray-400"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-slate-200 dark:bg-white/10 rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className={cn("relative z-10")}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right Actions - STEALTH MODE */}
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="flex items-center gap-3">
                            <Link href="/cmd" className="hidden md:flex items-center gap-2 text-sm font-medium text-neon-green hover:underline">
                                <ShieldCheck className="w-4 h-4" /> Admin
                            </Link>
                            <button onClick={logout} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Logout">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
}
