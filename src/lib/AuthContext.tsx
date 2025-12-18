"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean; // Just checks if user exists for now, in a real app check specific UID or claim
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "admin@elite.com"; // Hardcoded for this demo scope, or use Firestore to store admin UIDs

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const logout = async () => {
        await signOut(auth);
    };

    const isAdmin = !!user; // In a real app, strict check logic here

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
