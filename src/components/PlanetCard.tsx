'use client';

import { motion } from 'framer-motion';
import { Planet } from '../types/planet';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

interface PlanetCardProps {
    planet: Planet;
    onClick: (planet: Planet) => void;
}

export const PlanetCard = ({ planet, onClick }: PlanetCardProps) => {
    const t = useTranslations('Planets');

    return (
        <motion.div
            layoutId={`planet-${planet.id}`}
            className="relative flex flex-col items-center justify-center min-w-[280px] h-[400px] snap-center p-4 focus:outline-none"
        >
            <motion.button
                onClick={() => onClick(planet)}
                className={clsx(
                    "relative w-64 h-64 rounded-full flex items-center justify-center text-8xl shadow-2xl",
                    planet.color,
                    // Red Team Fix: "Look but don't Touch". Remove grayscale.
                    // Just slightly dim it to show it's not fully active, but keep it pretty.
                    planet.isLocked && "brightness-90 saturate-[0.8]"
                )}
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                animate={{
                    y: [0, -12, 0],
                    rotate: planet.isLocked ? 0 : [0, 2, -2, 0]
                }}
            >
                {/* 
                   TODO: Replace emoji with 3D Assets later. 
                   For now, the emoji is the "texture".
                */}
                <span className="filter drop-shadow-lg">{planet.icon}</span>

                {planet.isLocked && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-4 -right-4 bg-locked-grey text-white p-3 rounded-full shadow-lg border-4 border-slate-900"
                    >
                        <span className="text-2xl">🔒</span>
                    </motion.div>
                )}
            </motion.button>

            <h3 className={clsx(
                "mt-8 text-3xl font-black tracking-wide text-soft-white drop-shadow-md",
                planet.isLocked && "text-slate-400"
            )}>
                {t(planet.translationKey)}
            </h3>
        </motion.div>
    );
};
