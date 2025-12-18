"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ContentContextType {
    content: Record<string, string>;
    updateContent: (key: string, value: string) => Promise<void>;
    loading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
    const [content, setContent] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const docRef = doc(db, "content", "main");
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setContent(docSnap.data() as Record<string, string>);
            } else {
                // Initialize if empty
                setDoc(docRef, {});
                setContent({});
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const updateContent = async (key: string, value: string) => {
        const docRef = doc(db, "content", "main");
        await updateDoc(docRef, { [key]: value });
    };

    return (
        <ContentContext.Provider value={{ content, updateContent, loading }}>
            {children}
        </ContentContext.Provider>
    );
}

export const useContent = () => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error("useContent must be used within a ContentProvider");
    }
    return context;
};
