
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { ArrowLeft, RefreshCw, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface VisitorLog {
    id: string;
    ip: string;
    location?: string;
    city?: string;
    country?: string;
    path: string;
    userAgent: string;
    timestamp: Timestamp;
}

export default function VisitorsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [visitors, setVisitors] = useState<VisitorLog[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!user && !loading) {
            router.push("/cmd");
            return;
        }

        if (user) {
            const q = query(
                collection(db, "visitors"),
                orderBy("timestamp", "desc"),
                limit(100) // Limit to last 100 visits for performance
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const logs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as VisitorLog[];
                setVisitors(logs);
                setIsLoadingData(false);
            });

            return () => unsubscribe();
        }
    }, [user, loading, router]);

    if (loading || isLoadingData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-neon-blue">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading Visitor Logs...
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                <Button variant="ghost" size="sm" onClick={() => router.push('/cmd')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-neon-blue flex items-center gap-3">
                        <User className="w-8 h-8" /> VISITOR LOGS
                    </h1>
                    <p className="text-gray-400 font-mono mt-1">Real-time traffic monitoring.</p>
                </div>
            </header>

            <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-mono text-sm">
                                <th className="p-4">Time</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Path</th>
                                <th className="p-4">IP Address</th>
                                <th className="p-4">Device / User Agent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {visitors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No visits recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                visitors.map((visit) => (
                                    <tr key={visit.id} className="hover:bg-white/5 transition-colors font-mono text-sm">
                                        <td className="p-4 text-neon-blue whitespace-nowrap">
                                            {visit.timestamp?.toDate().toLocaleString()}
                                        </td>
                                        <td className="p-4 text-white font-bold">
                                            {visit.location || "Unknown"}
                                        </td>
                                        <td className="p-4 text-white">
                                            <span className="bg-neon-purple/20 text-neon-purple px-2 py-1 rounded">
                                                {visit.path}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-300">
                                            {visit.ip}
                                        </td>
                                        <td className="p-4 text-gray-500 max-w-xs truncate" title={visit.userAgent}>
                                            {visit.userAgent}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
