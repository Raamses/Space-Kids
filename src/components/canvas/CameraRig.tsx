'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { useRef } from 'react';

import * as THREE from 'three';

interface CameraRigProps {
    planetCount: number;
    planetSpacing: number;
    isRtl?: boolean;
    targetPlanetIndex?: number | null;
    isZoomed?: boolean;
}

export const CameraRig = ({
    planetCount,
    planetSpacing,
    isRtl = false,
    targetPlanetIndex = null,
    isZoomed = false,
    viewMode = 'LINE_UP'
}: CameraRigProps & { viewMode?: 'ORRERY' | 'LINE_UP' }) => {
    const scroll = useScroll();
    const { camera } = useThree();

    useFrame((state, delta) => {
        if (viewMode === 'ORRERY') return;

        const direction = isRtl ? -1 : 1;
        const totalDistance = (planetCount - 1) * planetSpacing;

        let targetX = 0;
        let targetZ = 20;

        if (isZoomed && targetPlanetIndex !== null && targetPlanetIndex !== undefined) {
            // Orbit Mode: Target the specific planet
            targetX = targetPlanetIndex * planetSpacing * direction;
            targetZ = 6; // Close up (radius is 2.5)

            // Note: We are ignoring scroll.offset here for X position, 
            // effectively "freezing" the view even if the user scrolls in the background.
        } else {
            // System Mode: Follow scroll
            // Scroll offset persists because ScrollControls are not unmounted.
            targetX = scroll.offset * totalDistance * direction;
            targetZ = 20;
        }

        // Smooth camera movement with adjusted dampening
        // If coming back from zoom, this lerp handles the transition smoothly 
        // because targetX creates a large delta which lerp closes over time.
        // eslint-disable-next-line react-hooks/immutability
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 4);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 3);
    });

    return null;
};
