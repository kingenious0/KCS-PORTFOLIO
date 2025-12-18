"use client";

import Link from "next/link";
import { InlineText } from "@/components/admin/InlineText";
import { BrandInitials } from "@/components/layout/BrandInitials";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-12 border-t border-white/5 bg-black/40 mt-auto">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Brand Area */}
                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 bg-gradient-to-tr from-neon-blue to-neon-purple rounded-lg overflow-hidden opacity-80 flex items-center justify-center">
                        <BrandInitials className="text-sm" />
                    </div>
                    <span className="font-bold text-md text-white/50 tracking-wide">
                        <InlineText id="brandName" defaultValue="ELITE HYBRID" />
                    </span>
                </div>

                {/* Copyright */}
                <div className="text-sm text-gray-500 font-medium">
                    &copy; {currentYear} <InlineText id="brandName" defaultValue="ELITE HYBRID" />. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
