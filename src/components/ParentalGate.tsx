'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface ParentalGateProps {
    isOpen: boolean;
    onClose: () => void;
    onUnlock: () => void;
    title?: string;
}

export const ParentalGate = ({ isOpen, onClose, onUnlock, title = "For Parents" }: ParentalGateProps) => {
    const [isPressing, setIsPressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    const REQUIRED_TIME = 3000; // 3 seconds

    useEffect(() => {
        if (isPressing) {
            startTimeRef.current = Date.now();
            const interval = setInterval(() => {
                const elapsed = Date.now() - startTimeRef.current;
                const p = Math.min((elapsed / REQUIRED_TIME) * 100, 100);
                setProgress(p);

                if (p >= 100) {
                    clearInterval(interval);
                    onUnlock();
                    // Reset
                    setIsPressing(false);
                    setProgress(0);
                }
            }, 50);
            timerRef.current = interval;
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPressing, onUnlock]);

    const handleStart = () => setIsPressing(true);
    const handleEnd = () => {
        setIsPressing(false);
        setProgress(0);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
            >
                <div className="glass-panel p-8 rounded-super max-w-sm w-full text-center border-none">
                    <h2 className="text-2xl font-black mb-4 text-white drop-shadow-md">{title}</h2>
                    <p className="text-slate-200 mb-8 font-medium">Hold the button for 3 seconds to unlock.</p>

                    <div className="relative flex justify-center">
                        <button
                            onMouseDown={handleStart}
                            onMouseUp={handleEnd}
                            onMouseLeave={handleEnd}
                            onTouchStart={handleStart}
                            onTouchEnd={handleEnd}
                            className={clsx(
                                "w-24 h-24 rounded-full flex items-center justify-center text-3xl select-none shadow-xl",
                                "bg-action-green active:scale-95 transition-transform"
                            )}
                        >
                            🔒
                        </button>

                        {/* Progress Ring */}
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none transform -rotate-90" style={{ width: 96, height: 96 }}>
                            <circle
                                stroke="white"
                                strokeWidth="4"
                                fill="transparent"
                                r="44"
                                cx="48"
                                cy="48"
                                className="opacity-20"
                            />
                            <circle
                                stroke="#4ADE80"
                                strokeWidth="6"
                                fill="transparent"
                                r="44"
                                cx="48"
                                cy="48"
                                strokeDasharray={276}
                                strokeDashoffset={276 - (276 * progress) / 100}
                                className="transition-all duration-75 drop-shadow-glow"
                            />
                        </svg>
                    </div>

                    <button onClick={onClose} className="mt-8 text-sm text-slate-400 underline">
                        Cancel
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
