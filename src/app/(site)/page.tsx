"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Music, Code } from "lucide-react";
import { InlineText } from "@/components/admin/InlineText";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ContactSection } from "@/components/home/ContactSection";
import { TechStackSection } from "@/components/home/TechStackSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[120px] -z-10 opacity-30 animate-pulse" />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl mb-6 relative z-10"
        >
          <InlineText
            id="heroTitle"
            defaultValue="KINGENIOUS WORKS"
            className="font-black tracking-tighter text-neutral-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-neon-blue dark:via-white dark:to-neon-purple pb-2"
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-800 dark:text-neutral-400 mb-12 max-w-2xl font-medium tracking-tight"
        >
          <InlineText id="heroSubtitle" defaultValue="Where sonic precision meets digital craftsmanship." />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row gap-6 relative z-20"
        >
          <Link href="/beats" className="group relative px-8 py-4 bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-slate-200 dark:border-neon-blue/30 hover:border-black dark:hover:border-neon-blue hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] rounded-xl transition-all overflow-hidden text-neutral-900 dark:text-white">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-3 font-bold text-lg tracking-wide uppercase">
              <Music className="w-5 h-5 text-neon-blue" /> Enter Studio
            </span>
          </Link>

          <Link href="/work" className="group relative px-8 py-4 bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-slate-200 dark:border-neon-purple/30 hover:border-black dark:hover:border-neon-purple hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(188,19,254,0.3)] rounded-xl transition-all overflow-hidden text-neutral-900 dark:text-white">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-3 font-bold text-lg tracking-wide uppercase">
              <Code className="w-5 h-5 text-neon-purple" /> Enter Lab
            </span>
          </Link>
        </motion.div>
      </div>

      {/* New Sections */}
      <AboutSection />
      <ServicesSection />
      <TechStackSection />
      <ContactSection />
    </div>
  );
}
