'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, AlertTriangle, TrendingUp, TrendingDown, Clock,
    Shield, Zap, Users, MapPin, Download, Filter, Bell,
    ArrowUp, ArrowDown, Circle, CheckCircle, XCircle,
    RefreshCw, Database, Wifi, Target
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from 'recharts';
import { useDetection } from '@/context/DetectionContext';
import AnimatedCounter from '@/components/AnimatedCounter';
import * as XLSX from 'xlsx';

// Demo data generators
const generateDemoData = () => {
    const now = Date.now();
    const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
        time: `${i.toString().padStart(2, '0')}:00`,
        detections: Math.floor(Math.random() * 100 + 50),
        accidents: Math.floor(Math.random() * 5),
        trafficDensity: Math.floor(Math.random() * 80 + 20),
        responseTime: Math.floor(Math.random() * 120 + 60)
    }));

    const locationData = [
        { zone: 'Zone A', accidents: 45, vehicles: 15234 },
        { zone: 'Zone B', accidents: 32, vehicles: 12456 },
        { zone: 'Zone C', accidents: 28, vehicles: 9876 },
        { zone: 'Zone D', accidents: 19, vehicles: 11234 },
        { zone: 'Zone E', accidents: 38, vehicles: 14567 }
    ];

    const vehicleTypes = [
        { name: 'Cars', value: 4562, color: '#00D9FF' },
        { name: 'Bikes', value: 3211, color: '#FF5E94' },
        { name: 'Trucks', value: 1234, color: '#FFD93D' },
        { name: 'Buses', value: 567, color: '#A78BFA' },
        { name: 'Pedestrians', value: 2345, color: '#34D399' }
    ];

    const performanceMetrics = [
        { subject: 'Detection Accuracy', A: 98, fullMark: 100 },
        { subject: 'Response Time', A: 92, fullMark: 100 },
        { subject: 'Network Uptime', A: 99.9, fullMark: 100 },
        { subject: 'Alert Precision', A: 95, fullMark: 100 },
        { subject: 'Coverage', A: 88, fullMark: 100 }
    ];

    const alerts = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        timestamp: now - i * 5 * 60 * 1000,
        type: i % 3 === 0 ? 'Accident' : i % 2 === 0 ? 'Hazard' : 'Traffic',
        severity: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
        location: `Node #${Math.floor(Math.random() * 1000)}`,
        description: [
            'Multi-vehicle collision detected',
            'Pothole causing traffic disruption',
            'Heavy congestion building up',
            'Ambulance priority routing active',
            'Emergency vehicle detected'
        ][Math.floor(Math.random() * 5)],
        confidence: 0.7 + Math.random() * 0.3
    }));

    const heatmapData = Array.from({ length: 50 }, (_, i) => ({
        lat: 28.6 + (Math.random() - 0.5) * 0.2,
        lng: 77.2 + (Math.random() - 0.5) * 0.2,
        intensity: Math.floor(Math.random() * 100)
    }));

    return { timeSeriesData, locationData, vehicleTypes, performanceMetrics, alerts, heatmapData };
};

export default function DashboardPage() {
    const { isHighConfidence, currentDetection, confidenceLevel } = useDetection();
    const [timeRange, setTimeRange] = useState('24h');
    const [classFilter, setClassFilter] = useState('all');
    const [confidenceRange, setConfidenceRange] = useState([0, 100]);
    const [showFilters, setShowFilters] = useState(false);

    const data = useMemo(() => generateDemoData(), []);
    const { timeSeriesData, locationData, vehicleTypes, performanceMetrics, alerts, heatmapData } = data;

    // Calculate statistics
    const stats = {
        totalDetections: 47853,
        activeNodes: 1234,
        avgResponseTime: 87,
        uptime: 99.94,
        accidents: 162,
        livesSaved: 1847
    };

    const exportToCSV = () => {
        const csvData = alerts.map(alert => ({
            Timestamp: new Date(alert.timestamp).toISOString(),
            Type: alert.type,
            Severity: alert.severity,
            Location: alert.location,
            Description: alert.description,
            Confidence: `${(alert.confidence * 100).toFixed(2)}%`
        }));

        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Alerts');
        XLSX.writeFile(wb, `project_k_alerts_${Date.now()}.csv`);
    };

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();

        // Alerts sheet
        const alertsWS = XLSX.utils.json_to_sheet(alerts.map(a => ({
            Timestamp: new Date(a.timestamp).toLocaleString(),
            Type: a.type,
            Severity: a.severity,
            Location: a.location,
            Description: a.description
        })));
        XLSX.utils.book_append_sheet(wb, alertsWS, 'Alerts');

        // Statistics sheet
        const statsWS = XLSX.utils.json_to_sheet([stats]);
        XLSX.utils.book_append_sheet(wb, statsWS, 'Statistics');

        XLSX.writeFile(wb, `project_k_dashboard_${Date.now()}.xlsx`);
    };

    const severityColors: Record<string, string> = {
        Critical: 'bg-red-500/20 border-red-500 text-red-500',
        High: 'bg-orange-500/20 border-orange-500 text-orange-500',
        Medium: 'bg-yellow-500/20 border-yellow-500 text-yellow-500',
        Low: 'bg-blue-500/20 border-blue-500 text-blue-500'
    };

    return (
        <main className="min-h-screen pt-24 px-4 md:px-8 pb-12 bg-gradient-to-br from-black via-purple-900/10 to-black relative overflow-hidden">
            {/* Animated background particles */}
            <div className="fixed inset-0 -z-10">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-accent-teal rounded-full"
                        animate={{
                            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                            opacity: [0.2, 0.8, 0.2]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                        style={{
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%'
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header - Centered */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-3">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-teal via-accent-purple to-accent-rose">
                            Project K Control Center
                        </span>
                    </h1>
                    <p className="text-text-secondary text-lg">Real-time traffic intelligence dashboard</p>
                </motion.div>

                {/* Real-time Alert Banner */}
                <AnimatePresence>
                    {isHighConfidence && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass-card border-red-500 bg-red-500/10 rounded-xl p-6"
                        >
                            <div className="flex items-center gap-4">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center"
                                >
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </motion.div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-red-500">REAL-TIME ALERT: {currentDetection}</h3>
                                    <p className="text-text-secondary">Confidence: {(confidenceLevel * 100).toFixed(1)}% | Actions being executed automatically</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Top Row: 4 Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            label: 'Active Nodes',
                            value: '847',
                            total: '/ 850',
                            subtitle: '+99.6% uptime',
                            icon: Wifi,
                            color: 'from-cyan-500 to-blue-500',
                            subtitleColor: 'text-green-500'
                        },
                        {
                            label: 'Detections (Last Hour)',
                            value: '1234567',
                            total: '',
                            subtitle: '+12.3% vs. avg',
                            icon: Activity,
                            color: 'from-purple-500 to-pink-500',
                            subtitleColor: 'text-green-500'
                        },
                        {
                            label: 'Emergency Incidents (Today)',
                            value: '23',
                            total: '',
                            subtitle: '-32% response time',
                            icon: AlertTriangle,
                            color: 'from-red-500 to-rose-500',
                            subtitleColor: 'text-green-500'
                        },
                        {
                            label: 'Bandwidth Savings',
                            value: '99.94%',
                            total: '',
                            subtitle: '+2.2 Cr monthly',
                            icon: Zap,
                            color: 'from-green-500 to-emerald-500',
                            subtitleColor: 'text-green-500'
                        }
                    ].map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="glass-card rounded-2xl p-6 relative overflow-hidden group"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-sm text-text-secondary">{stat.label}</span>
                                    <Icon className={`w-5 h-5 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                                </div>
                                <div className="text-3xl font-bold mb-1">
                                    {stat.value}
                                    {stat.total && <span className="text-lg text-text-secondary">{stat.total}</span>}
                                </div>
                                <div className={`text-xs ${stat.subtitleColor}`}>{stat.subtitle}</div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Charts Row: 2 Charts Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Detection Timeline */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-bold mb-6">Detection Timeline (Last 24h)</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={timeSeriesData}>
                                <defs>
                                    <linearGradient id="colorAccidents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF5E94" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#FF5E94" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FFD93D" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#FFD93D" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Area type="monotone" dataKey="accidents" stroke="#FF5E94" fillOpacity={1} fill="url(#colorAccidents)" name="Accidents" />
                                <Area type="monotone" dataKey="detections" stroke="#FFD93D" fillOpacity={1} fill="url(#colorIncidents)" name="Incidents" />
                                <Area type="monotone" dataKey="trafficDensity" stroke="#00D9FF" fillOpacity={1} fill="url(#colorVehicles)" name="Vehicles" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-2xl p-6"
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-accent-amber" />
                        Vehicle Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={vehicleTypes}
                                cx="50%"
                                cy="50%"
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* AI Model Performance */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="glass-card rounded-2xl p-6"
                                >
                                    <h3 className="text-xl font-bold mb-6">AI Model Performance</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Accidents', value: 96.6, color: 'bg-red-500' },
                                            { label: 'Vehicles', value: 96.1, color: 'bg-blue-500' },
                                            { label: 'Potholes', value: 91.3, color: 'bg-yellow-500' },
                                            { label: 'Emergency', value: 98.2, color: 'bg-green-500' }
                                        ].map((metric, idx) => (
                                            <div key={idx}>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span>{metric.label}</span>
                                                    <span className="font-bold">{metric.value}%</span>
                                                </div>
                                                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${metric.value}%` }}
                                                        transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                                                        className={`h-full ${metric.color}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Emergency Response */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="glass-card rounded-2xl p-6"
                                >
                                    <h3 className="text-xl font-bold mb-6">Emergency Response</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm text-text-secondary mb-1">Avg Response Time</div>
                                            <div className="text-4xl font-bold text-green-500">18.4 min</div>
                                            <div className="text-xs text-text-secondary">vs. 30 min (area)</div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                            <div>
                                                <div className="text-xs text-text-secondary mb-1">Active emergencies</div>
                                                <div className="text-2xl font-bold text-red-500">2 <span className="text-sm">LIVE</span></div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-text-secondary mb-1">Resolved today</div>
                                                <div className="text-2xl font-bold text-green-500">21</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-sm text-text-secondary">Detection accuracy</span>
                                            <span className="text-lg font-bold">98.2%</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Infrastructure Defects */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="glass-card rounded-2xl p-6"
                                >
                                    <h3 className="text-xl font-bold mb-6">Infrastructure Defects</h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'High severity', count: 345, color: 'text-red-500', dot: 'bg-red-500' },
                                            { label: 'Medium severity', count: 567, color: 'text-orange-500', dot: 'bg-orange-500' },
                                            { label: 'Low severity', count: 322, color: 'text-yellow-500', dot: 'bg-yellow-500' }
                                        ].map((severity, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${severity.dot}`} />
                                                    <span className="text-sm">{severity.label}</span>
                                                </div>
                                                <span className={`text-lg font-bold ${severity.color}`}>{severity.count}</span>
                                            </div>
                                        ))}
                                        <div className="pt-4 border-t border-white/10">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-text-secondary">Avg repair time</span>
                                                <span className="text-lg font-bold">4.2 days</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* System Activity Log */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="glass-card rounded-2xl p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold">System Activity Log (Real-time)</h3>
                                    <div className="flex gap-3">
                                        <select
                                            value={timeRange}
                                            onChange={(e) => setTimeRange(e.target.value)}
                                            className="glass-card px-4 py-2 rounded-lg border border-white/10 bg-black/20 text-sm"
                                        >
                                            <option value="all">All Events</option>
                                            <option value="accident">Accidents</option>
                                            <option value="emergency">Emergency</option>
                                            <option value="defect">Defects</option>
                                        </select>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={exportToCSV}
                                            className="glass-card px-4 py-2 rounded-lg border border-white/10 bg-black/20 text-sm hover:border-accent-teal transition-all"
                                        >
                                            Export CSV
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Activity Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10 text-left text-sm text-text-secondary">
                                                <th className="pb-3 font-medium">Time</th>
                                                <th className="pb-3 font-medium">Event Type</th>
                                                <th className="pb-3 font-medium">Severity</th>
                                                <th className="pb-3 font-medium">Description</th>
                                                <th className="pb-3 font-medium">Location</th>
                                                <th className="pb-3 font-medium text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alerts.slice(0, 8).map((alert, idx) => {
                                                const severityColor = {
                                                    'Critical': 'text-red-500',
                                                    'High': 'text-red-500',
                                                    'Medium': 'text-orange-500',
                                                    'Low': 'text-yellow-500',
                                                    'Info': 'text-blue-500'
                                                }[alert.severity] || 'text-blue-500';

                                                return (
                                                    <motion.tr
                                                        key={alert.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.8 + idx * 0.05 }}
                                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                                    >
                                                        <td className="py-4 text-sm">
                                                            {new Date(alert.timestamp).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit',
                                                                hour12: false
                                                            })}
                                                        </td>
                                                        <td className="py-4 text-sm">{alert.type}</td>
                                                        <td className={`py-4 text-sm font-bold ${severityColor}`}>{alert.severity}</td>
                                                        <td className="py-4 text-sm text-text-secondary max-w-xs truncate">{alert.description}</td>
                                                        <td className="py-4 text-sm text-accent-teal">{alert.location}</td>
                                                        <td className="py-4 text-right">
                                                            <button className="text-sm text-accent-teal hover:text-accent-cyan transition-colors">
                                                                View →
                                                            </button>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceMetrics}>
                                                <PolarGrid stroke="#ffffff20" />
                                                <PolarAngleAxis dataKey="subject" stroke="#888" />
                                                <PolarRadiusAxis stroke="#888" />
                                                <Radar name="Performance" dataKey="A" stroke="#34D399" fill="#34D399" fillOpacity={0.6} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </motion.div>
                                </div>

                                {/* Performance Cards - Matching Image Design */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* AI Model Performance */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="glass-card rounded-2xl p-6"
                                    >
                                        <h3 className="text-xl font-bold mb-6">AI Model Performance</h3>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Accidents', value: 96.6, color: 'bg-red-500' },
                                                { label: 'Vehicles', value: 96.1, color: 'bg-blue-500' },
                                                { label: 'Potholes', value: 91.3, color: 'bg-yellow-500' },
                                                { label: 'Emergency', value: 98.2, color: 'bg-green-500' }
                                            ].map((metric, idx) => (
                                                <div key={idx}>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span>{metric.label}</span>
                                                        <span className="font-bold">{metric.value}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${metric.value}%` }}
                                                            transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                                                            className={`h-full ${metric.color}`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Emergency Response */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="glass-card rounded-2xl p-6"
                                    >
                                        <h3 className="text-xl font-bold mb-6">Emergency Response</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-sm text-text-secondary mb-1">Avg Response Time</div>
                                                <div className="text-4xl font-bold text-green-500">18.4 min</div>
                                                <div className="text-xs text-text-secondary">vs. 30 min (area)</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                                <div>
                                                    <div className="text-xs text-text-secondary mb-1">Active emergencies</div>
                                                    <div className="text-2xl font-bold text-red-500">2 <span className="text-sm">LIVE</span></div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-text-secondary mb-1">Resolved today</div>
                                                    <div className="text-2xl font-bold text-green-500">21</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-sm text-text-secondary">Detection accuracy</span>
                                                <span className="text-lg font-bold">98.2%</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Infrastructure Defects */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                        className="glass-card rounded-2xl p-6"
                                    >
                                        <h3 className="text-xl font-bold mb-6">Infrastructure Defects</h3>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'High severity', count: 345, color: 'text-red-500', dot: 'bg-red-500' },
                                                { label: 'Medium severity', count: 567, color: 'text-orange-500', dot: 'bg-orange-500' },
                                                { label: 'Low severity', count: 322, color: 'text-yellow-500', dot: 'bg-yellow-500' }
                                            ].map((severity, idx) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-3 h-3 rounded-full ${severity.dot}`} />
                                                        <span className="text-sm">{severity.label}</span>
                                                    </div>
                                                    <span className={`text-lg font-bold ${severity.color}`}>{severity.count}</span>
                                                </div>
                                            ))}
                                            <div className="pt-4 border-t border-white/10">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-text-secondary">Avg repair time</span>
                                                    <span className="text-lg font-bold">4.2 days</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* System Activity Log */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="glass-card rounded-2xl p-6"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold">System Activity Log (Real-time)</h3>
                                        <div className="flex gap-3">
                                            <select
                                                value={timeRange}
                                                onChange={(e) => setTimeRange(e.target.value)}
                                                className="glass-card px-4 py-2 rounded-lg border border-white/10 bg-black/20 text-sm"
                                            >
                                                <option value="all">All Events</option>
                                                <option value="accident">Accidents</option>
                                                <option value="emergency">Emergency</option>
                                                <option value="defect">Defects</option>
                                            </select>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={exportToCSV}
                                                className="glass-card px-4 py-2 rounded-lg border border-white/10 bg-black/20 text-sm hover:border-accent-teal transition-all"
                                            >
                                                Export CSV
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Activity Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/10 text-left text-sm text-text-secondary">
                                                    <th className="pb-3 font-medium">Time</th>
                                                    <th className="pb-3 font-medium">Event Type</th>
                                                    <th className="pb-3 font-medium">Severity</th>
                                                    <th className="pb-3 font-medium">Description</th>
                                                    <th className="pb-3 font-medium">Location</th>
                                                    <th className="pb-3 font-medium text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {alerts.slice(0, 8).map((alert, idx) => {
                                                    const severityColor = {
                                                        'Critical': 'text-red-500',
                                                        'High': 'text-red-500',
                                                        'Medium': 'text-orange-500',
                                                        'Low': 'text-yellow-500',
                                                        'Info': 'text-blue-500'
                                                    }[alert.severity] || 'text-blue-500';

                                                    return (
                                                        <motion.tr
                                                            key={alert.id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.8 + idx * 0.05 }}
                                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                                        >
                                                            <td className="py-4 text-sm">
                                                                {new Date(alert.timestamp).toLocaleTimeString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    second: '2-digit',
                                                                    hour12: false
                                                                })}
                                                            </td>
                                                            <td className="py-4 text-sm">{alert.type}</td>
                                                            <td className={`py-4 text-sm font-bold ${severityColor}`}>{alert.severity}</td>
                                                            <td className="py-4 text-sm text-text-secondary max-w-xs truncate">{alert.description}</td>
                                                            <td className="py-4 text-sm text-accent-teal">{alert.location}</td>
                                                            <td className="py-4 text-right">
                                                                <button className="text-sm text-accent-teal hover:text-accent-cyan transition-colors">
                                                                    View →
                                                                </button>
                                                            </td>
                                                        </motion.tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            </div>
                        </main >
                        );
}
