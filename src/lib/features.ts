export const Features = {
    // Core config
    adsEnabled: false, // ALWAYS FALSE for Kids App

    // Expansion Packs
    expansionDeepSpace: process.env.NEXT_PUBLIC_FEATURE_DEEP_SPACE === 'true',
    expansionRocketLab: false,

    // Debug
    showDebugAnalytics: process.env.NODE_ENV === 'development',
} as const;

export type FeatureKey = keyof typeof Features;

export function isFeatureEnabled(key: FeatureKey): boolean {
    return Features[key];
}
