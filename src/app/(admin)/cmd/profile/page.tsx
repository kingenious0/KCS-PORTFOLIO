"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useContent } from "@/lib/ContentContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, User, Upload, Check, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const { content, updateContent } = useContent();
    const router = useRouter();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
    const [statusMessage, setStatusMessage] = useState("");
    
    // Use the content context value or default
    const currentProfileImage = content["aboutImage"] || "/KCS LION HEAD.png";

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setUploadStatus("idle");
            setStatusMessage("");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setStatusMessage("Please select a file first.");
            setUploadStatus("error");
            return;
        }

        setIsUploading(true);
        setStatusMessage("Uploading to cloud...");
        setUploadStatus("idle");

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("folder", "portfolio");

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            
            // Update Firestore
            await updateContent("aboutImage", data.url);

            setUploadStatus("success");
            setStatusMessage("Profile picture updated successfully!");
            setSelectedFile(null);
            setPreviewUrl(null); // Clear preview to show new current image
        } catch (error) {
            console.error(error);
            setUploadStatus("error");
            setStatusMessage("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    if (authLoading) return <div className="h-screen flex items-center justify-center text-neon-blue">Loading Profile Manager...</div>;

    if (!user) {
        router.push("/cmd");
        return null;
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                <div>
                    <Button variant="ghost" onClick={() => router.push('/cmd')} className="mb-4 pl-0 hover:bg-transparent text-gray-400 hover:text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Command Center
                    </Button>
                    <h1 className="text-3xl font-bold text-cyan-400 flex items-center gap-3">
                        <User className="w-8 h-8" /> PROFILE MANAGER
                    </h1>
                    <p className="text-gray-400 font-mono mt-1">Manage your public persona.</p>
                </div>
            </header>

            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    
                    {/* Upload Section */}
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                                <Upload className="w-5 h-5 text-neon-blue" /> 
                                Upload New Image
                            </h2>

                            {/* Native File Input */}
                            <div className="space-y-4">
                                <div className="p-4 border-2 border-dashed border-white/20 rounded-lg hover:border-white/40 transition-colors bg-black/20">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="w-full text-sm text-gray-400
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-full file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-neon-blue file:text-black
                                          hover:file:bg-cyan-300
                                          cursor-pointer"
                                    />
                                    <p className="mt-2 text-xs text-gray-500">Supports JPG, PNG, WEBP</p>
                                </div>

                                {selectedFile && (
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex items-center gap-4 mb-4">
                                            {previewUrl && (
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-black">
                                                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{selectedFile.name}</p>
                                                <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>

                                        <Button 
                                            variant="neon" 
                                            onClick={handleUpload} 
                                            disabled={isUploading}
                                            className="w-full"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                                                </>
                                            ) : (
                                                "Confirm Upload"
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {uploadStatus === "success" && (
                                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400">
                                        <Check className="w-5 h-5" />
                                        <p>{statusMessage}</p>
                                    </div>
                                )}

                                {uploadStatus === "error" && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                                        <AlertCircle className="w-5 h-5" />
                                        <p>{statusMessage}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Current Image Display */}
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-4 text-white">Current Profile Picture</h2>
                            <p className="text-sm text-gray-400 mb-6">
                                This image is currently visible on the Home Page.
                            </p>
                            
                            <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-xl border border-white/20 bg-black">
                                <Image 
                                    src={currentProfileImage}
                                    alt="Current Profile"
                                    fill
                                    className="object-cover"
                                    unoptimized // Useful if pulling from external URLs without config
                                />
                            </div>
                        </div>

                         <div className="p-6 rounded-xl border border-dashed border-white/20">
                            <h2 className="text-xl font-bold mb-4">Live Preview</h2>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
                                <p className="text-gray-400">Updates are reflected instantly on the live site.</p>
                            </div>
                            <div className="mt-4">
                                <Button variant="secondary" onClick={() => router.push('/')}>View Home Page</Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
