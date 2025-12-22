'use client';

import { Metrics } from '../../types';
import { useEffect, useState } from 'react';

interface MetricsDashboardProps {
    metrics: Metrics;
}

export default function MetricsDashboard({ metrics }: MetricsDashboardProps) {
    const [prevMetrics, setPrevMetrics] = useState(metrics);

    useEffect(() => {
        const timer = setTimeout(() => setPrevMetrics(metrics), 500);
        return () => clearTimeout(timer);
    }, [metrics]);

    const MetricCard = ({ label, value, unit, trend }: { label: string; value: number; unit: string; trend?: 'up' | 'down' }) => (
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-white/50 mb-1">{label}</div>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{value.toFixed(1)}</span>
                <span className="text-sm text-white/70">{unit}</span>
                {trend && (
                    <span className={`text-xs ${trend === 'down' ? 'text-green-400' : 'text-red-400'}`}>
                        {trend === 'down' ? '↓' : '↑'}
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-80 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Metrics
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <MetricCard
                    label="Avg Wait Time"
                    value={metrics.averageWaitTime}
                    unit="sec"
                    trend={metrics.averageWaitTime < prevMetrics.averageWaitTime ? 'down' : 'up'}
                />
                <MetricCard
                    label="Throughput"
                    value={metrics.throughput}
                    unit="v/min"
                />
                <MetricCard
                    label="AI Decisions"
                    value={metrics.aiDecisions}
                    unit="total"
                />
                <MetricCard
                    label="Active Vehicles"
                    value={metrics.totalVehicles}
                    unit="now"
                />
            </div>

            {/* Ambulance Response */}
            {metrics.ambulanceResponseTime > 0 && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
                    <div className="text-xs text-red-300 mb-1">🚨 Ambulance Response</div>
                    <div className="text-xl font-bold text-red-400">
                        {metrics.ambulanceResponseTime.toFixed(1)}s
                    </div>
                </div>
            )}

            {/* Mini chart placeholder */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-xs text-white/50 mb-2">Traffic Flow</div>
                <div className="h-16 flex items-end gap-1">
                    {Array.from({ length: 20 }).map((_, i) => {
                        const height = Math.random() * 100;
                        return (
                            <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-accent-teal to-accent-cyan rounded-t"
                                style={{ height: `${height}%` }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
