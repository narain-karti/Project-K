'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Direction } from './types';

interface SignalSwitchEntry {
    id: number;
    timestamp: Date;
    from: Direction;
    to: Direction;
    reason: string;
}

interface Props {
    latestSwitch?: {
        from: Direction;
        to: Direction;
        reason: string;
    };
}

const directionColors: Record<Direction, string> = {
    north: '#3b82f6', // blue
    south: '#10b981', // green
    east: '#f59e0b', // amber
    west: '#8b5cf6', // purple
};

const directionEmoji: Record<Direction, string> = {
    north: '⬆️',
    south: '⬇️',
    east: '➡️',
    west: '⬅️',
};

export default function SignalSwitchLog({ latestSwitch }: Props) {
    const [entries, setEntries] = useState<SignalSwitchEntry[]>([]);
    const [entryId, setEntryId] = useState(0);

    useEffect(() => {
        if (latestSwitch) {
            const newEntry: SignalSwitchEntry = {
                id: entryId,
                timestamp: new Date(),
                from: latestSwitch.from,
                to: latestSwitch.to,
                reason: latestSwitch.reason,
            };
            setEntryId(prev => prev + 1);
            setEntries(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10
        }
    }, [latestSwitch]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    return (
        <motion.div
            className="glass-card rounded-2xl p-4 h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <h3 className="text-lg font-bold text-accent-cyan">🚦 Live Signal Switches</h3>
            </div>

            {entries.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                    <div className="text-4xl mb-2">🚦</div>
                    <p className="text-sm">Signal switches will appear here</p>
                    <p className="text-xs opacity-70">Start the simulation to see live updates</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {entries.map((entry, index) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -50, scale: 0.8 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 500,
                                    damping: 30,
                                    delay: index === 0 ? 0 : 0.1
                                }}
                                className={`p-3 rounded-lg border ${index === 0
                                        ? 'bg-gradient-to-r from-accent-cyan/20 to-accent-violet/20 border-accent-cyan/50'
                                        : 'bg-white/5 border-white/10'
                                    }`}
                            >
                                {/* Header with timestamp */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-text-secondary">
                                        {formatTime(entry.timestamp)}
                                    </span>
                                    {index === 0 && (
                                        <span className="text-xs px-2 py-0.5 bg-accent-cyan/30 text-accent-cyan rounded-full animate-pulse">
                                            LATEST
                                        </span>
                                    )}
                                </div>

                                {/* Direction transition */}
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-sm"
                                        style={{
                                            backgroundColor: `${directionColors[entry.from]}20`,
                                            color: directionColors[entry.from]
                                        }}
                                    >
                                        {directionEmoji[entry.from]} {entry.from.toUpperCase()}
                                    </div>

                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="text-xl"
                                    >
                                        →
                                    </motion.div>

                                    <div
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-sm"
                                        style={{
                                            backgroundColor: `${directionColors[entry.to]}20`,
                                            color: directionColors[entry.to]
                                        }}
                                    >
                                        {directionEmoji[entry.to]} {entry.to.toUpperCase()}
                                    </div>
                                </div>

                                {/* Reason */}
                                <div className={`text-xs p-2 rounded ${entry.reason.includes('Emergency')
                                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                        : 'bg-white/5 text-text-secondary'
                                    }`}>
                                    {entry.reason}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Stats */}
            {entries.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center p-2 bg-white/5 rounded">
                            <div className="text-text-secondary">Total Switches</div>
                            <div className="text-lg font-bold text-accent-cyan">{entries.length}</div>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded">
                            <div className="text-text-secondary">Emergency</div>
                            <div className="text-lg font-bold text-red-400">
                                {entries.filter(e => e.reason.includes('Emergency')).length}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-xs text-text-secondary mb-2">Direction Colors</div>
                <div className="grid grid-cols-2 gap-2">
                    {(['north', 'south', 'east', 'west'] as Direction[]).map(dir => (
                        <div key={dir} className="flex items-center gap-2 text-xs">
                            <div
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: directionColors[dir] }}
                            />
                            <span>{directionEmoji[dir]} {dir.charAt(0).toUpperCase() + dir.slice(1)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
