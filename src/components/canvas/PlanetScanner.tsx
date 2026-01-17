import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

import * as THREE from 'three';
import { Planet } from '../../types/planet';

interface PlanetScannerProps {
    points: NonNullable<Planet['pointsOfInterest']>;
    radius: number;
    onPoiClick: (poi: NonNullable<Planet['pointsOfInterest']>[0]) => void;
    isVisible: boolean;
}

export const PlanetScanner = ({ points, radius, onPoiClick, isVisible }: PlanetScannerProps) => {
    // If not visible, we can either return null or animate opacity nicely.
    // For now, let's just not render to save perf, but if we want fade in we'd need to animate.
    if (!isVisible) return null;

    return (
        <group>
            {points.map((poi) => (
                <PoiMarker
                    key={poi.id}
                    poi={poi}
                    radius={radius}
                    onClick={() => onPoiClick(poi)}
                />
            ))}
        </group>
    );
};

const PoiMarker = ({ poi, radius, onClick }: {
    poi: NonNullable<Planet['pointsOfInterest']>[0],
    radius: number,
    onClick: () => void
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [x, y, z] = poi.position;

    // Scale position by radius (slightly offset to sit on surface)
    const position = useMemo(() => {
        const v = new THREE.Vector3(x, y, z).normalize().multiplyScalar(radius * 1.01);
        return [v.x, v.y, v.z] as [number, number, number];
    }, [x, y, z, radius]);

    // Pulse animation
    useFrame((state) => {
        if (meshRef.current) {
            const t = state.clock.getElapsedTime();
            const scale = 1 + Math.sin(t * 4) * 0.2;
            meshRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group position={position}>
            {/* The Clickable Orb */}
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation(); // Stop click from hitting planet surface
                    onClick();
                }}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                    color="#FFD700"
                    emissive="#FFD700"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>

            {/* Optional Label (Hidden for now to keep it as a "treasure hunt") */}
            {/* 
            <Html distanceFactor={10}>
                <div className="bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm pointer-events-none">
                    {poi.label}
                </div>
            </Html> 
            */}
        </group>
    );
};
