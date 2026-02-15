'use client';

import { Brain, Zap, Shield, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';


export default function TechnologyPage() {

    const aiModels = [
        {
            name: "Accident Detection",
            architecture: "YOLO v11",
            accuracy: "94.6%",
            latency: "<200ms",
            classes: "5 accident types",
        },
        {
            name: "Vehicle Classification",
            architecture: "YOLO v11 Multi-class",
            accuracy: "96%",
            latency: "<180ms",
            classes: "Car, Bike, Truck, Bus, Auto, Pedestrian",
        },
        {
            name: "Infrastructure Defect",
            architecture: "Custom CNN",
            accuracy: "91% precision, 87% recall",
            latency: "<150ms",
            classes: "Pothole, Crack, Waterlogging",
        },
        {
            name: "Emergency Vehicle",
            architecture: "Audio-Visual Fusion",
            accuracy: "98% siren detection",
            latency: "<100ms",
            classes: "Police, Ambulance, Fire",
        },
    ];

    const competitors = [
        { feature: "Detection Speed", pureCloud: "5-15 min", pureEdge: "<500ms", navigation: "N/A", projectK: "<2 sec" },
        { feature: "Cloud Failure", pureCloud: "0% uptime", pureEdge: "100%", navigation: "0%", projectK: "85-90%" },
        { feature: "Cost/City/Year", pureCloud: "₹2-5 cr", pureEdge: "₹50 cr", navigation: "₹50L", projectK: "₹15-27L" },
        { feature: "Network Optim.", pureCloud: "Yes", pureEdge: "No", navigation: "Partial", projectK: "Yes" },
        { feature: "Privacy", pureCloud: "Poor", pureEdge: "Good", navigation: "Poor", projectK: "Excellent" },
    ];

    return (
        <main className="min-h-screen pt-24 px-6 md:px-12 pb-12">

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-12">
                        <h1 className="text-5xl font-bold mb-4">Technology</h1>
                        <p className="text-text-secondary text-lg">Deep dive into our hybrid edge-cloud architecture and AI models</p>
                    </div>

                    {/* 3-Tier Architecture */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-8">3-Tier Hybrid Architecture</h2>
                        <div className="glass-card rounded-3xl p-8 md:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Tier 1: Edge */}
                                <div className="relative">
                                    <div className="absolute -top-4 left-4 bg-accent-teal text-white text-xs px-3 py-1 rounded-full">TIER 1</div>
                                    <div className="glass-card rounded-2xl p-6 mt-4 group hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:border-accent-teal/40 group-hover:bg-gradient-to-br group-hover:from-accent-teal/10 group-hover:to-transparent transition-all duration-300">
                                        <Zap className="w-12 h-12 text-accent-teal mb-4" />
                                        <h3 className="text-xl font-bold mb-3">Edge Processing</h3>
                                        <ul className="space-y-2 text-sm text-text-secondary">
                                            <li>• Real-time AI inference</li>
                                            <li>• Autonomous decision-making</li>
                                            <li>• Local caching (72h data)</li>
                                            <li>• 85-90% efficiency offline</li>
                                            <li>• <span className="text-green-500 font-bold">&lt;2s</span> detection</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Tier 2: Cloud */}
                                <div className="relative">
                                    <div className="absolute -top-4 left-4 bg-accent-purple text-white text-xs px-3 py-1 rounded-full">TIER 2</div>
                                    <div className="glass-card rounded-2xl p-6 mt-4 group hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:border-accent-purple/40 group-hover:bg-gradient-to-br group-hover:from-accent-purple/10 group-hover:to-transparent transition-all duration-300">
                                        <Brain className="w-12 h-12 text-accent-purple mb-4" />
                                        <h3 className="text-xl font-bold mb-3">Cloud Intelligence</h3>
                                        <ul className="space-y-2 text-sm text-text-secondary">
                                            <li>• Network-wide optimization</li>
                                            <li>• Continuous model training</li>
                                            <li>• Historical analytics</li>
                                            <li>• Pattern recognition</li>
                                            <li>• <span className="text-purple-500 font-bold">OTA</span> model updates</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Tier 3: Override */}
                                <div className="relative">
                                    <div className="absolute -top-4 left-4 bg-accent-orange text-white text-xs px-3 py-1 rounded-full">TIER 3</div>
                                    <div className="glass-card rounded-2xl p-6 mt-4 group hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:border-accent-orange/40 group-hover:bg-gradient-to-br group-hover:from-accent-orange/10 group-hover:to-transparent transition-all duration-300">
                                        <Shield className="w-12 h-12 text-accent-orange mb-4" />
                                        <h3 className="text-xl font-bold mb-3">Dynamic Override</h3>
                                        <ul className="space-y-2 text-sm text-text-secondary">
                                            <li>• Intelligent coordination</li>
                                            <li>• Emergency routing</li>
                                            <li>• Graceful degradation</li>
                                            <li>• Failover capability</li>
                                            <li>• <span className="text-orange-500 font-bold">99.5%</span> uptime</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* AI Models */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-8">AI Model Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {aiModels.map((model, index) => (
                                <div key={index} className="glass-card rounded-2xl p-6 group hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:border-accent-teal/40 hover:bg-gradient-to-br hover:from-accent-teal/10 hover:to-transparent transition-all duration-300">
                                    <h3 className="text-xl font-bold mb-4">{model.name}</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Architecture</span>
                                            <span className="font-medium">{model.architecture}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Accuracy</span>
                                            <span className="font-bold text-green-500">{model.accuracy}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Latency</span>
                                            <span className="font-bold text-accent-teal">{model.latency}</span>
                                        </div>
                                        <div className="pt-2 border-t border-white/10">
                                            <span className="text-text-secondary">Classes:</span>
                                            <p className="text-xs text-text-primary mt-1">{model.classes}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* Competitive Comparison */}
                    <section>
                        <h2 className="text-3xl font-bold mb-8">Competitive Comparison</h2>
                        <div className="glass-card rounded-2xl p-6 overflow-x-auto group hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:border-accent-teal/40 hover:bg-gradient-to-br hover:from-accent-teal/5 hover:to-transparent transition-all duration-300">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="text-left py-4 px-4 text-sm font-bold">Feature</th>
                                        <th className="text-left py-4 px-4 text-sm font-bold">Pure Cloud</th>
                                        <th className="text-left py-4 px-4 text-sm font-bold">Pure Edge</th>
                                        <th className="text-left py-4 px-4 text-sm font-bold">Navigation</th>
                                        <th className="text-left py-4 px-4 text-sm font-bold bg-accent-teal/10 rounded-lg">Project K</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {competitors.map((row, index) => (
                                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4 text-sm font-medium">{row.feature}</td>
                                            <td className="py-4 px-4 text-sm text-text-secondary">{row.pureCloud}</td>
                                            <td className="py-4 px-4 text-sm text-text-secondary">{row.pureEdge}</td>
                                            <td className="py-4 px-4 text-sm text-text-secondary">{row.navigation}</td>
                                            <td className="py-4 px-4 text-sm font-bold text-green-500">{row.projectK}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </motion.div>

        </main>
    );
}
