'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, MapPin, TrendingUp, Activity, AlertTriangle, Clock, Zap, ChevronDown, Calendar, FileDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DetectionStorage, DetectionRecord } from '@/lib/detectionStorage';
import * as XLSX from 'xlsx';

export default function DashboardPage() {
    const [detections, setDetections] = useState<DetectionRecord[]>([]);
    const [filteredDetections, setFilteredDetections] = useState<DetectionRecord[]>([]);
    const [filters, setFilters] = useState({
        className: 'all',
        minConfidence: 0,
        maxConfidence: 1,
        timeRange: 24 // hours
    });
    const [showFilters, setShowFilters] = useState(false);

    // Load detections on mount and set up auto-refresh
    useEffect(() => {
        loadDetections();
        const interval = setInterval(loadDetections, 5000); // Refresh every 5s
        return () => clearInterval(interval);
    }, []);

    // Apply filters whenever they change
    useEffect(() => {
        applyFilters();
    }, [detections, filters]);

    const loadDetections = () => {
        const all = DetectionStorage.getAllDetections();
        setDetections(all);
    };

    const applyFilters = () => {
        const now = Date.now();
        const timeThreshold = now - (filters.timeRange * 60 * 60 * 1000);

        let filtered = detections.filter(d => d.timestamp >= timeThreshold);

        if (filters.className !== 'all') {
            filtered = filtered.filter(d => d.className === filters.className);
        }

        filtered = filtered.filter(d =>
            d.confidence >= filters.minConfidence &&
            d.confidence <= filters.maxConfidence
        );

        setFilteredDetections(filtered);
    };

    // Calculate statistics
    const stats = useMemo(() => {
        const total = filteredDetections.length;
        const accidents = filteredDetections.filter(d => d.isAccident).length;
        const avgConf = total > 0
            ? filteredDetections.reduce((sum, d) => sum + d.confidence, 0) / total
            : 0;

        const now = Date.now();
        const oneHourAgo = now - 60 * 60 * 1000;
        const lastHour = filteredDetections.filter(d => d.timestamp >= oneHourAgo);
        const detectionRate = lastHour.length / 60; // per minute

        return {
            total,
            accidents,
            avgConfidence: avgConf,
            detectionRate,
            normalDetections: total - accidents
        };
    }, [filteredDetections]);

    // Prepare time series data
    const timeSeriesData = useMemo(() => {
        const buckets: Record<string, { time: string; detections: number; accidents: number }> = {};

        filteredDetections.forEach(d => {
            const date = new Date(d.timestamp);
            const timeKey = `${date.getHours()}:00`;

            if (!buckets[timeKey]) {
                buckets[timeKey] = { time: timeKey, detections: 0, accidents: 0 };
            }

            buckets[timeKey].detections++;
            if (d.isAccident) buckets[timeKey].accidents++;
        });

        return Object.values(buckets).sort((a, b) =>
            parseInt(a.time) - parseInt(b.time)
        );
    }, [filteredDetections]);

    // Get unique classes for filter
    const uniqueClasses = useMemo(() => {
        const classes = new Set(detections.map(d => d.className));
        return ['all', ...Array.from(classes)];
    }, [detections]);

    // Heatmap data (mock locations for demo)
    const heatmapData = useMemo(() => {
        return filteredDetections.map(d => ({
            lat: d.location.lat,
            lng: d.location.lng,
            intensity: d.isAccident ? 1 : 0.3
        }));
    }, [filteredDetections]);

    // Export to CSV
    const exportCSV = () => {
        const csv = DetectionStorage.exportToCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project-k-detections-${Date.now()}.csv`;
        a.click();
    };

    // Export to Excel
    const exportExcel = () => {
        const data = filteredDetections.map(d => ({
            ID: d.id,
            Timestamp: d.timestamp,
            Date: new Date(d.timestamp).toISOString(),
            Class: d.className,
            Confidence: d.confidence,
            Latitude: d.location.lat,
            Longitude: d.location.lng,
            IsAccident: d.isAccident ? 'Yes' : 'No'
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Detections');
        XLSX.writeFile(wb, `project-k-analytics-${Date.now()}.xlsx`);
    };

    return (
        <main className="min-h-screen pt-24 px-6 md:px-12 pb-12 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent-rose/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
            </div>

            <div className="container mx-auto max-w-7xl space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent-teal via-accent-purple to-accent-rose bg-clip-text text-transparent">
                            Analytics Dashboard
                        </h1>
                        <p className="text-text-secondary mt-2">Real-time detection insights and performance metrics</p>
                    </div>

                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowFilters(!showFilters)}
                            className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-all"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={exportCSV}
                            className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            CSV
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={exportExcel}
                            className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 bg-gradient-to-r from-accent-teal/20 to-accent-purple/20 hover:from-accent-teal/30 hover:to-accent-purple/30 transition-all"
                        >
                            <FileDown className="w-4 h-4" />
                            Excel
                        </motion.button>
                    </div>
                </motion.div>

                {/* Filters Panel */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Detection Class</label>
                                <select
                                    value={filters.className}
                                    onChange={(e) => setFilters({ ...filters, className: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-teal"
                                >
                                    {uniqueClasses.map(c => (
                                        <option key={c} value={c} className="bg-black">{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Min Confidence</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={filters.minConfidence}
                                    onChange={(e) => setFilters({ ...filters, minConfidence: parseFloat(e.target.value) })}
                                    className="w-full"
                                />
                                <span className="text-sm text-text-secondary">{(filters.minConfidence * 100).toFixed(0)}%</span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Max Confidence</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={filters.maxConfidence}
                                    onChange={(e) => setFilters({ ...filters, maxConfidence: parseFloat(e.target.value) })}
                                    className="w-full"
                                />
                                <span className="text-sm text-text-secondary">{(filters.maxConfidence * 100).toFixed(0)}%</span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Time Range</label>
                                <select
                                    value={filters.timeRange}
                                    onChange={(e) => setFilters({ ...filters, timeRange: parseInt(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-teal"
                                >
                                    <option value={1} className="bg-black">Last Hour</option>
                                    <option value={6} className="bg-black">Last 6 Hours</option>
                                    <option value={24} className="bg-black">Last 24 Hours</option>
                                    <option value={168} className="bg-black">Last Week</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Detections"
                        value={stats.total}
                        icon={<Activity className="w-6 h-6" />}
                        color="from-blue-500 to-cyan-500"
                        delay={0}
                    />
                    <StatsCard
                        title="Accident Alerts"
                        value={stats.accidents}
                        icon={<AlertTriangle className="w-6 h-6" />}
                        color="from-red-500 to-orange-500"
                        delay={0.1}
                    />
                    <StatsCard
                        title="Avg Confidence"
                        value={`${(stats.avgConfidence * 100).toFixed(1)}%`}
                        icon={<TrendingUp className="w-6 h-6" />}
                        color="from-green-500 to-emerald-500"
                        delay={0.2}
                    />
                    <StatsCard
                        title="Detection Rate"
                        value={`${stats.detectionRate.toFixed(1)}/min`}
                        icon={<Zap className="w-6 h-6" />}
                        color="from-purple-500 to-pink-500"
                        delay={0.3}
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Time Series Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-accent-teal" />
                            Detection Timeline
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={timeSeriesData}>
                                <defs>
                                    <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#32B8C6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#32B8C6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAccidents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="time" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <Area type="monotone" dataKey="detections" stroke="#32B8C6" fillOpacity={1} fill="url(#colorDetections)" />
                                <Area type="monotone" dataKey="accidents" stroke="#EF4444" fillOpacity={1} fill="url(#colorAccidents)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Heatmap Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-accent-rose" />
                            Accident Hotspots
                        </h3>
                        <div className="relative h-[300px] bg-gradient-to-br from-black/50 to-black/20 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-12 h-12 text-accent-rose mx-auto mb-3 opacity-50" />
                                <p className="text-text-secondary text-sm">
                                    {filteredDetections.length} locations tracked
                                </p>
                                <p className="text-xs text-text-secondary mt-2">
                                    Heatmap visualization ready for deployment
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Alert History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-card rounded-2xl p-6"
                >
                    <h3 className="text-xl font-bold mb-4">Alert History</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredDetections.slice().reverse().slice(0, 50).map((detection, idx) => (
                            <motion.div
                                key={detection.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                className={`p-4 rounded-lg border ${detection.isAccident
                                        ? 'bg-red-500/10 border-red-500/30'
                                        : 'bg-white/5 border-white/10'
                                    } hover:bg-white/10 transition-all`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            {detection.isAccident && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                            <span className="font-medium capitalize">{detection.className}</span>
                                            <span className="text-xs text-text-secondary">
                                                {new Date(detection.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-secondary">
                                            Confidence: {(detection.confidence * 100).toFixed(1)}% •
                                            Location: {detection.location.lat.toFixed(4)}, {detection.location.lng.toFixed(4)}
                                        </p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${detection.isAccident
                                            ? 'bg-red-500/20 text-red-400'
                                            : 'bg-green-500/20 text-green-400'
                                        }`}>
                                        {detection.isAccident ? 'Accident' : 'Normal'}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {filteredDetections.length === 0 && (
                            <div className="text-center py-12 text-text-secondary">
                                <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>No detection data available</p>
                                <p className="text-sm mt-2">Start the demo to generate analytics</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

// Animated Stats Card Component
function StatsCard({ title, value, icon, color, delay }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="glass-card rounded-2xl p-6 relative overflow-hidden group"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-20`}>
                        {icon}
                    </div>
                </div>
                <h3 className="text-text-secondary text-sm mb-1">{title}</h3>
                <p className="text-3xl font-bold">{value}</p>
            </div>
        </motion.div>
    );
}
