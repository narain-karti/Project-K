'use client';

import { Decision } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface DecisionFlowProps {
    decisions: Decision[];
}

export default function DecisionFlow({ decisions }: DecisionFlowProps) {
    const latestDecision = decisions[0];

    return (
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-96 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-purple rounded-full animate-pulse" />
                AI Decision Flow
            </h2>

            {/* Latest Decision Highlight */}
            <AnimatePresence mode="wait">
                {latestDecision && (
                    <motion.div
                        key={latestDecision.timestamp}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`mb-4 p-4 rounded-lg border-l-4 ${latestDecision.type === 'ambulance-preempt'
                                ? 'bg-red-500/20 border-red-500'
                                : latestDecision.type === 'density-adjust'
                                    ? 'bg-purple-500/20 border-purple-500'
                                    : 'bg-blue-500/20 border-blue-500'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            {latestDecision.type === 'ambulance-preempt' && <span className="text-xl">🚨</span>}
                            {latestDecision.type === 'density-adjust' && <span className="text-xl">🧠</span>}
                            {latestDecision.type === 'normal-cycle' && <span className="text-xl">🔄</span>}
                            <span className="text-xs text-white/50">
                                {new Date(latestDecision.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                        <p className="text-sm text-white font-medium">{latestDecision.description}</p>
                        <div className="mt-2 flex gap-1">
                            {latestDecision.affectedLanes.map(lane => (
                                <span
                                    key={lane}
                                    className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70"
                                >
                                    {lane}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Decision History */}
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                <div className="text-xs text-white/50 mb-2">Recent History</div>
                {decisions.slice(1, 6).map((decision, index) => (
                    <div
                        key={decision.timestamp}
                        className="text-xs text-white/60 p-2 bg-white/5 rounded border border-white/5"
                    >
                        <div className="flex justify-between mb-1">
                            <span className="font-medium">
                                {decision.type === 'ambulance-preempt' ? '🚨' : decision.type === 'density-adjust' ? '🧠' : '🔄'}
                            </span>
                            <span className="text-white/40">
                                {new Date(decision.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                        <p className="text-white/50">{decision.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
