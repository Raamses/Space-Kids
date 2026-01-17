export interface Planet {
    id: string;
    icon: string;
    color: string;
    translationKey: string;
    isLocked?: boolean;
    facts: string[];
    pointsOfInterest?: {
        id: string;
        label: string;
        position: [number, number, number];
        fact: string;
    }[];
}
