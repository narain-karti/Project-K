'use client';

import { ReactNode } from 'react';

interface MetricCardProps {
    title: string;
    value: string | number | ReactNode;
    change?: string;
    icon: ReactNode;
    trend?: 'up' | 'down' | 'neutral';
}

export default function MetricCard({ title, value, change, icon, trend = 'neutral' }: MetricCardProps) {
    const trendColors = {
        up: 'text-green-500',
        down: 'text-red-500',
        neutral: 'text-text-secondary'
    };

    return (
        <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className="text-text-secondary text-sm font-medium">{title}</div>
                <div className="text-accent-teal">{icon}</div>
            </div>
            <div className="text-3xl font-bold mb-2">{value}</div>
            {change && (
                <div className={`text-sm ${trendColors[trend]}`}>
                    {change}
                </div>
            )}
        </div>
    );
}
