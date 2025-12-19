
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function VisitorTracker() {
    const pathname = usePathname();
    // Use a ref to prevent double tracking in React Strict Mode locally if needed,
    // though generally useEffect runs twice in strict mode dev, which is fine for testing.
    // For production, it runs once.
    const initialized = useRef(false);

    useEffect(() => {
        // Basic debounce or check to ensure we don't spam if the component remounts quickly
        if (initialized.current) {
            // In dev strict mode, we might want to allow it to run again or just accept double logs.
            // For a simple tracker, we can let it run. 
            // But to be cleaner, let's just log.
        }
        initialized.current = true;

        const track = async () => {
            try {
                await fetch('/api/track-visit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pathname }),
                });
            } catch (error) {
                console.error('Failed to track visit', error);
            }
        };

        console.log('Tracking visit to:', pathname);
        track();
    }, [pathname]);

    return null;
}
