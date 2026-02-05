'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

import TrafficSimulation3D from './TrafficSimulation3D';
import SimulationControls from './SimulationControls';
import MetricsDashboard from './MetricsDashboard';
import AIDecisionFlow from './AIDecisionFlow';
import SignalSwitchLog from './SignalSwitchLog';
import TrafficScenarios from './TrafficScenarios';
import ComparisonCharts from './ComparisonCharts';
import { useSound } from './sounds';
import type { SimulationConfig, SimulationMetrics, AIDecision, Direction } from './types';

export default function SimulationPage() {

    const sound = useSound();
    const [config, setConfig] = useState<SimulationConfig>({
        trafficIntensity: 25,
        ambulanceFrequency: 15,
        mode: 'adaptive',
        speed: 1,
        isRunning: false,
    });

    const [metrics, setMetrics] = useState<SimulationMetrics>({
        averageWaitTime: 0,
        totalVehiclesProcessed: 0,
        throughput: 0,
        signalEfficiency: 0,
        ambulanceResponseTime: 0,
        ambulancesProcessed: 0,
        timeSaved: 0,
    });

    const [currentDecision, setCurrentDecision] = useState<AIDecision | null>(null);
    const [currentScenario, setCurrentScenario] = useState<string | undefined>();
    const [latestSignalSwitch, setLatestSignalSwitch] = useState<{
        from: Direction;
        to: Direction;
        reason: string;
    } | undefined>();

    const handleConfigChange = useCallback((newConfig: Partial<SimulationConfig>) => {
        setConfig((prev) => ({ ...prev, ...newConfig }));
    }, []);

    const handleScenarioSelect = useCallback((scenarioConfig: {
        trafficIntensity: number;
        ambulanceFrequency: number;
        mode: 'fixed' | 'adaptive' | 'emergency'
    }) => {
        setConfig(prev => ({
            ...prev,
            ...scenarioConfig,
        }));
    }, []);

    const handleReset = useCallback(() => {
        setConfig({
            trafficIntensity: 25,
            ambulanceFrequency: 15,
            mode: 'adaptive',
            speed: 1,
            isRunning: false,
        });
        setMetrics({
            averageWaitTime: 0,
            totalVehiclesProcessed: 0,
            throughput: 0,
            signalEfficiency: 0,
            ambulanceResponseTime: 0,
            ambulancesProcessed: 0,
            timeSaved: 0,
        });
        setCurrentDecision(null);
        setLatestSignalSwitch(undefined);
        window.location.reload();
    }, []);

    const handleMetricsUpdate = useCallback((newMetrics: SimulationMetrics) => {
        setMetrics(newMetrics);
    }, []);

    const handleDecisionUpdate = useCallback((decision: AIDecision) => {
        setCurrentDecision(decision);
    }, []);

    const handleSignalSwitch = useCallback((from: Direction, to: Direction, reason: string) => {
        setLatestSignalSwitch({ from, to, reason });
    }, []);

    return (
        <main className="min-h-screen pt-24 px-6 md:px-12 pb-12">

            <motion.div
                className="container mx-auto max-w-[1800px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="mb-8">
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-rose"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        3D Traffic AI Simulation 🚦
                    </motion.h1>
                    <motion.p
                        className="text-text-secondary text-lg max-w-3xl"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        Experience AI-powered traffic optimization in immersive 3D. Watch smart signals
                        prioritize by vehicle count and emergency vehicles in real-time.
                    </motion.p>
                </div>

                {/* Main Simulation Area - 3 Column Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
                    {/* Left Column - Controls & Scenarios */}
                    <div className="xl:col-span-3 space-y-4">
                        <TrafficScenarios
                            onSelectScenario={handleScenarioSelect}
                            currentScenario={currentScenario}
                        />
                        <SimulationControls
                            config={config}
                            onConfigChange={handleConfigChange}
                            onReset={handleReset}
                        />
                        <MetricsDashboard metrics={metrics} />
                    </div>

                    {/* Center Column - 3D Simulation */}
                    <div className="xl:col-span-6">
                        <motion.div
                            className="glass-card rounded-2xl p-6"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">🎮 3D Live Simulation</h2>
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <span>🎯 Drag to rotate</span>
                                    <span>•</span>
                                    <span>🔍 Scroll to zoom</span>
                                </div>
                            </div>
                            <TrafficSimulation3D
                                config={config}
                                onMetricsUpdate={handleMetricsUpdate}
                                onDecisionUpdate={handleDecisionUpdate}
                                onSignalSwitch={handleSignalSwitch}
                            />
                            <div className="mt-4 p-4 bg-white/5 rounded-lg">
                                <div className="text-xs text-text-secondary mb-2">Vehicle Legend</div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-3 bg-blue-500 rounded"></div>
                                        <span>Regular Car</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-3 bg-white rounded border-2 border-red-500"></div>
                                        <span>🚑 Ambulance</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-3 bg-amber-500 rounded"></div>
                                        <span>Truck</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span>Green Signal</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Signal Switch Log */}
                    <div className="xl:col-span-3">
                        <SignalSwitchLog latestSwitch={latestSignalSwitch} />
                    </div>
                </div>

                {/* AI Decision Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <AIDecisionFlow decision={currentDecision} />
                    <div>
                        <motion.div
                            className="glass-card rounded-2xl p-6 mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h3 className="text-xl font-bold mb-4">🎬 How It Works</h3>
                            <div className="space-y-3">
                                <div className="p-4 bg-gradient-to-r from-accent-cyan/20 to-transparent rounded-lg border border-accent-cyan/30">
                                    <div className="font-semibold mb-2">1️⃣ Vehicle Count Priority</div>
                                    <div className="text-sm text-text-secondary">
                                        AI monitors each direction and prioritizes the lane with the most waiting vehicles
                                    </div>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-red-500/20 to-transparent rounded-lg border border-red-500/30">
                                    <div className="font-semibold mb-2">2️⃣ Emergency Override</div>
                                    <div className="text-sm text-text-secondary">
                                        When an ambulance approaches, AI immediately switches to clear its path
                                    </div>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-accent-violet/20 to-transparent rounded-lg border border-accent-violet/30">
                                    <div className="font-semibold mb-2">3️⃣ Adaptive Timing</div>
                                    <div className="text-sm text-text-secondary">
                                        Green light duration adjusts based on queue length - longer for crowded lanes
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            className="glass-card rounded-2xl p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-xl font-bold mb-4">⚡ 3D Technology</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-3 p-2 bg-white/5 rounded">
                                    <span className="text-lg">🎮</span>
                                    <div>
                                        <div className="font-semibold">React Three Fiber</div>
                                        <div className="text-xs text-text-secondary">Three.js for React</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-2 bg-white/5 rounded">
                                    <span className="text-lg">🧊</span>
                                    <div>
                                        <div className="font-semibold">Low-Poly 3D Models</div>
                                        <div className="text-xs text-text-secondary">Optimized for performance</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-2 bg-white/5 rounded">
                                    <span className="text-lg">🎥</span>
                                    <div>
                                        <div className="font-semibold">Interactive Camera</div>
                                        <div className="text-xs text-text-secondary">Rotate, pan, and zoom</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-2 bg-white/5 rounded">
                                    <span className="text-lg">💡</span>
                                    <div>
                                        <div className="font-semibold">Dynamic Lighting</div>
                                        <div className="text-xs text-text-secondary">Realistic shadows & glow</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Comparison Charts Section */}
                <ComparisonCharts />

                {/* Call to Action */}
                <motion.div
                    className="mt-12 glass-card rounded-2xl p-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-2xl font-bold mb-3">Ready to Deploy City-Wide?</h3>
                    <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
                        This simulation shows just one intersection. Imagine the impact across an entire city network.
                        Project K can reduce traffic deaths, save emergency response time, and make roads safer for everyone.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => sound.playClick()}
                            className="px-6 py-3 bg-accent-cyan text-black font-bold rounded-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all interactive"
                        >
                            View Full Dashboard →
                        </button>
                        <button
                            onClick={() => sound.playClick()}
                            className="px-6 py-3 bg-white/10 border border-white/20 font-semibold rounded-lg hover:bg-white/20 transition-all interactive"
                        >
                            Download Whitepaper
                        </button>
                    </div>
                </motion.div>
            </motion.div>

        </main>
    );
}
