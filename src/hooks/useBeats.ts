"use client";

import { useState, useEffect } from "react";
import { getBeats, createBeat, updateBeat, deleteBeat } from "@/lib/db";
import { Beat } from "@/types";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useBeats() {
    const [beats, setBeats] = useState<Beat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Real-time subscription
        const q = query(collection(db, "beats"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const beatData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Beat[];
                setBeats(beatData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching beats:", err);
                setError("Failed to load beats.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { beats, loading, error };
}
