'use client';

import { DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function BusinessPage() {
    const revenueStreams = [
        { name: 'Government SaaS', value: 50, color: '#32B8C6' },
        { name: 'Insurance Data', value: 100, color: '#FF8A65' },
        { name: 'Emergency Services', value: 120, color: '#BA68C8' },
        { name: 'PPP Fines', value: 240, color: '#34D399' },
        { name: 'Fleet APIs', value: 50, color: '#FBBF24' },
    ];

    const yearlyGrowth = [
        { year: 'Y1', revenue: 5.5, profit: -2 },
        { year: 'Y2', revenue: 42, profit: 8 },
        { year: 'Y3', revenue: 149, profit: 45 },
        { year: 'Y4', revenue: 340, profit: 120 },
        { year: 'Y5', revenue: 560, profit: 210 },
    ];

    return (
        <main className="min-h-screen pt-24 px-6 md:px-12 pb-12">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold mb-4">Business Model</h1>
                    <p className="text-text-secondary text-lg">Revenue streams, growth projections, and investment opportunity</p>
                </div>

                {/* Revenue Streams */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8">Revenue Streams (Year 5)</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass-card rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-6">Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <RePieChart>
                                    <Pie
                                        data={revenueStreams}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}\n${percent ? (percent * 100).toFixed(0) : 0}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {revenueStreams.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="glass-card rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-6">Breakdown</h3>
                            <div className="space-y-4">
                                {revenueStreams.map((stream, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded" style={{ backgroundColor: stream.color }} />
                                            <span className="text-sm">{stream.name}</span>
                                        </div>
                                        <span className="font-bold">₹{stream.value} Cr</span>
                                    </div>
                                ))}
                                <div className="pt-4 border-t border-white/10 flex justify-between">
                                    <span className="font-bold">Total Annual Revenue</span>
                                    <span className="text-2xl font-bold text-green-500">₹560 Cr</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Growth Projections */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8">5-Year Growth Projections</h2>
                    <div className="glass-card rounded-2xl p-8">
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={yearlyGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="year" stroke="#9AA0A6" />
                                <YAxis stroke="#9AA0A6" label={{ value: '₹ Crores', angle: -90, position: 'insideLeft' }} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#32B8C6" strokeWidth={3} name="Revenue (₹ Cr)" />
                                <Line type="monotone" dataKey="profit" stroke="#34D399" strokeWidth={3} name="Profit (₹ Cr)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Unit Economics */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8">Unit Economics (Per City)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-card rounded-2xl p-8">
                            <Calculator className="w-10 h-10 text-accent-teal mb-4" />
                            <h3 className="text-xl font-bold mb-6">Revenue Per City (Annual)</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Government SaaS</span>
                                    <span className="font-medium">₹1.5-3 lakhs</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Insurance data sharing</span>
                                    <span className="font-medium">₹20-30 lakhs</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Emergency services</span>
                                    <span className="font-medium">₹10-15 lakhs</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Fleet APIs</span>
                                    <span className="font-medium">₹5-10 lakhs</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-white/10 text-lg">
                                    <span className="font-bold">Total</span>
                                    <span className="font-bold text-green-500">₹50-70 lakhs</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-8">
                            <DollarSign className="w-10 h-10 text-accent-orange mb-4" />
                            <h3 className="text-xl font-bold mb-6">Cost Per City (Annual)</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Hardware (50-100 nodes × ₹10K)</span>
                                    <span className="font-medium">₹5-10 lakhs (one-time)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Cloud infrastructure</span>
                                    <span className="font-medium">₹8-12 lakhs</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Support & operations</span>
                                    <span className="font-medium">₹3-5 lakhs</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-white/10 text-lg">
                                    <span className="font-bold">Total (steady state)</span>
                                    <span className="font-bold text-red-500">₹15-27 lakhs</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-white/10 text-lg">
                                    <span className="font-bold text-green-500">Gross Margin</span>
                                    <span className="font-bold text-green-500">60-70%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Investment Requirements */}
                <section>
                    <h2 className="text-3xl font-bold mb-8">Investment & Funding</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card rounded-2xl p-8">
                            <div className="text-sm text-accent-teal mb-2">Seed Round</div>
                            <div className="text-3xl font-bold mb-4">₹3-5 Cr</div>
                            <div className="text-sm text-text-secondary space-y-2">
                                <div>• MVP & pilot deployment</div>
                                <div>• 6-month runway</div>
                                <div>• Core team (5 people)</div>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-8">
                            <div className="text-sm text-accent-purple mb-2">Series A</div>
                            <div className="text-3xl font-bold mb-4">₹15-25 Cr</div>
                            <div className="text-sm text-text-secondary space-y-2">
                                <div>• Scale to 5-10 cities</div>
                                <div>• Team expansion (20 people)</div>
                                <div>• 12-month runway</div>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-8">
                            <div className="text-sm text-accent-orange mb-2">Series B</div>
                            <div className="text-3xl font-bold mb-4">₹50-75 Cr</div>
                            <div className="text-sm text-text-secondary space-y-2">
                                <div>• National scale (30-50 cities)</div>
                                <div>• Team: 50+ people</div>
                                <div>• Revenue acceleration</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-8 mt-8">
                        <h3 className="text-2xl font-bold mb-4">Exit Strategy</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-lg font-bold text-accent-teal mb-3">Acquisition (Most Likely)</h4>
                                <ul className="space-y-2 text-sm text-text-secondary">
                                    <li>• Timeline: 2027-2028 (Year 3-4)</li>
                                    <li>• Potential acquirers: MapMyIndia, Siemens, Google</li>
                                    <li>• Valuation: ₹500-1,000 crores</li>
                                    <li>• Strategic fit: Traffic management platform</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-accent-purple mb-3">IPO (Alternative)</h4>
                                <ul className="space-y-2 text-sm text-text-secondary">
                                    <li>• Timeline: 2029-2030 (Year 5-6)</li>
                                    <li>• Revenue target: ₹500+ crores annually</li>
                                    <li>• Valuation: ₹2,000-5,000 crores</li>
                                    <li>• Market: Infrastructure tech sector</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
