"use client";

import { motion } from "framer-motion";
import { InlineText } from "@/components/admin/InlineText";
import { EditableImage } from "@/components/admin/EditableImage";
import { WorkflowSection } from "@/components/about/WorkflowSection";
import Link from "next/link";
import { ArrowRight, Briefcase, Calendar } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white pt-32 pb-20">
            {/* Hero Section */}
            <section className="px-6 md:px-12 mb-20">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1]">
                            <InlineText id="aboutHeroTitle" defaultValue="The Person Behind The Code" />
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                            <InlineText id="aboutHeroSub" defaultValue="I'm a frontend-heavy fullstack developer passionate about building products that combine technical excellence with human-centric design." />
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Profile & Bio Section */}
            <section className="px-6 md:px-12 mb-32">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Image Column */}
                    <div className="lg:col-span-5 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-slate-100 dark:border-white/10 shadow-2xl"
                        >
                            <EditableImage 
                                id="aboutPageMainImage"
                                defaultSrc="/KCS LION HEAD.png"
                                alt="Elliot Entsiwah Profile"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                        
                        <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                             <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500 mb-4">Quick Stats</h3>
                             <div className="grid grid-cols-2 gap-6">
                                 <div>
                                     <p className="text-3xl font-black">5+</p>
                                     <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Projects Built</p>
                                 </div>
                                 <div>
                                     <p className="text-3xl font-black">3+</p>
                                     <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Years Experience</p>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-7 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight italic text-orange-500">
                                    Hi, my name is Elliot Entsiwah.
                                </h2>
                                <div className="space-y-6 text-lg md:text-xl text-slate-700 dark:text-slate-400 leading-relaxed font-medium">
                                    <p>
                                        <InlineText id="aboutDetailedBio1" defaultValue="I am a Frontend Engineer with 3+ years of experience in creating beautiful and performant web applications that provide exceptional user experiences." />
                                    </p>
                                    <p>
                                        <InlineText id="aboutDetailedBio2" defaultValue="My journey began with a curiosity for how things work on the web, which quickly evolved into a obsession with building seamless digital products. I specialize in React, Next.js, and modern CSS, but I'm equally comfortable architecting fullstack solutions." />
                                    </p>
                                    <p>
                                        <InlineText id="aboutDetailedBio3" defaultValue="What sets me apart is my ability to leverage AI-driven workflows. Using tools like Cursor and Antigravity, I'm able to bridge the gap between complex engineering and rapid delivery, ensuring that I ship high-quality code at the speed of thought." />
                                    </p>
                                </div>
                            </div>

                            {/* Experience Timeline */}
                            <div className="space-y-8 pt-8 border-t border-slate-100 dark:border-white/10">
                                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">Professional Journey</h3>
                                <div className="space-y-12">
                                    <ExperienceItem 
                                        idPrefix="exp1"
                                        defaultRole="Fullstack Engineer (Independent)"
                                        defaultCompany="Kingenious Works"
                                        defaultPeriod="2025 - Present"
                                        defaultDesc="Architecting complex AI-accelerated platforms. Currently building USTED Scholar and maintaining the USTED Counseling System. Successfully shipped Niouspark and USTED Nav, focusing on high-performance logic and seamless UX."
                                    />
                                    <ExperienceItem 
                                        idPrefix="exp2"
                                        defaultRole="Web Developer & Student"
                                        defaultCompany="UEW / Freelance"
                                        defaultPeriod="2023 - 2024"
                                        defaultDesc="Transitioned from French studies at University of Education Winneba to full-stack engineering. Started taking on custom web projects for clients, bridging the gap between human language and machine code."
                                    />
                                    <ExperienceItem 
                                        idPrefix="exp3"
                                        defaultRole="Creative Producer"
                                        defaultCompany="Kingenious Beats"
                                        defaultPeriod="2020 - 2023"
                                        defaultDesc="Established a foundation in creative production and sound design. Developed the discipline of building products from scratch, a mindset that now drives my 'frontend-first' engineering approach."
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <WorkflowSection />

            {/* Final CTA */}
            <section className="px-6 md:px-12">
                <div className="max-w-5xl mx-auto p-12 md:p-20 rounded-[3rem] bg-slate-900 dark:bg-white text-white dark:text-black text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent pointer-events-none" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                            Got a project in mind?<br />Let's talk.
                        </h2>
                        <Link 
                            href="/contact" 
                            className="inline-flex items-center gap-4 px-10 py-5 bg-orange-500 dark:bg-black text-white dark:text-white rounded-full font-black text-xl hover:scale-105 transition-transform"
                        >
                            Get In Touch <ArrowRight className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

function ExperienceItem({ idPrefix, defaultRole, defaultCompany, defaultPeriod, defaultDesc }: { idPrefix: string, defaultRole: string, defaultCompany: string, defaultPeriod: string, defaultDesc: string }) {
    return (
        <div className="flex gap-6 relative group">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:border-orange-500/50 transition-colors">
                    <Briefcase className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1 w-px bg-slate-100 dark:bg-white/10 my-4" />
            </div>
            <div className="pb-8 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <h4 className="text-xl font-bold">
                        <InlineText id={`${idPrefix}Role`} defaultValue={defaultRole} />
                    </h4>
                    <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-orange-500/30" />
                    <p className="text-orange-500 font-bold tracking-tight">
                        <InlineText id={`${idPrefix}Company`} defaultValue={defaultCompany} />
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-bold uppercase tracking-widest">
                    <Calendar className="w-4 h-4" /> 
                    <InlineText id={`${idPrefix}Period`} defaultValue={defaultPeriod} />
                </div>
                <div className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    <InlineText id={`${idPrefix}Desc`} defaultValue={defaultDesc} />
                </div>
            </div>
        </div>
    );
}
