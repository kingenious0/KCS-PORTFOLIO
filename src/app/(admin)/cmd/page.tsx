"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EditableImage } from "@/components/admin/EditableImage";
import { Lock, Unlock, Upload, Database, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const { user, login, logout, loading, isAdmin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            router.refresh();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
            setError("Access Denied: Invalid Credentials");
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-neon-blue">Connecting to Mainframe...</div>;

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
                <div className="w-full max-w-md space-y-8 glass p-8 rounded-xl border-neon-blue/20">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-neon-blue flex justify-center items-center gap-2">
                            <Lock className="w-6 h-6" /> RESTRICTED ACCESS
                        </h2>
                        <p className="mt-2 text-sm text-gray-400 font-mono">
                            Identity Verification Required
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4 rounded-md shadow-sm">
                            <Input
                                label="Identifier"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-black/50 border-white/10 focus:border-neon-blue"
                            />
                            <Input
                                label="Passcode"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-black/50 border-white/10 focus:border-neon-blue"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center font-mono">{error}</p>}

                        <Button type="submit" variant="neon" className="w-full">
                            AUTHENTICATE
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-neon-green flex items-center gap-3">
                        <Unlock className="w-8 h-8" /> COMMAND CENTER
                    </h1>
                    <p className="text-gray-400 font-mono mt-1">Welcome back, Admin. System Active.</p>
                </div>
                <Button variant="danger" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" /> Terminate Session
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div
                    onClick={() => router.push('/cmd/beats')}
                    className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-neon-green/30 transition-colors cursor-pointer group"
                >
                    <Upload className="w-8 h-8 text-neon-blue mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2">Upload Beat</h3>
                    <p className="text-sm text-gray-400">Add new audio assets to the vault.</p>
                </div>

                <div
                    onClick={() => router.push('/cmd/projects')}
                    className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-neon-purple/30 transition-colors cursor-pointer group"
                >
                    <Database className="w-8 h-8 text-neon-purple mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2">Manage Projects</h3>
                    <p className="text-sm text-gray-400">Update portfolio case studies.</p>
                </div>

                <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-yellow-500/30 transition-colors cursor-pointer group">
                    <Settings className="w-8 h-8 text-yellow-500 mb-4 group-hover:rotate-90 transition-transform duration-500" />
                    <h3 className="text-xl font-bold mb-2">Site Config</h3>
                    <p className="text-sm text-gray-400">Global variables and toggles.</p>
                </div>

                <div
                    onClick={() => router.push('/cmd/visitors')}
                    className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-neon-pink/30 transition-colors cursor-pointer group"
                >
                    <div className="w-8 h-8 text-neon-pink mb-4 group-hover:scale-110 transition-transform">
                        {/* Eye icon manually since we didn't import Eye and want to avoid import errors if not present */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Visitor Logs</h3>
                    <p className="text-sm text-gray-400">Track who is viewing your work.</p>
                </div>

                <div
                    onClick={() => router.push('/cmd/profile')}
                    className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-cyan-400/30 transition-colors cursor-pointer group"
                >
                     <div className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Profile Manager</h3>
                    <p className="text-sm text-gray-400">Update your profile picture.</p>
                </div>

                <div
                    onClick={() => router.push('/cmd/inbox')}
                    className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-green-400/30 transition-colors cursor-pointer group"
                >
                     <div className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Client Inbox</h3>
                    <p className="text-sm text-gray-400">Read and manage inquiries.</p>
                </div>
            </div>



            <div className="mt-12 p-6 rounded-xl border border-dashed border-white/20">
                <h2 className="text-xl font-bold mb-4">Inline Editing Status</h2>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
                    <p className="text-gray-400">Live Edit Mode Enforced on Public Pages. Navigate to any page to click and edit text.</p>
                </div>
                <div className="mt-4 flex gap-4">
                    <Button variant="secondary" onClick={() => router.push('/')}>Go to Site</Button>
                </div>
            </div>
        </div>
    );
}
