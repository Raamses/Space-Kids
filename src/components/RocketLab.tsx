'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
// import { useTranslations } from 'next-intl';

export default function RocketLab({ onBack }: { onBack: () => void }) {
    // const t = useTranslations('RocketLab'); // Need to add to messages
    const [hullColor, setHullColor] = useState('fill-blue-500');
    const [wings] = useState<'basic' | 'advanced'>('basic');

    const colors = [
        { name: 'Blue', class: 'fill-blue-500' },
        { name: 'Red', class: 'fill-red-500' },
        { name: 'Green', class: 'fill-emerald-500' },
        { name: 'Purple', class: 'fill-purple-500' },
    ];

    return (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl text-white font-bold mb-8">Rocket Lab 🚀</h1>

            {/* ROCKET PREVIEW */}
            <div className="w-64 h-64 bg-slate-800 rounded-full flex items-center justify-center mb-8 border-4 border-slate-700">
                <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-xl overflow-visible">
                    {/* Flames */}
                    <motion.path
                        d="M40,85 Q50,110 60,85"
                        className="fill-orange-500"
                        animate={{ scaleY: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 0.2, repeat: Infinity, repeatType: 'reverse' }}
                    />

                    {/* WINGS */}
                    {wings === 'basic' ? (
                        <path d="M20,80 L30,60 L70,60 L80,80" className="fill-slate-400" />
                    ) : (
                        <path d="M10,85 L30,50 L70,50 L90,85 L50,90 Z" className="fill-yellow-500" />
                    )}

                    {/* HULL */}
                    <path d="M30,80 L30,40 Q50,10 70,40 L70,80 Z" className={hullColor} />

                    {/* WINDOW */}
                    <circle cx="50" cy="45" r="10" className="fill-blue-200" />
                </svg>
            </div>

            {/* CONTROLS */}
            <div className="flex gap-4 mb-12">
                {colors.map(c => (
                    <button
                        key={c.name}
                        onClick={() => setHullColor(c.class)}
                        className={`w-12 h-12 rounded-full border-4 border-white/20 ${c.class.replace('fill-', 'bg-')}`}
                    />
                ))}
            </div>

            <div className="flex gap-4">
                <Button onClick={onBack} variant="secondary">Exit</Button>
                <Button onClick={() => alert('Launching!')}>Launch!</Button>
            </div>
        </div>
    );
}
