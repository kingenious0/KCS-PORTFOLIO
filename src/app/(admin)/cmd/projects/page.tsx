"use client";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ManageProjectsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/cmd')}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <h1 className="text-3xl font-bold text-neon-purple">Add New Project</h1>
                </div>

                <ProjectForm />
            </div>
        </div>
    );
}
