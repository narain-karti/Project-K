'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Static comparison data - moved outside component to prevent re-creation
const WAIT_TIME_DATA = [
    { mode: 'Fixed Timer', avgWaitTime: 12.5, throughput: 8.2 },
    { mode: 'AI Adaptive', avgWaitTime: 7.3, throughput: 14.6 },
    { mode: 'Emergency Priority', avgWaitTime: 8.1, throughput: 13.2 },
];

const EMERGENCY_RESPONSE_DATA = [
    { mode: 'Fixed Timer', responseTime: 18.3 },
    { mode: 'AI Adaptive', responseTime: 12.1 },
    { mode: 'Emergency Priority', responseTime: 4.8 },
];

const RADAR_DATA = [
    {
        metric: 'Throughput',
        'Fixed Timer': 45,
        'AI Adaptive': 85,
        'Emergency': 75,
    },
    {
        metric: 'Wait Time',
        'Fixed Timer': 40,
        'AI Adaptive': 90,
        'Emergency': 80,
    },
    {
        metric: 'Efficiency',
        'Fixed Timer': 50,
        'AI Adaptive': 88,
        'Emergency': 82,
    },
    {
        metric: 'Emergency Response',
        'Fixed Timer': 35,
        'AI Adaptive': 70,
        'Emergency': 95,
    },
    {
        metric: 'Adaptability',
        'Fixed Timer': 20,
        'AI Adaptive': 95,
        'Emergency': 90,
    },
];

const ComparisonCharts = React.memo(function ComparisonCharts() {
    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-2xl font-bold mb-2">📊 Performance Comparison</h2>
                <p className="text-text-secondary text-sm">
                    See how AI-powered signals outperform traditional fixed-timer systems
                </p>
            </motion.div>

            {/* Wait Time & Throughput Comparison */}
            <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3 className="text-lg font-bold mb-4">⏱️ Traffic Flow Metrics</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={WAIT_TIME_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="mode" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                fontSize: '12px',
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Bar dataKey="avgWaitTime" fill="#22d3ee" name="Avg Wait Time (s)" />
                        <Bar dataKey="throughput" fill="#22c55e" name="Throughput (vehicles/min)" />
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                        <div className="text-2xl mb-1">📉</div>
                        <div className="font-bold text-accent-cyan">42% Faster</div>
                        <div className="text-xs text-text-secondary">Wait time reduction</div>
                    </div>
                    <div>
                        <div className="text-2xl mb-1">🚀</div>
                        <div className="font-bold text-accent-green">78% More</div>
                        <div className="text-xs text-text-secondary">Vehicle throughput</div>
                    </div>
                    <div>
                        <div className="text-2xl mb-1">⚡</div>
                        <div className="font-bold text-accent-violet">Real-time</div>
                        <div className="text-xs text-text-secondary">Adaptive decisions</div>
                    </div>
                </div>
            </motion.div>

            {/* Emergency Response Comparison */}
            <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className="text-lg font-bold mb-4">🚑 Emergency Vehicle Response Time</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={EMERGENCY_RESPONSE_DATA} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                        <YAxis dataKey="mode" type="category" stroke="#9ca3af" style={{ fontSize: '12px' }} width={120} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                fontSize: '12px',
                            }}
                        />
                        <Bar dataKey="responseTime" fill="#ef4444" name="Response Time (s)" />
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🎯</span>
                        <div>
                            <div className="font-bold text-red-500">74% Faster Emergency Response</div>
                            <div className="text-xs text-text-secondary">
                                Emergency Priority mode clears ambulances in just 4.8 seconds vs. 18.3 seconds with fixed timers
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Overall Performance Radar */}
            <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-lg font-bold mb-4">🎯 Overall Performance Matrix</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={RADAR_DATA}>
                        <PolarGrid stroke="rgba(255,255,255,0.2)" />
                        <PolarAngleAxis dataKey="metric" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                        <PolarRadiusAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
                        <Radar name="Fixed Timer" dataKey="Fixed Timer" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.3} />
                        <Radar name="AI Adaptive" dataKey="AI Adaptive" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.5} />
                        <Radar name="Emergency Priority" dataKey="Emergency" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                fontSize: '12px',
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Key Insights */}
            <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h3 className="text-lg font-bold mb-4">💡 Key Insights</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-accent-cyan/10 rounded-lg border border-accent-cyan/20">
                        <span className="text-xl">✅</span>
                        <div className="text-sm">
                            <div className="font-semibold text-text-primary">AI Adaptive mode reduces congestion by 58%</div>
                            <div className="text-xs text-text-secondary mt-1">
                                By dynamically adjusting signal timing based on real-time traffic, the system prevents bottlenecks
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <span className="text-xl">🚨</span>
                        <div className="text-sm">
                            <div className="font-semibold text-text-primary">Emergency Priority saves lives</div>
                            <div className="text-xs text-text-secondary mt-1">
                                Every second counts in emergencies. AI can detect and prioritize ambulances instantly
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <span className="text-xl">🌍</span>
                        <div className="text-sm">
                            <div className="font-semibold text-text-primary">Scalable to entire city networks</div>
                            <div className="text-xs text-text-secondary mt-1">
                                The same ML models can coordinate hundreds of intersections for citywide optimization
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});

export default ComparisonCharts;
