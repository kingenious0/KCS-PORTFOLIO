"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { ShieldCheck, LogOut, Menu, X } from "lucide-react";
import { InlineText } from "@/components/admin/InlineText";
import { BrandTitleUpdater } from "@/components/layout/BrandTitleUpdater";
import Image from "next/image";

const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Beats", href: "/beats" },
    { name: "Work", href: "/work" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Triple Tap Logic for Admin Panel
    const tapRef = useRef(0);
    const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const handleSecretTap = (e: React.MouseEvent) => {
        if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
        tapRef.current += 1;
        if (tapRef.current >= 3) {
            router.push("/cmd");
            tapRef.current = 0;
            return;
        }
        tapTimeoutRef.current = setTimeout(() => {
            tapRef.current = 0;
        }, 800);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
            isScrolled 
                ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/10 py-3" 
                : "bg-transparent py-6"
        }`}>
            <BrandTitleUpdater />
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                
                {/* Logo Area */}
                <Link href="/" className="group flex items-center gap-2 md:gap-3" onClick={handleSecretTap}>
                    <div className="relative w-12 h-12 md:w-16 md:h-16 transition-all group-hover:scale-105 shrink-0">
                        <Image
                            src="/logo.png"
                            alt="Kingenious Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="font-black text-base md:text-xl text-slate-900 dark:text-white tracking-tight group-hover:text-orange-500 transition-colors whitespace-nowrap">
                        <InlineText id="brandName" defaultValue="KINGENIOUS" />
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative text-sm font-bold uppercase tracking-widest transition-all hover:text-orange-500",
                                    isActive ? "text-orange-500" : "text-slate-500 dark:text-slate-400"
                                )}
                            >
                                {item.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}

                    {user && (
                        <div className="flex items-center gap-4 pl-8 border-l border-slate-200 dark:border-white/10">
                            <Link href="/cmd" title="Admin Panel">
                                <ShieldCheck className="w-5 h-5 text-orange-500" />
                            </Link>
                            <button onClick={logout} title="Logout" className="text-slate-400 hover:text-red-500 transition-colors">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile/Tablet Controls */}
                <div className="lg:hidden flex items-center gap-2 md:gap-4">
                    {user && (
                        <Link href="/cmd" className="p-2 text-orange-500">
                            <ShieldCheck className="w-5 h-5" />
                        </Link>
                    )}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2.5 bg-slate-100 dark:bg-white/10 rounded-xl text-slate-900 dark:text-white transition-all active:scale-95"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white dark:bg-black border-t border-slate-100 dark:border-white/10 overflow-hidden shadow-2xl"
                    >
                        <div className="flex flex-col p-8 gap-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "text-4xl font-black uppercase tracking-tighter transition-all",
                                        pathname === item.href 
                                            ? "text-orange-500 translate-x-2" 
                                            : "text-slate-400 dark:text-slate-700"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            
                            {user && (
                                <div className="pt-8 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                                    <span className="font-bold text-slate-500">Admin Active</span>
                                    <button onClick={logout} className="flex items-center gap-2 font-bold text-red-500">
                                        <LogOut className="w-5 h-5" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
