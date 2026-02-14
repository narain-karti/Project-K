'use client';

import { motion } from 'framer-motion';
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
                    <div className="mb-8">
                        <h1 className="text-5xl font-bold mb-4">Live Demo</h1>
                        <p className="text-text-secondary text-lg">Experience Project K's AI-powered video analysis in real-time</p>
                    </div>

                    {/* Main Content Card - Video Upload Analysis */}
                    <motion.div
                        className="glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative z-10"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Header Section */}
                        <div className="p-8 border-b border-white/5 bg-white/5 backdrop-blur-md">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl p-2 rounded-lg bg-blue-500/10">📹</span>
                                    <div>
                                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                            Video Analysis Dashboard
                                        </h2>
                                        <p className="text-text-secondary text-sm mt-1">
                                            Upload and analyze video files for traffic incidents
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 bg-black/20 min-h-[600px]">
                            <VideoAnalyzer />
                        </div>
                    </motion.div>

                    {/* Incident Detection Log - RESTORED */}
                    <div className="glass-card rounded-2xl p-6 mb-12 mt-8 group hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:border-accent-teal/40 hover:bg-gradient-to-br hover:from-accent-teal/5 hover:to-transparent transition-all duration-300">
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

                    {/* Interactive Scenarios - RESTORED */}
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
