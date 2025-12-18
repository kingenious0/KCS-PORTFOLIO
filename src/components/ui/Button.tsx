"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "danger" | "ghost" | "neon";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
}

export function Button({
    className,
    variant = "primary",
    size = "md",
    children,
    ...props
}: ButtonProps) {
    const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-wide uppercase transition-all duration-300 rounded-lg overflow-hidden";

    const variants = {
        primary: "bg-white text-black hover:bg-neutral-200",
        secondary: "bg-neutral-800 text-white hover:bg-neutral-700",
        danger: "bg-red-500 text-white hover:bg-red-600",
        ghost: "bg-transparent text-foreground hover:bg-neutral-500/10",
        neon: "bg-transparent border border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:bg-neon-blue/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {/* Scanline effect for Neon variant */}
            {variant === "neon" && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-scan" />
            )}
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </motion.button>
    );
}
