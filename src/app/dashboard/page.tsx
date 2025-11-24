'use client';

import { useState } from 'react';
import MetricCard from '@/components/MetricCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import { Activity, AlertTriangle, TrendingUp, Clock, Wifi, DollarSign, Zap, Heart, MapPin, Bell } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDetection } from '@/context/DetectionContext';

export default function DashboardPage() {
    const [dateRange, setDateRange] = useState('24h');
    const { isHighConfidence, currentDetection, confidenceLevel } = useDetection();

    // Sample data for charts
    const detectionData = [
        { time: '00:00', vehicles: 1200, incidents: 2, accidents: 0 },
        { time: '04:00', vehicles: 450, incidents: 1, accidents: 0 },
        { time: '08:00', vehicles: 5600, incidents: 8, accidents: 2 },
        { time: '12:00', vehicles: 3800, incidents: 5, accidents: 1 },
        { time: '16:00', vehicles: 4200, incidents: 6, accidents: 1 },
        { time: '20:00', vehicles: 6100, incidents: 12, accidents: 3 },
    ];

    const vehicleTypeData = [
        { name: 'Cars', value: 456, color: '#32B8C6' },
        { name: 'Bikes', value: 321, color: '#FF8A65' },
        { name: 'Trucks', value: 123, color: '#BA68C8' },
        { name: 'Pedestrians', value: 234, color: '#34D399' },
    ];

    const activityLog = [
        { time: '12:34:23', type: 'Accident', severity: 'High', description: '2-vehicle collision detected', location: 'Node #234' },
        { time: '12:33:45', type: 'Emergency', severity: 'Medium', description: 'Ambulance detected, signals clear', location: 'Node #456' },
        { time: '12:32:10', type: 'Defect', severity: 'Low', description: 'Minor pothole detected', location: 'Node #123' },
        { time: '12:31:55', type: 'System', severity: 'Info', description: 'Node #789 model updated to v2.3.1', location: 'Node #789' },
        { time: '12:30:22', type: 'Traffic', severity: 'Info', description: 'Heavy congestion cleared', location: 'Zone 5' },
    ];

    const severityColors: Record<string, string> = {
        High: 'text-red-500',
        Medium: 'text-orange-500',
        Low: 'text-yellow-500',
        Info: 'text-blue-500',
    };

    return (
        <main className="min-h-screen pt-24 px-6 md:px-12 pb-12 bg-gradient-to-b from-transparent via-black/5 to-black/10">
            <div className="container mx-auto max-w-7xl">
                {/* Real-time Alert Banner */}
                {isHighConfidence && (
                    <div className="mb-8 p-4 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-red-500 rounded-full text-white">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">High Confidence Detection: {currentDetection}</h3>
                                <p className="text-red-200">Confidence Level: {(confidenceLevel * 100).toFixed(1)}% - Immediate Action Required</p>
                            </div>
                        </div>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">
                            View Live Feed
                        </button>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-5xl font-bold mb-2">Project K Control Center</h1>
                        <p className="text-text-secondary">Real-time traffic intelligence dashboard</p>
                    </div>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="glass-card px-4 py-2 rounded-lg text-sm bg-transparent border-none cursor-pointer interactive"
                        >
                            <option value="24h">Last 24 hours</option>
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="custom">Custom range</option>
                        </select>
                        <button className="glass-card px-4 py-2 rounded-lg text-sm interactive flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">5</span>
                        </button>
                    </div>
                </div>

                {/* Top KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Active Nodes"
                        value="847 / 850"
                        change="+99.6% uptime"
                        icon={<Wifi className="w-5 h-5" />}
                        trend="up"
                    />
                    <MetricCard
                        title="Detections (Last Hour)"
                        value={<AnimatedCounter end={1234567} duration={2} />}
                        change="+12.3% vs. avg"
                        icon={<Activity className="w-5 h-5" />}
                        trend="up"
                    />
                    <MetricCard
                        title="Emergency Incidents (Today)"
                        value="23"
                        change="-32% response time"
                        icon={<AlertTriangle className="w-5 h-5" />}
                        trend="up"
                    />
                    <MetricCard
                        title="Bandwidth Savings"
                        value="99.94%"
                        change="₹2.2 Cr monthly"
                        icon={<DollarSign className="w-5 h-5" />}
                        trend="up"
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Detection Timeline */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-xl font-bold mb-4">Detection Timeline (Last 24h)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={detectionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="time" stroke="#9AA0A6" />
                                <YAxis stroke="#9AA0A6" />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="vehicles" stroke="#32B8C6" strokeWidth={2} name="Vehicles" />
                                <Line type="monotone" dataKey="incidents" stroke="#FF8A65" strokeWidth={2} name="Incidents" />
                                <Line type="monotone" dataKey="accidents" stroke="#F87171" strokeWidth={2} name="Accidents" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Vehicle Distribution */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-xl font-bold mb-4">Vehicle Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={vehicleTypeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {vehicleTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* AI Model Performance */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-xl font-bold mb-4">AI Model Performance</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Accidents</span>
                                    <span className="text-accent-teal">94.6%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div className="bg-accent-teal h-2 rounded-full" style={{ width: '94.6%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Vehicles</span>
                                    <span className="text-accent-purple">96.1%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div className="bg-accent-purple h-2 rounded-full" style={{ width: '96.1%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Potholes</span>
                                    <span className="text-accent-orange">91.3%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div className="bg-accent-orange h-2 rounded-full" style={{ width: '91.3%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Emergency</span>
                                    <span className="text-green-500">98.2%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.2%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Response Metrics */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-xl font-bold mb-4">Emergency Response</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="text-sm text-text-secondary mb-2">Avg Response Time</div>
                                <div className="text-4xl font-bold text-green-500 mb-1">18.4 min</div>
                                <div className="text-sm text-text-secondary">vs. 30 min (was)</div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Active emergencies</span>
                                    <span className="text-red-500 font-bold">2 LIVE</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Resolved today</span>
                                    <span className="text-green-500">21</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Detection accuracy</span>
                                    <span className="text-accent-teal">98.2%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Infrastructure Defects */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-xl font-bold mb-4">Infrastructure Defects</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <span className="text-sm">High severity</span>
                                </div>
                                <span className="font-bold">345</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                                    <span className="text-sm">Medium severity</span>
                                </div>
                                <span className="font-bold">567</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <span className="text-sm">Low severity</span>
                                </div>
                                <span className="font-bold">322</span>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <div className="flex justify-between text-sm text-text-secondary">
                                    <span>Avg repair time</span>
                                    <span className="text-text-primary font-bold">4.2 days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Log Table */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">System Activity Log (Real-time)</h3>
                        <div className="flex gap-2">
                            <select className="glass-card px-3 py-1 rounded-lg text-sm bg-transparent border-none cursor-pointer">
                                <option>All Events</option>
                                <option>Accidents</option>
                                <option>Emergency</option>
                                <option>Defects</option>
                            </select>
                            <button className="glass-card px-3 py-1 rounded-lg text-sm interactive">Export CSV</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Time</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Event Type</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Severity</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Description</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Location</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activityLog.map((log, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4 text-sm">{log.time}</td>
                                        <td className="py-3 px-4 text-sm">{log.type}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <span className={`${severityColors[log.severity]} font-medium`}>{log.severity}</span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-text-secondary">{log.description}</td>
                                        <td className="py-3 px-4 text-sm">{log.location}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <button className="text-accent-teal hover:underline interactive">View →</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
