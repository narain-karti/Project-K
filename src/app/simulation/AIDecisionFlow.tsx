'use client';

import { motion } from 'framer-motion';
import type { AIDecision, Direction } from './types';
import { useEffect, useState } from 'react';

interface Props {
    decision: AIDecision | null;
}

export default function AIDecisionFlow({ decision }: Props) {
    const [decisionHistory, setDecisionHistory] = useState<AIDecision[]>([]);

    useEffect(() => {
        if (decision) {
            setDecisionHistory((prev) => [decision, ...prev].slice(0, 5));
        }
    }, [decision]);

    // Helper to get active direction (supports both property names)
    const getActiveDirection = (d: AIDecision): Direction | undefined => {
        return d.activeDirection || d.selectedDirection;
    };

    // Helper to get reasoning (supports both property names)
    const getReasoning = (d: AIDecision): string => {
        return d.reasoning || d.reason || 'No reasoning provided';
    };

    // Helper to get queue scores (supports both property names)
    const getQueueScores = (d: AIDecision): Record<Direction, number> | undefined => {
        return d.queueScores || d.priorityScores;
    };

    // Helper to get green duration (supports both property names)
    const getGreenDuration = (d: AIDecision): number => {
        return d.suggestedGreenDuration || d.signalDuration || 15;
    };

    return (
        <div className="space-y-6">
            {/* Current Decision */}
            <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 className="text-xl font-bold mb-4 text-accent-violet">🧠 AI Decision Process</h3>

                {decision ? (
                    <div className="space-y-4">
                        {/* Active Direction */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-accent-violet/20 to-transparent rounded-lg border border-accent-violet/30">
                            <div>
                                <div className="text-xs text-text-secondary mb-1">Active Direction</div>
                                <div className="text-2xl font-bold capitalize">{getActiveDirection(decision)}</div>
                            </div>
                            <div className="text-4xl">
                                {getActiveDirection(decision) === 'north' && '⬆️'}
                                {getActiveDirection(decision) === 'south' && '⬇️'}
                                {getActiveDirection(decision) === 'east' && '➡️'}
                                {getActiveDirection(decision) === 'west' && '⬅️'}
                            </div>
                        </div>

                        {/* Action (from 3D simulation) */}
                        {decision.action && (
                            <div className="p-4 bg-accent-cyan/10 rounded-lg border border-accent-cyan/30">
                                <div className="text-xs text-text-secondary mb-1">Current Action</div>
                                <div className="text-lg font-semibold text-accent-cyan">{decision.action}</div>
                            </div>
                        )}

                        {/* Reasoning */}
                        <div className="p-4 bg-white/5 rounded-lg">
                            <div className="text-xs text-text-secondary mb-2">Decision Reasoning</div>
                            <div className="text-sm text-text-primary">{getReasoning(decision)}</div>
                        </div>

                        {/* Queue Scores */}
                        {getQueueScores(decision) && (
                            <div>
                                <div className="text-xs text-text-secondary mb-3">Priority Scores by Direction</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(getQueueScores(decision)!).map(([dir, score]) => (
                                        <div
                                            key={dir}
                                            className={`p-3 rounded-lg border transition-all ${dir === getActiveDirection(decision)
                                                ? 'bg-accent-cyan/20 border-accent-cyan/40'
                                                : 'bg-white/5 border-white/10'
                                                }`}
                                        >
                                            <div className="text-xs capitalize text-text-secondary">{dir}</div>
                                            <div className="text-lg font-bold">{typeof score === 'number' ? score.toFixed(0) : score}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Emergency Override Badge */}
                        {decision.emergencyOverride && (
                            <motion.div
                                className="p-3 bg-red-500/20 border border-red-500/40 rounded-lg flex items-center gap-3"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring' }}
                            >
                                <span className="text-2xl">🚨</span>
                                <div>
                                    <div className="font-bold text-red-500">Emergency Override Active</div>
                                    <div className="text-xs text-text-secondary">Prioritizing ambulance passage</div>
                                </div>
                            </motion.div>
                        )}

                        {/* Signal Duration */}
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="text-sm text-text-secondary">Green Signal Duration</div>
                            <div className="text-lg font-bold text-green-500">
                                {getGreenDuration(decision)}s
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-text-secondary">
                        <div className="text-4xl mb-3">🤖</div>
                        <div>Start the simulation to see AI decisions...</div>
                    </div>
                )}
            </motion.div>

            {/* Decision History Log */}
            {decisionHistory.length > 0 && (
                <motion.div
                    className="glass-card rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-lg font-bold mb-4">📜 Recent Decisions</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                        {decisionHistory.map((d, index) => (
                            <motion.div
                                key={d.timestamp}
                                className="p-3 bg-white/5 rounded-lg text-sm border border-white/10"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="font-semibold capitalize text-text-primary mb-1">
                                            {getActiveDirection(d)} - {getGreenDuration(d)}s
                                        </div>
                                        <div className="text-xs text-text-secondary">{getReasoning(d)}</div>
                                    </div>
                                    {d.emergencyOverride && (
                                        <span className="text-lg">🚨</span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* How AI Works Section */}
            <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-lg font-bold mb-4">💡 How the AI Decides</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">📊</span>
                        <div>
                            <div className="font-semibold text-text-primary">Real-time Data Analysis</div>
                            <div className="text-xs text-text-secondary">
                                Monitors queue lengths, traffic density, and wait times for each direction
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🎯</span>
                        <div>
                            <div className="font-semibold text-text-primary">Priority Scoring</div>
                            <div className="text-xs text-text-secondary">
                                Calculates priority scores based on congestion and waiting vehicles
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🚑</span>
                        <div>
                            <div className="font-semibold text-text-primary">Emergency Detection</div>
                            <div className="text-xs text-text-secondary">
                                Instantly detects ambulances and clears path with maximum green time
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚡</span>
                        <div>
                            <div className="font-semibold text-text-primary">Adaptive Timing</div>
                            <div className="text-xs text-text-secondary">
                                Adjusts signal duration (8-30s) based on current traffic conditions
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
