"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChevronLeft, Mail, Phone, Calendar, CheckCircle, Archive, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    description: string;
    status: "new" | "read" | "archived";
    timestamp: any;
}

export default function InboxPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "inquiries"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            const data: Inquiry[] = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as Inquiry);
            });
            setInquiries(data);
        } catch (error) {
            console.error("Error fetching inquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const updateStatus = async (id: string, status: "read" | "archived") => {
        try {
            const ref = doc(db, "inquiries", id);
            await updateDoc(ref, { status });
            // Optimistic update
            setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="sm" onClick={() => router.push("/cmd")}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <div>
                     <h1 className="text-3xl font-bold text-green-400 flex items-center gap-2">
                        <Mail className="w-8 h-8" /> CLIENT INBOX
                    </h1>
                    <p className="text-gray-400 font-mono">Manage your incoming leads.</p>
                </div>
            </header>

            {loading ? (
                <div className="text-center text-neon-blue animate-pulse">Scanning Frequency...</div>
            ) : inquiries.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
                    <p className="text-gray-500">No signals detected yet.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {inquiries.map((inquiry) => (
                        <div 
                            key={inquiry.id} 
                            className={`p-6 rounded-xl border transition-all ${
                                inquiry.status === "new" 
                                ? "bg-green-900/10 border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.1)]" 
                                : "bg-white/5 border-white/10 opacity-75"
                            }`}
                        >
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        {inquiry.name} 
                                        {inquiry.status === "new" && (
                                            <span className="px-2 py-0.5 rounded text-xs bg-green-500 text-black font-bold uppercase">New</span>
                                        )}
                                    </h3>
                                    <p className="text-green-400 font-mono text-sm mt-1">{inquiry.service} Project</p>
                                </div>
                                <div className="text-right text-sm text-gray-500 font-mono">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Calendar className="w-3 h-3" />
                                        {inquiry.timestamp?.toDate ? inquiry.timestamp.toDate().toLocaleString() : "Just now"}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/30 p-4 rounded-lg mb-4 text-gray-300 leading-relaxed font-sans">
                                "{inquiry.description}"
                            </div>

                            <div className="flex flex-wrap gap-4 items-center justify-between border-t border-white/5 pt-4">
                                <div className="flex gap-4 text-sm text-gray-400">
                                    <a href={`mailto:${inquiry.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                                        <Mail className="w-4 h-4" /> {inquiry.email}
                                    </a>
                                    {inquiry.phone && (
                                        <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                                            <Phone className="w-4 h-4" /> {inquiry.phone}
                                        </a>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {inquiry.status === "new" && (
                                        <Button size="sm" variant="secondary" onClick={() => updateStatus(inquiry.id, "read")}>
                                            <CheckCircle className="w-4 h-4 mr-2" /> Mark Read
                                        </Button>
                                    )}
                                    {inquiry.status !== "archived" && (
                                         <Button size="sm" variant="ghost" onClick={() => updateStatus(inquiry.id, "archived")}>
                                            <Archive className="w-4 h-4 mr-2" /> Archive
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
