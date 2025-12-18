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
    createdAt?: any; // Firestore Timestamp
}

export interface WebProject {
    id: string;
    title: string;
    techStack: string[];
    liveUrl?: string;
    githubUrl?: string;
    caseStudy?: string; // Rich text or markdown
    screenshotUrl: string;
    impact?: string;
    role?: string;
    createdAt?: any;
}
