'use client';

import { Brain, Zap, Shield, DollarSign } from 'lucide-react';

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
        { feature: "Detection Speed", pureCloud: "5-15 min ⌛", pureEdge: "<500ms ⚡", navigation: "N/A ✗", projectK: "<2 sec ✓✓" },
        { feature: "Cloud Failure", pureCloud: "0% uptime ✗", pureEdge: "100% ✓", navigation: "0% ✗", projectK: "85-90% ✓✓" },
        { feature: "Cost/City/Year", pureCloud: "₹2-5 cr 💸", pureEdge: "₹50 cr 💸💸💸", navigation: "₹50L 💸", projectK: "₹15-27L ✓✓" },
        { feature: "Network Optim.", pureCloud: "Yes ✓", pureEdge: "No ✗", navigation: "Partial ~", projectK: "Yes ✓✓" },
        { feature: "Privacy", pureCloud: "Poor ⚠️", pureEdge: "Good ✓", navigation: "Poor ⚠️", projectK: "Excellent ✓✓" },
    ];

    return (
        <main className="min-h-screen pt-24 px-6 md:px-12 pb-12">
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
                                <div className="glass-card rounded-2xl p-6 mt-4">
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
                                <div className="glass-card rounded-2xl p-6 mt-4">
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
                                <div className="glass-card rounded-2xl p-6 mt-4">
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
                            <div key={index} className="glass-card rounded-2xl p-6">
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

                {/* Bandwidth Savings Calculator */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8">Bandwidth Savings Calculator</h2>
                    <div className="glass-card rounded-3xl p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-red-500">Traditional Cloud System</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span>Video streaming per camera</span>
                                        <span className="font-bold">8MB / 30s</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>10,000 cameras × 2,880 snapshots/day</span>
                                        <span className="font-bold">1.9 PB/month</span>
                                    </div>
                                    <div className="flex justify-between text-lg pt-4 border-t border-white/10">
                                        <span className="text-red-500 font-bold">Monthly Cost</span>
                                        <span className="text-red-500 font-bold">₹1.9 Cr</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-4 text-green-500">Project K System</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span>Metadata per node</span>
                                        <span className="font-bold">0.05MB / 30s</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>10,000 nodes × 2,880 outputs/day</span>
                                        <span className="font-bold">1.4 GB/month</span>
                                    </div>
                                    <div className="flex justify-between text-lg pt-4 border-t border-white/10">
                                        <span className="text-green-500 font-bold">Monthly Cost</span>
                                        <span className="text-green-500 font-bold">₹1.4 Lakhs</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <div className="inline-block glass-card px-8 py-4 rounded-2xl">
                                <div className="text-sm text-text-secondary mb-2">Annual Savings Per City</div>
                                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-500">
                                    ₹228 Crores
                                </div>
                                <div className="text-sm text-green-500 mt-2">99.94% bandwidth reduction</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Competitive Comparison */}
                <section>
                    <h2 className="text-3xl font-bold mb-8">Competitive Comparison</h2>
                    <div className="glass-card rounded-2xl p-6 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-4 px-4 text-sm font-bold">Feature</th>
                                    <th className="text-left py-4 px-4 text-sm font-bold">Pure Cloud</th>
                                    <th className="text-left py-4 px-4 text-sm font-bold">Pure Edge</th>
                                    <th className="text-left py-4 px-4 text-sm font-bold">Navigation</th>
                                    <th className="text-left py-4 px-4 text-sm font-bold bg-accent-teal/10 rounded-lg">Project K ✓</th>
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
        </main>
    );
}
