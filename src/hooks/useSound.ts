'use client';

import { useEffect, useRef } from 'react';

// Simplified sound hook using standard HTML5 Audio to avoid heavy deps like Howler for MVP
export const useSound = (url: string) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio(url);
    }, [url]);

    const play = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log("Audio play failed (interaction needed)", e));
        }
    };

    return [play];
};
