import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
    className?: string;
    children: ReactNode;
    hoverEffect?: boolean;
}

export function Card({ className, children, hoverEffect = false }: CardProps) {
    return (
        <div
            className={cn(
                "glass rounded-xl p-6 transition-all duration-300",
                hoverEffect && "hover:border-neon-blue/30 hover:shadow-[0_0_30px_rgba(0,243,255,0.1)] dark:hover:bg-black/60 hover:bg-white/40",
                className
            )}
        >
            {children}
        </div>
    );
}
