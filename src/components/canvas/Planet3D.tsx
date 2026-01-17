'use client';

import { useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useTexture, Text } from '@react-three/drei';
import { Mesh, DoubleSide, Texture } from 'three';
import { Planet } from '../../types/planet';
import { PLANET_ASSETS } from '../../utils/assets';
import { Atmosphere } from './Atmosphere';
import { PlanetScanner } from './PlanetScanner';
import { SunVisuals } from './SunVisuals';

interface Planet3DProps {
    planet: Planet;
    onClick: (planet: Planet) => void;
    isSelected?: boolean;
    isInOrbitMode?: boolean;
    onPoiClick?: (poi: NonNullable<Planet['pointsOfInterest']>[0]) => void;
}

export const Planet3D = ({ planet, onClick, isSelected, isInOrbitMode, onPoiClick }: Planet3DProps) => {
    const meshRef = useRef<Mesh>(null);
    const cloudsRef = useRef<Mesh>(null);
    const planetId = planet.id.toLowerCase();

    // Interaction state
    const isDragging = useRef(false);
    const dragDistance = useRef(0);
    const previousPointerDetails = useRef({ x: 0, y: 0 });

    // Get assets configuration for this planet, fallback to Mars if not found
    const assets = PLANET_ASSETS[planetId as keyof typeof PLANET_ASSETS] || PLANET_ASSETS['mars'];

    // Load textures. useTexture can handle an object of paths.
    // Note: This relies on the keys in assets object matching what we expect.
    const textures = useTexture(assets as unknown as Record<string, string>) as Record<string, Texture>;
    // textures will have keys corresponding to assets keys: map, normalMap, etc.

    // Idle rotation
    useFrame((state, delta) => {
        // Rotate planet only if NOT in Orbit Mode AND NOT dragging
        /*
          Rationale for 'isDragging.current':
          If the user is actively dragging, we don't want the auto-rotation to fight them.
          If they stop dragging, we could resume or add momentum, but resuming is fine for now.
        */
        if (meshRef.current && !planet.isLocked && !isSelected && !isDragging.current) {
            meshRef.current.rotation.y += delta * 0.1;
        }

        // Clouds always auto-rotate unless selected (orbit mode), independent of planet drag for cool effect? 
        // Or should they drag with planet? Let's keep them independent for now adds depth.
        if (cloudsRef.current && !isSelected) {
            cloudsRef.current.rotation.y += delta * 0.14;
        }
    });

    const isGasGiant = ['jupiter', 'saturn', 'uranus', 'neptune'].includes(planetId);
    const hasAtmosphere = ['earth', 'venus', 'mars'].includes(planetId);
    const hasRings = planetId === 'saturn' || planetId === 'uranus';

    const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
        // Prevent event from bubbling if we just want to grab the planet
        // e.stopPropagation(); // Maybe not, depends on if we want click to fire?
        // Actually, if we drag, we probably don't want 'onClick' to fire on release if it was a long drag.
        // But for now, let's just track dragging.
        isDragging.current = true;
        dragDistance.current = 0;
        previousPointerDetails.current = { x: e.pointer.x, y: e.pointer.y };
        if (meshRef.current) {
            // Optional: visual feedback
            document.body.style.cursor = 'grabbing';
        }
    };

    const handlePointerUp = () => {
        isDragging.current = false;
        document.body.style.cursor = 'pointer';
        // Note: 'onClick' should still ideally fire if it was a quick tap.
        // Three.js 'onClick' usually fires even if moved slightly.
    };

    const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (isDragging.current && meshRef.current) {
            const deltaX = e.pointer.x - previousPointerDetails.current.x;
            const deltaY = e.pointer.y - previousPointerDetails.current.y;

            dragDistance.current += Math.abs(deltaX) + Math.abs(deltaY);

            // Apply rotation (Y-axis for Horizontal Drag, X-axis for Vertical Drag)
            meshRef.current.rotation.y += deltaX * 2.5;

            // Vertical Rotation (X-axis) with Clamping
            // Red Team Mitigation: Clamp to approx +/- 60 degrees (1.0 radian) to prevent flipping
            const newRotationX = meshRef.current.rotation.x + (deltaY * 2.5);
            meshRef.current.rotation.x = Math.max(-1.0, Math.min(1.0, newRotationX));

            previousPointerDetails.current = { x: e.pointer.x, y: e.pointer.y };
        }
    };

    return (
        <group>
            {/* Main Planet Sphere */}
            {planetId === 'sun' ? (
                <SunVisuals
                    ref={meshRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (dragDistance.current < 0.05) onClick(planet);
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={() => {
                        isDragging.current = false;
                        document.body.style.cursor = 'auto';
                    }}
                    onPointerOver={() => document.body.style.cursor = 'pointer'}
                    onPointerOut={() => {
                        document.body.style.cursor = 'auto';
                        isDragging.current = false;
                    }}
                    scale={isSelected ? 1.2 : 1}
                />
            ) : (
                <mesh
                    ref={meshRef}
                    onClick={(e) => {
                        // Start dragging logic is separate from click. 
                        // However, R3F's onClick might be triggered after a drag.
                        e.stopPropagation();
                        // Check if the user dragged significantly
                        if (dragDistance.current < 0.05) {
                            onClick(planet);
                        }
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={() => {
                        isDragging.current = false;
                        document.body.style.cursor = 'auto';
                    }}
                    onPointerOver={() => document.body.style.cursor = 'pointer'}
                    onPointerOut={() => {
                        document.body.style.cursor = 'auto';
                        isDragging.current = false;
                    }}
                    scale={isSelected ? 1.2 : 1}
                >
                    <sphereGeometry args={[2.5, 64, 64]} />
                    <meshStandardMaterial
                        map={textures.map}
                        normalMap={textures.normalMap}
                        roughnessMap={textures.specularMap} // Using specular as roughness map (inverted usually, but works for contrast)
                        roughness={isGasGiant ? 1 : 0.7}
                        metalness={0.1}
                        color={planet.isLocked ? "#888" : "#fff"}
                        emissive={planetId === 'sun' ? "#ffaa00" : "#000"}
                        emissiveIntensity={planetId === 'sun' ? 2 : 0}
                    />

                    {/* Points of Interest Scanner */}
                    {planet.pointsOfInterest && onPoiClick && (
                        <PlanetScanner
                            points={planet.pointsOfInterest}
                            radius={2.5}
                            onPoiClick={onPoiClick}
                            isVisible={!!isInOrbitMode}
                        />
                    )}
                </mesh>
            )}

            {/* Rest of the component unchanged... */}
            {/* Cloud Layer (Earth only mostly) */}
            {textures.cloudsMap && (
                <mesh ref={cloudsRef} scale={[2.53, 2.53, 2.53]}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshStandardMaterial
                        map={textures.cloudsMap}
                        transparent
                        opacity={0.8}
                        side={DoubleSide}
                        blending={2} // Additive? or Normal? standard transparent is fine.
                        depthWrite={false} // Prevents z-fighting with atmosphere
                    />
                </mesh>
            )}

            {/* Atmosphere Glow */}
            {hasAtmosphere && (
                <Atmosphere
                    color={planetId === 'earth' ? '#44aaff' : planetId === 'venus' ? '#ffa500' : '#ffccaa'}
                    scale={2.7}
                    opacity={0.6}
                />
            )}

            {/* Rings (Saturn/Uranus) */}
            {hasRings && (
                <mesh rotation={[1.6, 0, 0]} scale={isSelected ? 1.2 : 1}>
                    {/* Ring geometry: innerRadius, outerRadius, thetaSegments */}
                    <ringGeometry args={[3.5, 5.5, 64]} />
                    {/* If we have a ring texture, use it. Otherwise fallback to color. */}
                    <meshStandardMaterial
                        map={textures.ringMap || undefined}
                        color={textures.ringMap ? '#fff' : (planetId === 'saturn' ? '#cba' : '#acf')}
                        transparent
                        opacity={0.8}
                        side={DoubleSide}
                        blending={textures.ringMap ? 2 : 1} // 2 = AdditiveBlending, 1 = NormalBlending
                    />
                </mesh>
            )}

            {/* Label - Floating above */}
            {/* Label - Holographic 3D Text */}
            <Text
                position={[0, -3.5, 0]}
                fontSize={0.5}
                color={planet.isLocked ? "#888" : "#fff"}
                anchorX="center"
                anchorY="middle"
                // Default font used to avoid missing file crash
                outlineWidth={0.02}
                outlineColor="#000000"
                fillOpacity={planet.isLocked ? 0.5 : 0.9}
            >
                {planet.id.toUpperCase()} {planet.isLocked && '🔒'}
                <meshBasicMaterial toneMapped={false} />
            </Text>
        </group>
    );
};

