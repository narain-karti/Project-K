'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface StoryModeProps {
    isActive: boolean;
    step: number;
    onComplete: () => void;
}

const storySteps = [
    {
        title: 'Normal Traffic Flow',
        description: 'The intersection operates with standard AI-optimized signal timing based on vehicle density.',
        duration: 3000,
    },
    {
        title: 'Emergency Detected',
        description: '🚨 An ambulance has been detected approaching from the south lane.',
        duration: 2000,
    },
    {
        title: 'AI Analysis',
        description: 'The AI system identifies the emergency vehicle and calculates the optimal preemption strategy.',
        duration: 2500,
    },
    {
        title: 'Signal Preemption',
        description: 'Traffic signals are preempted to clear the path. South lane receives priority green light.',
        duration: 3000,
    },
    {
        title: 'Ambulance Passage',
        description: 'The ambulance passes through the intersection with minimal delay.',
        duration: 3000,
    },
    {
        title: 'Flow Restoration',
        description: 'AI resumes optimized traffic flow, adjusting signal timing based on current density.',
        duration: 2500,
    },
    {
        title: 'Mission Complete',
        description: '✓ Emergency response time reduced by 47%. Normal operations resumed.',
        duration: 3000,
    },
];

export default function StoryMode({ isActive, step, onComplete }: StoryModeProps) {
    if (!isActive) return null;

    const currentStep = storySteps[step] || storySteps[storySteps.length - 1];
    const isLastStep = step >= storySteps.length - 1;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none"
            >
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="bg-black/90 backdrop-blur-xl border-2 border-accent-teal/50 rounded-3xl p-8 max-w-2xl mx-4 shadow-2xl shadow-accent-teal/20 pointer-events-auto"
                >
                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-xs text-white/50 mb-2">
                            <span>Story Progress</span>
                            <span>{step + 1} / {storySteps.length}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-accent-teal to-accent-cyan"
                                initial={{ width: 0 }}
                                animate={{ width: `${((step + 1) / storySteps.length) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="text-center">
                        <motion.h2
                            key={`title-${step}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-3xl font-bold text-white mb-4"
                        >
                            {currentStep.title}
                        </motion.h2>
                        <motion.p
                            key={`desc-${step}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-white/80"
                        >
                            {currentStep.description}
                        </motion.p>
                    </div>

                    {/* Action Button */}
                    {isLastStep && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            onClick={onComplete}
                            className="mt-8 w-full py-3 px-6 bg-gradient-to-r from-accent-teal to-accent-cyan text-black font-bold rounded-lg hover:shadow-lg hover:shadow-accent-teal/50 transition-all"
                        >
                            Complete Story Mode
                        </motion.button>
                    )}

                    {/* Loading indicator for auto-advance */}
                    {!isLastStep && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex gap-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 bg-accent-teal rounded-full"
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
