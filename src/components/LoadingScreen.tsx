'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
    title?: string;
    subtitle?: string;
    accent?: string; // e.g., "text-cyan-500"
    onComplete?: () => void;
}

export default function LoadingScreen({
    title = "INITIALIZING",
    subtitle = "Loading...",
    accent = "text-indigo-500",
    onComplete
}: LoadingScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) setTimeout(onComplete, 500); // Wait for exit animation
        }, 2000); // 2 seconds load time
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center">
                        {/* Custom Spinner */}
                        <div className={`w-16 h-16 border-t-2 ${accent.replace('text-', 'border-')} rounded-full animate-spin mx-auto mb-6`} />
                        <h1 className={`text-2xl font-light tracking-[0.2em] font-mono uppercase ${accent}`}>
                            {title}
                        </h1>
                        <p className="text-xs text-white/30 mt-2 font-mono tracking-widest uppercase animate-pulse">
                            {subtitle}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
