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

            <div className="max-w-[1800px] mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-teal via-accent-purple to-accent-rose">
                            City Traffic Control Center
                        </h1>
                        <p className="text-text-secondary mt-2">Real-time monitoring and analytics across 1,234 nodes</p>
                    </div>

                    {/* Export buttons */}
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowFilters(!showFilters)}
                            className="glass-card px-6 py-3 rounded-xl flex items-center gap-2 hover:border-accent-teal transition-all"
                        >
                            <Filter className="w-5 h-5" />
                            Filters
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={exportToCSV}
                            className="glass-card px-6 py-3 rounded-xl flex items-center gap-2 hover:border-accent-teal transition-all"
                        >
                            <Download className="w-5 h-5" />
                            CSV
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={exportToExcel}
                            className="bg-gradient-to-r from-accent-teal to-accent-cyan px-6 py-3 rounded-xl flex items-center gap-2 text-black font-bold hover:shadow-lg hover:shadow-accent-teal/50 transition-all"
                        >
                            <Download className="w-5 h-5" />
                            Excel
                        </motion.button>
                    </div>
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

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { label: 'Total Detections', value: stats.totalDetections, icon: Activity, color: 'from-cyan-500 to-blue-500', trend: '+12.5%', up: true },
                        { label: 'Active Nodes', value: stats.activeNodes, icon: Wifi, color: 'from-green-500 to-emerald-500', trend: '+3', up: true },
                        { label: 'Avg Response', value: `${stats.avgResponseTime}s`, icon: Zap, color: 'from-yellow-500 to-orange-500', trend: '-15s', up: true },
                        { label: 'Uptime', value: `${stats.uptime}%`, icon: Shield, color: 'from-purple-500 to-pink-500', trend: '+0.2%', up: true },
                        { label: 'Accidents', value: stats.accidents, icon: AlertTriangle, color: 'from-red-500 to-rose-500', trend: '-8', up: true },
                        { label: 'Lives Saved', value: stats.livesSaved, icon: Users, color: 'from-pink-500 to-rose-500', trend: '+156', up: true }
                    ].map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="glass-card rounded-2xl p-6 relative overflow-hidden group"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                <Icon className={`w-8 h-8 mb-3 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                                <div className="text-3xl font-bold mb-1">
                                    <AnimatedCounter end={typeof stat.value === 'number' ? stat.value : parseFloat(stat.value)} />
                                    {typeof stat.value === 'string' && stat.value.replace(/[0-9.]/g, '')}
                                </div>
                                <div className="text-sm text-text-secondary mb-2">{stat.label}</div>
                                <div className={`text-xs flex items-center gap-1 ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                                    {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                    {stat.trend}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Main Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Time Series Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-accent-teal" />
                            24-Hour Detection Timeline
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={timeSeriesData}>
                                <defs>
                                    <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAccidents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF5E94" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#FF5E94" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="time" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                />
                                <Area type="monotone" dataKey="detections" stroke="#00D9FF" fillOpacity={1} fill="url(#colorDetections)" />
                                <Area type="monotone" dataKey="accidents" stroke="#FF5E94" fillOpacity={1} fill="url(#colorAccidents)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Location Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-accent-purple" />
                            Accidents by Zone
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={locationData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="zone" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                />
                                <Bar dataKey="accidents" fill="#A78BFA" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Vehicle Types Pie Chart */}
                    <motion.div
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
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {vehicleTypes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Performance Radar Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-accent-rose" />
                            System Performance
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

                {/* Alert History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Bell className="w-5 h-5 text-accent-teal" />
                            Alert History
                        </h3>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="glass-card px-4 py-2 rounded-lg border border-white/10 bg-black/20"
                        >
                            <option value="1h">Last Hour</option>
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                        </select>
                    </div>

                    <div className="max-h-96 overflow- y-auto space-y-3 custom-scrollbar">
                        {alerts.map((alert, idx) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`glass-card p-4 rounded-xl border ${severityColors[alert.severity]} hover:scale-[1.02] transition-transform cursor-pointer`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${severityColors[alert.severity]}`}>
                                                {alert.severity}
                                            </span>
                                            <span className="text-sm font-bold">{alert.type}</span>
                                            <span className="text-xs text-text-secondary">{alert.location}</span>
                                        </div>
                                        <p className="text-sm text-text-secondary mb-2">{alert.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-text-secondary">
                                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                                            <span>Confidence: {(alert.confidence * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {alert.severity === 'Critical' && (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                            >
                                                <Circle className="w-3 h-3 fill-red-500 text-red-500" />
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 217, 255, 0.5);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 217, 255, 0.8);
                }
            `}</style>
        </main>
    );
}
