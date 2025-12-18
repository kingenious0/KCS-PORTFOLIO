"use client";

import { useState, useEffect } from "react";
import { WebProject } from "@/types";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteProject } from "@/lib/db";

export function useProjects() {
    const [projects, setProjects] = useState<WebProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, "webProjects"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const projectData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as WebProject[];
                setProjects(projectData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching projects:", err);
                setError("Failed to load projects.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { projects, loading, error, deleteProject };
}
