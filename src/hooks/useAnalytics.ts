'use client';

export const useAnalytics = () => {
    const track = (eventName: string, properties?: Record<string, unknown>) => {
        // In production, this would send to an API.
        // For MVP/Dev, we log to console (Privacy Safe).
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Analytics] ${eventName}`, properties);
        }
    };

    return { track };
};
