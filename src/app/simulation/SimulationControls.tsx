'use client';

import { motion } from 'framer-motion';
import type { SimulationConfig, TrafficMode } from './types';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useSound } from './sounds';

interface Props {
    config: SimulationConfig;
    onConfigChange: (newConfig: Partial<SimulationConfig>) => void;
    onReset: () => void;
}

export default function SimulationControls({ config, onConfigChange, onReset }: Props) {
    const sound = useSound();

    const handlePlayPause = () => {
        if (config.isRunning) {
            sound.playStop();
        } else {
            sound.playStart();
        }
        onConfigChange({ isRunning: !config.isRunning });
    };

    const handleReset = () => {
        sound.playReset();
        onReset();
    };

    const handleTrafficIntensityChange = (value: number) => {
        sound.playSlide();
        onConfigChange({ trafficIntensity: value });
    };

    const handleAmbulanceFrequencyChange = (value: number) => {
        sound.playSlide();
        onConfigChange({ ambulanceFrequency: value });
    };

    const handleModeChange = (mode: TrafficMode) => {
        if (config.mode !== mode) {
            sound.playMode();
            onConfigChange({ mode });
        }
    };

    const handleSpeedChange = (speed: number) => {
        if (config.speed !== speed) {
            sound.playToggle();
            onConfigChange({ speed });
        }
    };

    return (
        <div className="space-y-4">
            {/* Play/Pause/Reset Controls */}
            <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3 className="text-lg font-bold mb-4 text-accent-cyan">Simulation Controls</h3>
                <div className="flex gap-3">
                    <button
                        onClick={handlePlayPause}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all interactive ${config.isRunning
                                ? 'bg-accent-orange/20 text-accent-orange border border-accent-orange/40'
                                : 'bg-accent-green/20 text-accent-green border border-accent-green/40'
                            }`}
                    >
                        {config.isRunning ? (
                            <>
                                <Pause className="w-4 h-4" />
                                Pause
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                Play
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-4 py-3 rounded-lg font-semibold bg-red-500/20 text-red-500 border border-red-500/40 transition-all interactive flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                </div>
            </motion.div>

            {/* Traffic Intensity */}
            <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className="text-lg font-bold mb-4">🚗 Traffic Intensity</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm text-text-secondary">
                        <span>Low</span>
                        <span className="font-bold text-text-primary">{config.trafficIntensity} cars/min</span>
                        <span>Heavy</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="60"
                        step="5"
                        value={config.trafficIntensity}
                        onChange={(e) => handleTrafficIntensityChange(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: `linear-gradient(to right, #22d3ee 0%, #22d3ee ${((config.trafficIntensity - 10) / 50) * 100}%, rgba(255,255,255,0.1) ${((config.trafficIntensity - 10) / 50) * 100}%, rgba(255,255,255,0.1) 100%)`,
                        }}
                    />
                    <div className="flex justify-between text-xs text-text-secondary">
                        <span>10</span>
                        <span>35</span>
                        <span>60</span>
                    </div>
                </div>
            </motion.div>

            {/* Ambulance Frequency */}
            <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-lg font-bold mb-4">🚑 Ambulance Frequency</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm text-text-secondary">
                        <span>None</span>
                        <span className="font-bold text-text-primary">{config.ambulanceFrequency}%</span>
                        <span>Frequent</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="40"
                        step="5"
                        value={config.ambulanceFrequency}
                        onChange={(e) => handleAmbulanceFrequencyChange(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(config.ambulanceFrequency / 40) * 100}%, rgba(255,255,255,0.1) ${(config.ambulanceFrequency / 40) * 100}%, rgba(255,255,255,0.1) 100%)`,
                        }}
                    />
                    <div className="flex justify-between text-xs text-text-secondary">
                        <span>0%</span>
                        <span>20%</span>
                        <span>40%</span>
                    </div>
                </div>
            </motion.div>

            {/* AI Mode Selection */}
            <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h3 className="text-lg font-bold mb-4">🧠 AI Mode</h3>
                <div className="space-y-2">
                    {(['fixed', 'adaptive', 'emergency'] as TrafficMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => handleModeChange(mode)}
                            className={`w-full px-4 py-3 rounded-lg text-left transition-all interactive ${config.mode === mode
                                    ? 'bg-accent-violet/30 border border-accent-violet/60 text-text-primary'
                                    : 'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10'
                                }`}
                        >
                            <div className="font-semibold">
                                {mode === 'fixed' && '⏱️ Fixed Timer'}
                                {mode === 'adaptive' && '🎯 AI Adaptive'}
                                {mode === 'emergency' && '🚨 Emergency Priority'}
                            </div>
                            <div className="text-xs mt-1 opacity-80">
                                {mode === 'fixed' && 'Traditional timed signals'}
                                {mode === 'adaptive' && 'Smart traffic-based switching'}
                                {mode === 'emergency' && 'Prioritize ambulances'}
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Simulation Speed */}
            <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h3 className="text-lg font-bold mb-4">⚡ Speed</h3>
                <div className="grid grid-cols-4 gap-2">
                    {[0.5, 1, 2, 4].map((speed) => (
                        <button
                            key={speed}
                            onClick={() => handleSpeedChange(speed)}
                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all interactive ${config.speed === speed
                                    ? 'bg-accent-cyan/30 border border-accent-cyan/60 text-accent-cyan'
                                    : 'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10'
                                }`}
                        >
                            {speed}x
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
