
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const { pathname } = await request.json();
        const headers = request.headers;

        // Get IP address
        const ip = headers.get('x-forwarded-for') || 'unknown';
        const userAgent = headers.get('user-agent') || 'unknown';

        // Log to Firestore
        await addDoc(collection(db, 'visitors'), {
            path: pathname,
            ip,
            userAgent,
            timestamp: serverTimestamp(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking visit:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
