'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { SimulationMetrics } from './types';
import AnimatedCounter from '@/components/AnimatedCounter';

interface Props {
    metrics: SimulationMetrics;
}

export default function MetricsDashboard({ metrics }: Props) {
    const getTrend = (value: number, baseline: number) => {
        if (value > baseline * 1.1) return 'up';
        if (value < baseline * 0.9) return 'down';
        return 'stable';
    };

    const metricCards = [
        {
            label: 'Avg Wait Time',
            value: metrics.averageWaitTime.toFixed(1),
            unit: 's',
            trend: getTrend(metrics.averageWaitTime, 10),
            color: 'cyan',
            icon: '⏱️',
            improving: metrics.averageWaitTime < 8,
        },
        {
            label: 'Throughput',
            value: metrics.throughput.toFixed(1),
            unit: '/min',
            trend: getTrend(metrics.throughput, 10),
            color: 'green',
            icon: '🚗',
            improving: metrics.throughput > 12,
        },
        {
            label: 'Signal Efficiency',
            value: Math.min(100, metrics.signalEfficiency).toFixed(0),
            unit: '%',
            trend: getTrend(metrics.signalEfficiency, 50),
            color: 'violet',
            icon: '🎯',
            improving: metrics.signalEfficiency > 80,
        },
        {
            label: 'Vehicles Processed',
            value: metrics.totalVehiclesProcessed.toString(),
            unit: '',
            trend: 'up',
            color: 'blue',
            icon: '📊',
            improving: true,
        },
    ];

    const ambulanceMetrics = [
        {
            label: 'Ambulance Response',
            value: metrics.ambulanceResponseTime.toFixed(1),
            unit: 's',
            color: 'red',
            icon: '🚑',
            improving: metrics.ambulanceResponseTime < 5,
        },
        {
            label: 'Ambulances Cleared',
            value: metrics.ambulancesProcessed.toString(),
            unit: '',
            color: 'orange',
            icon: '✅',
            improving: true,
        },
    ];

    return (
        <div className="space-y-4">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3 className="text-lg font-bold mb-4 text-accent-cyan">📈 Live Metrics</h3>
            </motion.div>

            {/* Main Metrics */}
            <div className="space-y-3">
                {metricCards.map((metric, index) => (
                    <motion.div
                        key={metric.label}
                        className={`glass-card rounded-xl p-4 transition-all duration-300 ${metric.improving
                                ? 'hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:border-green-500/40'
                                : ''
                            }`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="text-xs text-text-secondary mb-1">{metric.label}</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-text-primary">
                                        {metric.value}
                                    </span>
                                    <span className="text-sm text-text-secondary">{metric.unit}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-xl">{metric.icon}</span>
                                {metric.trend === 'up' && (
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                )}
                                {metric.trend === 'down' && (
                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                )}
                                {metric.trend === 'stable' && (
                                    <Minus className="w-4 h-4 text-yellow-500" />
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Ambulance Metrics */}
            {metrics.ambulancesProcessed > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                >
                    <h4 className="text-sm font-bold mb-3 text-red-500">🚨 Emergency Response</h4>
                    <div className="space-y-3">
                        {ambulanceMetrics.map((metric, index) => (
                            <motion.div
                                key={metric.label}
                                className="glass-card rounded-xl p-4 border-red-500/20 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:border-red-500/40 transition-all duration-300"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="text-xs text-text-secondary mb-1">{metric.label}</div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-text-primary">
                                                {metric.value}
                                            </span>
                                            <span className="text-sm text-text-secondary">{metric.unit}</span>
                                        </div>
                                    </div>
                                    <span className="text-xl">{metric.icon}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Performance Indicator */}
            <motion.div
                className="glass-card rounded-xl p-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <div className="text-xs text-text-secondary mb-2">Overall Performance</div>
                <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-green rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                            width: `${Math.min(100, (metrics.signalEfficiency / 100) * 100)}%`,
                        }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <div className="text-xs text-text-secondary mt-1 text-right">
                    {metrics.signalEfficiency > 80 ? '🚀 Excellent!' : metrics.signalEfficiency > 50 ? '✅ Good' : '⚠️ Improving...'}
                </div>
            </motion.div>
        </div>
    );
}
