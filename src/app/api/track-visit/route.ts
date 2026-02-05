
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        let pathname = '/';
        try {
            const body = await request.json();
            pathname = body.pathname || '/';
        } catch (e) {
            // Body might be empty
        }
        const headers = request.headers;

        // Get IP address
        // Safely parse x-forwarded-for to get the first IP if multiple exist
        const forwardedFor = headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
        const userAgent = headers.get('user-agent') || 'unknown';

        let location = "Unknown Location";
        let country = "Unknown";
        let city = "Unknown";

        // Fetch location data from IP-API (free, no key required for basic usage)
        // Note: 'unknown' or localhost IPs (::1, 127.0.0.1) won't return valid geo data
        if (ip && ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1') {
            try {
                const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
                if (geoRes.ok) {
                    const geoData = await geoRes.json();
                    if (geoData.status === 'success') {
                        country = geoData.country;
                        city = geoData.city;
                        location = `${city}, ${country}`;
                    }
                }
            } catch (geoError) {
                console.warn("Failed to fetch location data:", geoError);
            }
        }

        // Log to Firestore
        await addDoc(collection(db, 'visitors'), {
            path: pathname,
            ip,
            location,
            city,
            country,
            userAgent,
            timestamp: serverTimestamp(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking visit:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
