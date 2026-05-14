"use client";

import { motion } from "framer-motion";
import { InlineText } from "@/components/admin/InlineText";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { TechStackSection } from "@/components/home/TechStackSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 md:px-20 max-w-5xl mx-auto w-full pt-32 text-center">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] -z-10" />
        
        <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 md:space-y-6"
            >
              <h1 className="text-4xl md:text-[5rem] font-black text-slate-900 dark:text-white leading-[1.05] tracking-tighter">
                <InlineText id="heroTitle" defaultValue="Engineering Scalable Digital Ecosystems" /> <br />
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 italic mt-2">
                  <InlineText id="heroRole" defaultValue="AI-Powered Fullstack Developer" />
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              <InlineText id="heroSubtitle" defaultValue="I leverage state-of-the-art AI tools to build and scale high-performance web applications with unmatched speed." />
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 md:gap-6 pt-6"
            >
              <Link href="/work" className="px-10 py-5 bg-orange-500 text-white rounded-full font-black text-lg hover:bg-orange-600 hover:scale-105 transition-all shadow-xl shadow-orange-500/20">
                 Explore My Work
              </Link>
              <Link href="/contact" className="px-10 py-5 bg-white dark:bg-white/5 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-white/10 rounded-full font-black text-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
                 Get In Touch
              </Link>
            </motion.div>
        </div>
      </section>

      {/* Structured Sections */}
      <AboutSection />
      <TechStackSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
