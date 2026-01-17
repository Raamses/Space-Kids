'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { Planet } from '../types/planet';
import { useAnalytics } from '../hooks/useAnalytics';
import { useTranslations, useLocale } from 'next-intl';
import { ParentalGate } from './ParentalGate';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { PlanetDetail } from './PlanetDetail';
import RocketLab from './RocketLab';
import { Scene } from './Scene';
import { Planet3D } from './canvas/Planet3D';
import { CameraRig } from './canvas/CameraRig';
import planetsData from '../content/planets.json';

// Cast JSON to typed array
const planets = planetsData as Planet[];

// Gap between planets in 3D space
const PLANET_SPACING = 30;

function PlanetSystem({
    planets,
    onPlanetClick,
    isRtl,
    selectedPlanetId,
    isOrbitMode,
    onPoiClick
}: {
    planets: Planet[],
    onPlanetClick: (p: Planet) => void,
    isRtl: boolean,
    selectedPlanetId?: string,
    isOrbitMode?: boolean,
    onPoiClick?: (poi: NonNullable<Planet['pointsOfInterest']>[0]) => void
}) {
    // Determine direction multiplier: 1 for LTR (Move Right), -1 for RTL (Move Left)
    const direction = isRtl ? -1 : 1;

    return (
        <group>
            {planets.map((planet, index) => (
                <group
                    key={planet.id}
                    position={[index * PLANET_SPACING * direction, 0, 0]}
                >
                    <Planet3D
                        planet={planet}
                        onClick={onPlanetClick}
                        isSelected={planet.id === selectedPlanetId}
                        isInOrbitMode={isOrbitMode && planet.id === selectedPlanetId}
                        onPoiClick={onPoiClick}
                    />
                </group>
            ))}
        </group>
    );
}

export default function SolarSystem() {
    const { track } = useAnalytics();
    const t = useTranslations('LockedContent');
    const locale = useLocale();
    const isRtl = locale === 'he' || locale === 'ar';

    const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
    const [isOrbitMode, setIsOrbitMode] = useState(false);
    const [selectedPoi, setSelectedPoi] = useState<NonNullable<Planet['pointsOfInterest']>[0] | null>(null);

    const [isLockedOverlayOpen, setIsLockedOverlayOpen] = useState(false);
    const [isParentalGateOpen, setIsParentalGateOpen] = useState(false);
    const [showRocketLab, setShowRocketLab] = useState(false);

    const handlePlanetClick = (planet: Planet) => {
        track('planet_clicked', { planet: planet.id, locked: planet.isLocked });

        if (planet.isLocked) {
            setSelectedPlanet(planet);
            setIsLockedOverlayOpen(true);
        } else {
            setSelectedPlanet(planet);
            setIsOrbitMode(true);
            track('orbit_mode_entered', { planet: planet.id });
        }
    };

    const handlePoiClick = (poi: NonNullable<Planet['pointsOfInterest']>[0]) => {
        track('poi_discovered', { id: poi.id, planet: selectedPlanet?.id });
        setSelectedPoi(poi);
    };

    const handleUnlockRequest = () => {
        track('unlock_requested', { planet: selectedPlanet?.id });
        setIsLockedOverlayOpen(false);
        setIsParentalGateOpen(true);
    };

    const handleGateUnlock = () => {
        track('gate_success', { planet: selectedPlanet?.id });
        setIsParentalGateOpen(false);
        alert("Expansion Pack Store would open here!");
    };

    const handleBackToSystem = () => {
        setIsOrbitMode(false);
        setSelectedPlanet(null);
        setSelectedPoi(null);
    };

    const selectedPlanetIndex = selectedPlanet
        ? planets.findIndex(p => p.id === selectedPlanet.id)
        : null;

    if (showRocketLab) {
        return <RocketLab onBack={() => setShowRocketLab(false)} />;
    }

    return (
        <div
            className="relative w-full h-screen bg-slate-950 overflow-hidden flex flex-col"
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            {/* 2D UI Overlay Layer (Absolute) */}
            <div className="absolute top-4 inset-inline-start-4 z-50 flex gap-4">
                {!isOrbitMode && (
                    <Button onClick={() => setShowRocketLab(true)} className="bg-purple-600 border-purple-800">
                        🚀 Build Ship
                    </Button>
                )}

                {isOrbitMode && (
                    <Button onClick={handleBackToSystem} className="bg-slate-700 border-slate-500">
                        ⬅ Back to Solar System
                    </Button>
                )}
            </div>

            {/* 3D Canvas Layer */}
            <div className="absolute inset-0 z-10">
                <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
                    <Scene>
                        <ScrollControls
                            pages={planets.length}
                            horizontal
                            damping={0.4}
                            distance={1}
                            enabled={true} // Keep enabled to preserve scroll state
                        >
                            <CameraRig
                                planetCount={planets.length}
                                planetSpacing={PLANET_SPACING}
                                isRtl={isRtl}
                                targetPlanetIndex={selectedPlanetIndex}
                                isZoomed={isOrbitMode}
                            />
                            <PlanetSystem
                                planets={planets}
                                onPlanetClick={handlePlanetClick}
                                isRtl={isRtl}
                                selectedPlanetId={selectedPlanet?.id}
                                isOrbitMode={isOrbitMode}
                                onPoiClick={handlePoiClick}
                            />
                        </ScrollControls>
                    </Scene>
                </Canvas>
            </div>

            {/* Gentle Denial Overlay */}
            <AnimatePresence>
                {isLockedOverlayOpen && selectedPlanet && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="glass-panel rounded-super p-8 max-w-sm w-full text-center"
                        >
                            <div className="text-6xl mb-4">😴</div>
                            <h2 className="text-2xl font-black text-white mb-2 drop-shadow-md">{t('title')}</h2>
                            <p className="text-slate-200 mb-8 font-medium">{t('description')}</p>

                            <div className="flex flex-col gap-4">
                                <Button onClick={handleUnlockRequest} variant="primary">
                                    {t('unlock')} 🔒
                                </Button>
                                <button
                                    onClick={() => setIsLockedOverlayOpen(false)}
                                    className="text-slate-400 font-bold py-2 underline hover:text-white transition-colors"
                                >
                                    {t('keepPlaying')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Planet Detail View - ONLY for POIs now */}
            <AnimatePresence>
                {selectedPoi && selectedPlanet && !isParentalGateOpen && (
                    <PlanetDetail
                        planet={selectedPlanet}
                        poi={selectedPoi}
                        onBack={() => setSelectedPoi(null)}
                    />
                )}
            </AnimatePresence>

            <ParentalGate
                isOpen={isParentalGateOpen}
                onClose={() => setIsParentalGateOpen(false)}
                onUnlock={handleGateUnlock}
                title="Parental Control"
            />
        </div>
    );
}
