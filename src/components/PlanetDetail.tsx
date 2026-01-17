'use client';

import { motion } from 'framer-motion';
import { Planet } from '../types/planet';
import { useTranslations } from 'next-intl';
import { Button } from './ui/Button';

interface PlanetDetailProps {
    planet: Planet;
    poi?: NonNullable<Planet['pointsOfInterest']>[0];
    onBack: () => void;
}

export const PlanetDetail = ({ planet, poi, onBack }: PlanetDetailProps) => {
    const t = useTranslations('Planets');
    const tContent = useTranslations(); // Access to root for dynamic keys

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center p-8 overflow-y-auto"
        >
            <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
                {/* Planet Hero */}
                <motion.div
                    layoutId={`planet-${planet.id}`}
                    className="text-[12rem] md:text-[15rem] leading-none drop-shadow-2xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    {planet.icon}
                </motion.div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl md:text-6xl font-black text-white mb-8 tracking-wider"
                    >
                        {poi ? poi.label : t(planet.translationKey)}
                    </motion.h1>

                    <div className="space-y-6">
                        {poi ? (
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="bg-yellow-500/20 backdrop-blur-sm p-8 rounded-2xl border border-yellow-400/50"
                            >
                                <p className="text-3xl text-yellow-100 font-bold">
                                    {poi.fact}
                                </p>
                            </motion.div>
                        ) : (
                            planet.facts.map((factKey, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.2 }}
                                    className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
                                >
                                    <p className="text-2xl text-slate-100">
                                        {tContent(factKey)}
                                    </p>
                                </motion.div>
                            ))
                        )}
                    </div>

                    <div className="mt-12 flex justify-center md:justify-start">
                        <Button onClick={onBack} variant="primary" className="text-2xl py-6 px-12">
                            {poi ? "✨ Keep Exploring" : "⬅ Back to Space"}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
