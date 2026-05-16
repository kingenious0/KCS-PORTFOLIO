"use client";

import { motion } from "framer-motion";
import { InlineText } from "@/components/admin/InlineText";
import { EditableImage } from "@/components/admin/EditableImage";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


export function AboutSection() {
    return (
        <section className="py-32 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">

                {/* Left Side: Image */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="w-full md:w-5/12 flex justify-center md:justify-start"
                >
                    <div className="relative w-[280px] h-[350px] md:w-[400px] md:h-[500px]">
                        <div className="absolute inset-0 border-2 border-orange-500/20 rounded-3xl translate-x-2 md:translate-x-4 translate-y-2 md:translate-y-4 -z-10" />
                        <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-2xl">
                             <EditableImage 
                                id="aboutImageMain"
                                defaultSrc="/K.C.S LOGO HEAD.png"
                                alt="About Profile"
                                fill
                                priority={true}
                                sizes="(max-width: 768px) 280px, 400px"
                                className="object-contain p-8"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Content */}
                <div className="w-full md:w-7/12 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="block text-sm font-black tracking-[0.3em] text-orange-600 uppercase mb-4">
                            <InlineText id="aboutBadge" defaultValue="ABOUT ME" />
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-8">
                            <InlineText
                                id="aboutTitle"
                                defaultValue="I Build Digital Solutions."
                            />
                        </h2>

                        <div className="space-y-6 text-lg text-slate-700 dark:text-slate-400 font-medium leading-relaxed">
                            <p>
                                <InlineText
                                    id="aboutBio1"
                                    defaultValue="Hi, I'm Kingenious. I'm a Fullstack Developer who thrives on the frontend. While I handle the entire stack, my passion lies in crafting pixel-perfect, interactive user experiences that leave a lasting impression."
                                />
                            </p>
                            <p>
                                <InlineText
                                    id="aboutBio2"
                                    defaultValue="I am a pioneer in AI-accelerated development. By leveraging cutting-edge tools like Cursor and Antigravity, I've successfully built and scaled over 5 fullstack applications with unmatched efficiency. I don't just use these tools; I master them to ship higher-quality products in record time."
                                />
                            </p>
                            <p>
                                <InlineText
                                    id="aboutBio3"
                                    defaultValue="My approach is built for the modern era: combining deep engineering knowledge with agentic workflows. Whether you need a high-performance web app or a unique sonic identity, I bring a level of speed and scalability that traditional workflows simply can't match."
                                />
                            </p>
                        </div>

                        <div className="pt-8 flex flex-wrap gap-4">
                            <Link href="/about" className="px-10 py-4 bg-orange-700 text-white rounded-full font-bold hover:bg-orange-800 transition-all shadow-lg shadow-orange-700/20 inline-flex items-center gap-2 group">
                                Learn More About Me <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/contact" className="px-10 py-4 border-2 border-orange-700 text-orange-700 rounded-full font-bold hover:bg-orange-700 hover:text-white transition-all inline-flex items-center gap-2">
                                Hire Me
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
