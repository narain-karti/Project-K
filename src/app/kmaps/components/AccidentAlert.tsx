'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Navigation, X } from 'lucide-react';

interface AccidentAlertProps {
    onRedirect: () => void;
    onContinue: () => void;
}

export default function AccidentAlert({ onRedirect, onContinue }: AccidentAlertProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md glass-card border border-red-500/30 bg-black/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl z-10"
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 animate-pulse">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">Accident Detected!</h3>
                    <p className="text-sm text-gray-300 mb-4">
                        An accident has been reported <span className="text-accent-amber font-bold">50 meters ahead</span> on your current route.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onRedirect}
                            className="flex-1 bg-accent-cyan hover:bg-accent-cyan/80 text-black font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                            <Navigation className="w-4 h-4" />
                            Redirect
                        </button>
                        <button
                            onClick={onContinue}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-xl transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
