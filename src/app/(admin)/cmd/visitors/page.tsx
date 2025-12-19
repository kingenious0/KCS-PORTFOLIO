
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { ArrowLeft, RefreshCw, User, Monitor, Smartphone, Globe, Clock, ChevronDown, ChevronUp, MapPin } from "lucide-react";
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

interface SessionGroup {
    id: string; // unique ID for session (ip + approximate time)
    ip: string;
    location: string;
    userAgent: string;
    deviceType: 'mobile' | 'desktop' | 'unknown';
    startTime: Date;
    lastActive: Date;
    pageViews: VisitorLog[];
}

export default function VisitorsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [visitors, setVisitors] = useState<VisitorLog[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // State for sessions
    const [sessions, setSessions] = useState<SessionGroup[]>([]);
    const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

    // Helper to parse UA
    const getDeviceType = (ua: string): 'mobile' | 'desktop' | 'unknown' => {
        if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return 'mobile';
        if (/windows|macintosh|linux/i.test(ua)) return 'desktop';
        return 'unknown';
    };

    const getShortUA = (ua: string) => {
        let os = "Unknown OS";
        if (/windows/i.test(ua)) os = "Windows";
        else if (/macintosh|mac os/i.test(ua)) os = "macOS";
        else if (/android/i.test(ua)) os = "Android";
        else if (/ios|iphone|ipad/i.test(ua)) os = "iOS";
        else if (/linux/i.test(ua)) os = "Linux";

        let browser = "Unknown Browser";
        if (/chrome|crios/i.test(ua)) browser = "Chrome";
        else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
        else if (/safari/i.test(ua)) browser = "Safari";
        else if (/edg/i.test(ua)) browser = "Edge";

        return `${os} • ${browser}`;
    };

    useEffect(() => {
        if (!user && !loading) {
            router.push("/cmd");
            return;
        }

        if (user) {
            const q = query(
                collection(db, "visitors"),
                orderBy("timestamp", "desc"),
                limit(200) // Fetch more to group effectively
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const logs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as VisitorLog[];

                // Group into sessions
                const groups: SessionGroup[] = [];
                const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

                // Since logs are sorted DESC (newest first), we iterate
                // and fit them into the "latest" session for that IP

                logs.forEach(log => {
                    const logTime = log.timestamp?.toDate().getTime() || 0;

                    // Find an existing session for this IP that is within the timeout window
                    // Because we iterate DESC, the "existing" session we find is the "future" relative to this log
                    // So we check if (ExistingSession.startTime - logTime) < TIMEOUT

                    const existingGroup = groups.find(g =>
                        g.ip === log.ip &&
                        (Math.abs(g.lastActive.getTime() - logTime) < SESSION_TIMEOUT || Math.abs(g.startTime.getTime() - logTime) < SESSION_TIMEOUT)
                    );

                    if (existingGroup) {
                        existingGroup.pageViews.push(log);
                        // Update start/end times
                        if (logTime < existingGroup.startTime.getTime()) existingGroup.startTime = new Date(logTime);
                        if (logTime > existingGroup.lastActive.getTime()) existingGroup.lastActive = new Date(logTime);
                    } else {
                        groups.push({
                            id: `${log.ip}-${logTime}`, // Unique session ID
                            ip: log.ip,
                            location: log.location || "Unknown Location",
                            userAgent: log.userAgent,
                            deviceType: getDeviceType(log.userAgent),
                            startTime: new Date(logTime),
                            lastActive: new Date(logTime),
                            pageViews: [log]
                        });
                    }
                });

                // Sort page views within sessions by time DESC
                groups.forEach(g => {
                    g.pageViews.sort((a, b) => (b.timestamp?.toDate().getTime() || 0) - (a.timestamp?.toDate().getTime() || 0));
                });

                setSessions(groups);
                setVisitors(logs); // Keep raw for reference if needed
                setIsLoadingData(false);
            });

            return () => unsubscribe();
        }
    }, [user, loading, router]);

    const toggleSession = (id: string) => {
        const newSet = new Set(expandedSessions);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedSessions(newSet);
    };

    if (loading || isLoadingData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-neon-blue">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading Visitor Logs...
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            <header className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                <Button variant="ghost" size="sm" onClick={() => router.push('/cmd')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-neon-blue flex items-center gap-3">
                        <User className="w-8 h-8" /> VISITOR ACTIVITY
                    </h1>
                    <p className="text-gray-400 font-mono mt-1 text-sm md:text-base">Grouped by active sessions.</p>
                </div>
            </header>

            <div className="space-y-4 max-w-5xl mx-auto">
                {sessions.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-gray-500">No activity recorded yet.</p>
                    </div>
                ) : (
                    sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`
                                border rounded-xl overflow-hidden transition-all duration-200
                                ${expandedSessions.has(session.id) ? 'bg-white/5 border-neon-blue/30' : 'bg-white/5 border-white/5 hover:border-white/20'}
                            `}
                        >
                            {/* Session Header */}
                            <div
                                onClick={() => toggleSession(session.id)}
                                className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center gap-4 justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                        ${session.deviceType === 'mobile' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}
                                    `}>
                                        {session.deviceType === 'mobile' ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-white text-lg">{session.location}</span>
                                            <span className="text-xs text-gray-500 bg-black/50 px-2 py-0.5 rounded font-mono">{session.ip}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {session.lastActive.toLocaleString()}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                                            <span>{getShortUA(session.userAgent)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 pl-14 md:pl-0">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">{session.pageViews.length}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Page Views</p>
                                    </div>
                                    {expandedSessions.has(session.id) ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                                </div>
                            </div>

                            {/* Session Details (Expandable) */}
                            {expandedSessions.has(session.id) && (
                                <div className="border-t border-white/10 bg-black/20 animate-in slide-in-from-top-2 duration-200">
                                    <table className="w-full text-left">
                                        <thead className="text-xs text-gray-500 font-mono uppercase bg-white/5">
                                            <tr>
                                                <th className="px-6 py-2">Time</th>
                                                <th className="px-6 py-2">Page Visited</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-sm font-mono text-gray-300">
                                            {session.pageViews.map((view) => (
                                                <tr key={view.id} className="hover:bg-white/5">
                                                    <td className="px-6 py-3 w-48 text-gray-500">
                                                        {view.timestamp?.toDate().toLocaleTimeString()}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className="text-neon-blue">{view.path}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
