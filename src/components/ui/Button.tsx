'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
    variant?: 'primary' | 'secondary' | 'locked';
    children: ReactNode;
    className?: string; // Add explicit className definition
}

export const Button = ({ variant = 'primary', className, children, ...props }: ButtonProps) => {
    const variants = {
        primary: "bg-action-green/80 text-white shadow-action-green/50 border-white/20 backdrop-blur-md",
        secondary: "bg-slate-800/60 text-white shadow-slate-900/50 border-white/10 backdrop-blur-sm",
        locked: "bg-slate-900/40 text-slate-500 cursor-not-allowed border-slate-700/50 backdrop-blur-sm",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={clsx(
                "rounded-super font-black py-4 px-8 text-xl shadow-lg border-2 select-none relative overflow-hidden",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};
