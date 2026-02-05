"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Send, CheckCircle2, User, Mail, Phone, Briefcase, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function HireMePage() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
        description: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await addDoc(collection(db, "inquiries"), {
                ...formState,
                timestamp: serverTimestamp(),
                status: "new"
            });
            toast.success("Message sent successfully!");
            setSuccess(true);
            setFormState({ name: "", email: "", phone: "", service: "", description: "" });
        } catch (error: any) {
            console.error("Error submitting form:", error);
            toast.error("Error: " + (error.message || "Failed to send"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden transition-colors duration-300">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            {/* Header */}
            <header className="pt-8 px-6 md:px-12 flex justify-between items-center relative z-10">
                <Link 
                    href="/" 
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors uppercase tracking-widest"
                >
                    <ChevronLeft className="w-4 h-4" /> Back to Home
                </Link>
            </header>

            <main className="flex-1 flex flex-col justify-center px-4 py-12 relative z-10">
                <div className="max-w-3xl mx-auto w-full">
                    
                    {/* Title Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-sm font-bold tracking-[0.3em] text-teal-600 dark:text-teal-400 uppercase mb-4">
                            Work With Me
                        </h2>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1]">
                            Tell me about your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 italic">next big idea.</span>
                        </h1>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
                    >
                        {success ? (
                            <div className="text-center py-20 space-y-6">
                                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Message Received!</h3>
                                <p className="text-lg text-slate-600 dark:text-slate-400">I'll analyze your request and get back to you within 24 hours.</p>
                                <button 
                                    onClick={() => setSuccess(false)}
                                    className="mt-8 px-8 py-3 bg-slate-100 dark:bg-slate-800 rounded-full font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Name */}
                                    <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent focus-within:border-teal-500 transition-colors">
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <User className="w-4 h-4" /> Your Name
                                        </label>
                                        <input 
                                            type="text" 
                                            required
                                            placeholder="Your Name Here" 
                                            className="w-full bg-transparent border-none p-0 text-lg font-semibold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-0"
                                            value={formState.name}
                                            onChange={e => setFormState({...formState, name: e.target.value})}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent focus-within:border-teal-500 transition-colors">
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <Mail className="w-4 h-4" /> Email Address
                                        </label>
                                        <input 
                                            type="email" 
                                            required
                                            placeholder="example@gmail.com" 
                                            className="w-full bg-transparent border-none p-0 text-lg font-semibold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-0"
                                            value={formState.email}
                                            onChange={e => setFormState({...formState, email: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Phone */}
                                    <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent focus-within:border-teal-500 transition-colors">
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <Phone className="w-4 h-4" /> Phone Number
                                        </label>
                                        <input 
                                            type="tel" 
                                            placeholder="+233..." 
                                            className="w-full bg-transparent border-none p-0 text-lg font-semibold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-0"
                                            value={formState.phone}
                                            onChange={e => setFormState({...formState, phone: e.target.value})}
                                        />
                                    </div>

                                    {/* Service */}
                                    <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent focus-within:border-teal-500 transition-colors">
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <Briefcase className="w-4 h-4" /> Interested In
                                        </label>
                                        <select 
                                            className="w-full bg-transparent border-none p-0 text-lg font-semibold text-slate-900 dark:text-white focus:ring-0 cursor-pointer"
                                            value={formState.service}
                                            onChange={e => setFormState({...formState, service: e.target.value})}
                                        >
                                            <option value="" disabled className="text-slate-400">Select a service</option>
                                            <option value="web" className="dark:bg-slate-900">Web Development</option>
                                            <option value="beats" className="dark:bg-slate-900">Beat Production</option>
                                            <option value="fullstack" className="dark:bg-slate-900">Full Stack App</option>
                                            <option value="sound" className="dark:bg-slate-900">Sound Design</option>
                                            <option value="other" className="dark:bg-slate-900">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent focus-within:border-teal-500 transition-colors">
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <FileText className="w-4 h-4" /> Project Description
                                    </label>
                                    <textarea 
                                        rows={4}
                                        required
                                        placeholder="Tell me more about what you're looking for..." 
                                        className="w-full bg-transparent border-none p-0 text-lg font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-0 resize-none"
                                        value={formState.description}
                                        onChange={e => setFormState({...formState, description: e.target.value})}
                                    />
                                </div>

                                {/* Submit Button */}
                                <button 
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-5 rounded-2xl bg-teal-600 text-white font-black text-xl uppercase tracking-widest hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-500/20 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                                >
                                    {submitting ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" /> Send Inquiry
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
