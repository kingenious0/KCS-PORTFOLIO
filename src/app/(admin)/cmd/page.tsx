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
            </div>

            {/* Page Content Management Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-neon-blue rounded-full" />
                    Page Content
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* About Section Card */}
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <h3 className="text-6xl font-black text-white uppercase transform rotate-12">About</h3>
                        </div>

                        <h3 className="text-xl font-bold mb-4 z-10 relative text-neon-blue">About Section</h3>

                        <div className="flex items-start gap-6 relative z-10">
                            <div className="space-y-4 flex-1">
                                <p className="text-sm text-gray-400">Manage your personal profile visuals.</p>

                                <div className="space-y-1">
                                    <div className="text-xs uppercase tracking-widest text-gray-500 font-bold">Current Asset</div>
                                    <div className="text-xs text-neon-blue border border-neon-blue/30 bg-neon-blue/5 px-2 py-1 rounded inline-block">
                                        Profile Image
                                    </div>
                                </div>
                            </div>

                            {/* The Image Uploader */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-white/20 shrink-0 bg-black/20 group hover:border-neon-blue/50 transition-colors">
                                    <EditableImage
                                        id="aboutProfileImage"
                                        defaultSrc="https://res.cloudinary.com/dthdohxgs/image/upload/v1766044744/portfolio/profile-placeholder.jpg"
                                        alt="Admin Profile Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Click to Edit</span>
                            </div>
                        </div>
                    </div>
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
