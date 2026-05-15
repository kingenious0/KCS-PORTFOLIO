"use client";

import Link from "next/link";
import { InlineText } from "@/components/admin/InlineText";
import Image from "next/image";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-12 pb-32 border-t border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black mt-auto">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="flex items-center gap-2">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <Image
                            src="/K.C.S LOGO HEAD.png"
                            alt="Kingenious Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-bold text-md text-white/50 tracking-wide">
                        <InlineText id="brandName" defaultValue="KINGENIOUS" />
                    </span>
                </div>

                {/* Copyright */}
                <div className="text-sm text-gray-500 font-medium">
                    &copy; {currentYear} <InlineText id="brandName" defaultValue="KINGENIOUS" />. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
