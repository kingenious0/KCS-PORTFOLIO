"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Music, Code } from "lucide-react";
import { InlineText } from "@/components/admin/InlineText";
import { EditableImage } from "@/components/admin/EditableImage";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ContactSection } from "@/components/home/ContactSection";
import { TechStackSection } from "@/components/home/TechStackSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between min-h-[90vh] px-6 md:px-20 relative overflow-hidden pt-12 max-w-7xl mx-auto">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-200/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 -z-10" />

        {/* Left Side: Content */}
        <div className="w-full md:w-1/2 z-10 text-center md:text-left space-y-8">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400 font-display"
            >
                <InlineText id="heroGreeting" defaultValue="Hey! I am" />
            </motion.h2>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tight"
            >
              <InlineText id="heroTitle" defaultValue="KINGENIOUS" />
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700">
                <InlineText id="heroRole" defaultValue="Works." />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-700 dark:text-slate-400 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed"
            >
              <InlineText id="heroSubtitle" defaultValue="Sonic Architect & Digital Craftsman. I build high-performance web experiences and craft immersive soundscapes." />
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start w-full sm:w-auto"
            >
              <Link href="/beats" className="w-full sm:w-auto px-8 py-4 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2">
                 <Music className="w-5 h-5" /> Enter Studio
              </Link>
              <Link href="/work" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full font-bold hover:opacity-90 hover:shadow-xl transition-all flex items-center justify-center gap-2">
                 <Code className="w-5 h-5" /> View Projects
              </Link>
            </motion.div>
        </div>

        {/* Right Side: Image with Ripple Effect */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-full md:w-1/2 relative flex justify-center md:justify-end mt-12 md:mt-0"
        >
            <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[450px] md:h-[450px]">
                {/* Ripples */}
                <div className="absolute inset-0 border border-teal-500/20 rounded-full scale-[1.2]" />
                <div className="absolute inset-0 border border-teal-500/10 rounded-full scale-[1.5]" />
                <div className="absolute inset-0 border border-teal-500/5 rounded-full scale-[1.8]" />
                <div className="absolute top-0 right-0 p-3 md:p-4 bg-white dark:bg-slate-800 rounded-full shadow-xl z-20 animate-bounce">
                    <Code className="w-6 h-6 md:w-8 md:h-8 text-teal-600" />
                </div>
                 <div className="absolute bottom-10 left-0 p-3 md:p-4 bg-white dark:bg-slate-800 rounded-full shadow-xl z-20 animate-pulse">
                    <Music className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
                </div>

                {/* Main Image Container */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-[6px] md:border-[8px] border-white dark:border-slate-800 shadow-2xl bg-teal-100">
                     <EditableImage 
                        id="aboutImage"
                        defaultSrc="/KCS LION HEAD.png"
                        alt="Profile"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
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
