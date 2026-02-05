'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoAnalyzer from '@/components/VideoAnalyzer';
import ESP32LiveFeed from '@/components/ESP32LiveFeed';


type DemoMode = 'upload' | 'esp32';

export default function DemoPage() {

    const [demoMode, setDemoMode] = useState<DemoMode>('upload');

    const scenarios = [
        {
            title: "Accident Detection",
            description: "Simulate a traffic accident and see real-time AI detection",
            icon: "🚗💥",
        },
        {
            title: "Emergency Vehicle Priority",
            description: "Watch how ambulances get automatic signal clearance",
            icon: "🚑🚦",
        },
        {
            title: "Pothole Detection",
            description: "Infrastructure defect classification with severity levels",
            icon: "🕳️⚠️",
        },
    ];

    const incidents = [
        { time: "00:00:45", type: "Accident", confidence: "94.6%", desc: "2-vehicle collision", frame: 1350 },
        { time: "00:01:32", type: "Emergency", confidence: "98.1%", desc: "Ambulance approaching", frame: 2760 },
        { time: "00:02:13", type: "Defect", confidence: "91.2%", desc: "Pothole - High severity", frame: 3990 },
    ];

    return (
        <main className="min-h-screen pt-24 px-6 md:px-12 pb-12">

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="container mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-5xl font-bold mb-4">Live Demo</h1>
                        <p className="text-text-secondary text-lg">Experience Project K's AI-powered video analysis in real-time</p>
                    </div>

                    {/* Mode Selector Tabs */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                onClick={() => setDemoMode('upload')}
                                className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all ${demoMode === 'upload'
                                    ? 'bg-accent-cyan/20 border-accent-cyan/50 shadow-[0_0_20px_rgba(45,212,191,0.3)]'
                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="text-3xl">📹</span>
                                <div className="text-left">
                                    <div className="font-bold">Video Upload</div>
                                    <div className="text-xs text-text-secondary">Upload & analyze video files</div>
                                </div>
                            </motion.button>

                            <motion.button
                                onClick={() => setDemoMode('esp32')}
                                className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all ${demoMode === 'esp32'
                                    ? 'bg-accent-violet/20 border-accent-violet/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="text-3xl">📡</span>
                                <div className="text-left">
                                    <div className="font-bold flex items-center gap-2">
                                        ESP32-CAM Live
                                        <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded-full animate-pulse">
                                            NEW
                                        </span>
                                    </div>
                                    <div className="text-xs text-text-secondary">Real-time IoT camera feed</div>
                                </div>
                            </motion.button>
                        </div>
                    </div>

                    {/* Content based on mode */}
                    <AnimatePresence mode="wait">
                        {demoMode === 'upload' ? (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Main Video Area */}
                                <div className="mb-12">
                                    <VideoAnalyzer />
                                </div>

                                {/* Incident Detection Log */}
                                <div className="glass-card rounded-2xl p-6 mb-12 group hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:border-accent-teal/40 hover:bg-gradient-to-br hover:from-accent-teal/5 hover:to-transparent transition-all duration-300">
                                    <h3 className="text-xl font-bold mb-4">Incident Detection Log</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/10">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Time</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Type</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Confidence</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Description</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Frame #</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {incidents.map((incident, index) => (
                                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td className="py-3 px-4 text-sm">{incident.time}</td>
                                                        <td className="py-3 px-4 text-sm">
                                                            <span className={`px-2 py-1 rounded text-xs ${incident.type === 'Accident' ? 'bg-red-500/20 text-red-500' :
                                                                incident.type === 'Emergency' ? 'bg-yellow-500/20 text-yellow-500' :
                                                                    'bg-orange-500/20 text-orange-500'
                                                                }`}>
                                                                {incident.type}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm font-bold text-green-500">{incident.confidence}</td>
                                                        <td className="py-3 px-4 text-sm text-text-secondary">{incident.desc}</td>
                                                        <td className="py-3 px-4 text-sm">{incident.frame}</td>
                                                        <td className="py-3 px-4 text-sm">
                                                            <button className="text-accent-teal hover:underline interactive">View →</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="esp32"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* ESP32 Live Feed */}
                                <ESP32LiveFeed />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Interactive Scenarios */}
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold mb-8">Try Interactive Scenarios</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {scenarios.map((scenario, index) => (
                                <motion.div
                                    key={index}
                                    className={`glass-card rounded-2xl p-8 interactive cursor-pointer group transition-all duration-300 ${index === 0 ? "hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:border-red-500/40 hover:bg-gradient-to-br hover:from-red-500/10" :
                                        index === 1 ? "hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:border-green-500/40 hover:bg-gradient-to-br hover:from-green-500/10" :
                                            "hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:border-amber-500/40 hover:bg-gradient-to-br hover:from-amber-500/10"
                                        } hover:to-transparent`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="text-5xl mb-4">{scenario.icon}</div>
                                    <h3 className="text-xl font-bold mb-3">{scenario.title}</h3>
                                    <p className="text-text-secondary text-sm mb-4">{scenario.description}</p>
                                    <button className="text-accent-teal font-semibold text-sm">Simulate →</button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

        </main>
    );
}
