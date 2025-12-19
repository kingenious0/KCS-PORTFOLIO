export interface Beat {
    id: string;
    title: string;
    bpm: number;
    key: string;
    price: number;
    genre: string[];
    mood: string[];
    audioUrl: string;
    coverUrl: string;
    stemsAvailable: boolean;
    producedBy?: string; // Default: KCS
    artist?: string;
    type?: "Beat" | "Remix" | "Full Song" | "Other";
    currency?: string; // e.g. "USD", "GHS"
    createdAt?: any; // Firestore Timestamp
}

export interface WebProject {
    id: string;
    title: string;
    description: string; // Added missing field used in code
    techStack: string[];
    liveUrl?: string;
    githubUrl?: string;
    imageUrl: string; // Renamed from screenshotUrl to match usage
    role?: string;
    impact?: string;
    isLocked?: boolean;
    createdAt?: any;
}
