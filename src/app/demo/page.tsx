'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import VideoAnalyzer from '@/components/VideoAnalyzer';


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

export default function DemoPage() {
    return (
        <main className="min-h-screen pt-24 px-6 md:px-12 pb-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="container mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Live Demo</h1>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto italic">Experience Project K's AI-powered video analysis in real-time</p>
                    </div>

                    {/* Main Content Card - Video Upload Analysis */}
                    <motion.div
                        className="glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative z-10"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Content Area */}
                        <div className="p-6 bg-black/20 min-h-[600px]">
                            <VideoAnalyzer />
                        </div>
                    </motion.div>

                    {/* Incident Detection Log */}
                    <div className="mt-16 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 gpu-optimize shadow-2xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-accent-teal/20 flex items-center justify-center">
                                <Activity className="w-6 h-6 text-accent-teal" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">Incident Detection Log</h2>
                                <p className="text-text-secondary">Historical analysis of detected events</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-white/5">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Time</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Type</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Confidence</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Description</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Frame #</th>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </motion.div>
        </main>
    );
}
