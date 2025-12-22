'use client';

import { useState } from 'react';
import AnimatedCounter from '@/components/AnimatedCounter';
import { Heart, DollarSign, AlertTriangle, Users, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';

export default function ImpactPage() {
    const [cityCount, setCityCount] = useState(25);
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <main className="min-h-screen pt-24 px-6 md:px-12 pb-12">
            <LoadingScreen
                title="IMPACT ANALYTICS"
                subtitle="Aggregating Lives Saved..."
                accent="text-green-500"
                onComplete={() => setIsLoaded(true)}
            />
            {isLoaded && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <div className="container mx-auto max-w-7xl">
                        <div className="mb-12">
                            <h1 className="text-5xl font-bold mb-4">Impact</h1>
                            <p className="text-text-secondary text-lg">Measurable lives saved and economic value created</p>
                        </div>

                        {/* Lives Saved Calculator */}
                        <section className="mb-16">
                            <h2 className="text-3xl font-bold mb-8 text-center">Impact Calculator</h2>
                            <div className="glass-card rounded-3xl p-8 md:p-12 max-w-5xl mx-auto">
                                <div className="mb-12">
                                    <label className="block text-center mb-6">
                                        <span className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-teal to-accent-purple">{cityCount}</span>
                                        <span className="text-text-secondary text-xl ml-3">cities</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={cityCount}
                                        onChange={(e) => setCityCount(Number(e.target.value))}
                                        className="w-full h -3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-teal"
                                        style={{
                                            background: `linear-gradient(to right, #32B8C6 0%, #32B8C6 ${cityCount}%, rgba(255,255,255,0.1) ${cityCount}%, rgba(255,255,255,0.1) 100%)`
                                        }}
                                    />
                                    <div className="flex justify-between text-sm text-text-secondary mt-3">
                                        <span>1 city</span>
                                        <span>100 cities</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl p-8 border border-green-500/20 group hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:border-green-500/40 hover:bg-green-500/5 transition-all duration-300">
                                        <Heart className="w-10 h-10 text-green-500 mb-3" />
                                        <div className="text-4xl font-bold mb-2">
                                            <AnimatedCounter end={Math.floor(cityCount * 350)} duration={1.5} />
                                        </div>
                                        <div className="text-text-secondary">Lives Saved Annually</div>
                                        <div className="text-xs text-green-500 mt-2">Based on 25-40% reduction</div>
                                    </div>

                                    <div className="bg-gradient-to-br from-accent-orange/10 to-transparent rounded-2xl p-8 border border-accent-orange/20 group hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:border-accent-orange/40 hover:bg-accent-orange/5 transition-all duration-300">
                                        <DollarSign className="w-10 h-10 text-accent-orange mb-3" />
                                        <div className="text-4xl font-bold mb-2">
                                            ₹<AnimatedCounter end={Math.floor(cityCount * 450)} duration={1.5} /> Cr
                                        </div>
                                        <div className="text-text-secondary">Economic Value Created</div>
                                        <div className="text-xs text-accent-orange mt-2">Accident cost savings</div>
                                    </div>

                                    <div className="bg-gradient-to-br from-accent-purple/10 to-transparent rounded-2xl p-8 border border-accent-purple/20 group hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:border-accent-purple/40 hover:bg-accent-purple/5 transition-all duration-300">
                                        <AlertTriangle className="w-10 h-10 text-accent-purple mb-3" />
                                        <div className="text-4xl font-bold mb-2">
                                            <AnimatedCounter end={Math.floor(cityCount * 1200)} duration={1.5} />
                                        </div>
                                        <div className="text-text-secondary">Accidents Prevented</div>
                                        <div className="text-xs text-accent-purple mt-2">Proactive interventions</div>
                                    </div>

                                    <div className="bg-gradient-to-br from-accent-teal/10 to-transparent rounded-2xl p-8 border border-accent-teal/20 group hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:border-accent-teal/40 hover:bg-accent-teal/5 transition-all duration-300">
                                        <Users className="w-10 h-10 text-accent-teal mb-3" />
                                        <div className="text-4xl font-bold mb-2">
                                            <AnimatedCounter end={Math.floor(cityCount * 1500)} duration={1.5} />
                                        </div>
                                        <div className="text-text-secondary">Families Protected</div>
                                        <div className="text-xs text-accent-teal mt-2">Generational impact</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SDG 3.6 Progress */}
                        <section className="mb-16">
                            <h2 className="text-3xl font-bold mb-8">SDG 3.6: Road Safety Target</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="glass-card rounded-2xl p-8 group hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:border-accent-teal/40 hover:bg-gradient-to-br hover:from-accent-teal/10 hover:to-transparent transition-all duration-300">
                                    <Target className="w-12 h-12 text-accent-teal mb-4" />
                                    <h3 className="text-2xl font-bold mb-4">India's Commitment</h3>
                                    <p className="text-text-secondary mb-6">Halve the number of road traffic deaths by 2030 (UN SDG 3.6)</p>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span>Current progress (without Project K)</span>
                                                <span className="text-orange-500 font-bold">33%</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-3">
                                                <div className="bg-orange-500 h-3 rounded-full" style={{ width: '33%' }} />
                                            </div>
                                            <div className="text-xs text-text-secondary mt-1">Not on track</div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span>UN Target by 2030</span>
                                                <span className="text-yellow-500 font-bold">50%</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-3">
                                                <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '50%' }} />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span>With Project K deployment</span>
                                                <span className="text-green-500 font-bold">65% ✓</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-3">
                                                <div className="bg-green-500 h-3 rounded-full" style={{ width: '65%' }} />
                                            </div>
                                            <div className="text-xs text-green-500 mt-1">Exceeds target</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-card rounded-2xl p-8 group hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:border-accent-purple/40 hover:bg-gradient-to-br hover:from-accent-purple/10 hover:to-transparent transition-all duration-300">
                                    <Award className="w-12 h-12 text-accent-purple mb-4" />
                                    <h3 className="text-2xl font-bold mb-4">Gap Closure</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="text-sm text-text-secondary mb-2">Additional lives saved with Project K</div>
                                            <div className="text-5xl font-bold text-green-500 mb-1">23,000 - 37,400</div>
                                            <div className="text-sm text-text-secondary">lives annually (nationwide)</div>
                                        </div>
                                        <div className="pt-4 border-t border-white/10">
                                            <div className="text-sm text-text-secondary mb-2">Economic impact</div>
                                            <div className="text-3xl font-bold mb-1">₹25,000 - 40,000 Cr</div>
                                            <div className="text-xs text-text-secondary">Annual value at ₹1 Cr per life</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* India Map Visualization (Placeholder) */}
                        <section className="mb-16">
                            <h2 className="text-3xl font-bold mb-8">Deployment Visualization</h2>
                            <div className="glass-card rounded-2xl p-12 group hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:border-blue-500/40 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-transparent transition-all duration-300">
                                <div className="text-center">
                                    <div className="text-6xl mb-6">🗺️</div>
                                    <h3 className="text-2xl font-bold mb-4">India Coverage Map</h3>
                                    <p className="text-text-secondary mb-4">Interactive map showing Project K deployment across cities</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                                        <div className="glass-card p-4 rounded-xl">
                                            <div className="text-2xl font-bold text-accent-teal">30+</div>
                                            <div className="text-xs text-text-secondary">Target Cities (Year 5)</div>
                                        </div>
                                        <div className="glass-card p-4 rounded-xl">
                                            <div className="text-2xl font-bold text-accent-orange">500K</div>
                                            <div className="text-xs text-text-secondary">Nodes Deployed</div>
                                        </div>
                                        <div className="glass-card p-4 rounded-xl">
                                            <div className="text-2xl font-bold text-accent-purple">10+</div>
                                            <div className="text-xs text-text-secondary">States Covered</div>
                                        </div>
                                        <div className="glass-card p-4 rounded-xl">
                                            <div className="text-2xl font-bold text-green-500">40%</div>
                                            <div className="text-xs text-text-secondary">Smart Cities Coverage</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Case Study */}
                        <section>
                            <h2 className="text-3xl font-bold mb-8">Pilot Case Study: Pune</h2>
                            <div className="glass-card rounded-2xl p-8 group hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:border-accent-teal/40 hover:bg-gradient-to-br hover:from-accent-teal/10 hover:to-transparent transition-all duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div>
                                        <h4 className="text-lg font-bold mb-4">Deployment</h4>
                                        <ul className="space-y-2 text-sm text-text-secondary">
                                            <li>• 50 nodes at 10 major intersections</li>
                                            <li>• 6-month pilot program</li>
                                            <li>• ₹2-3 crore investment</li>
                                            <li>• 24/7 monitoring & support</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-4">Results</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li className="text-green-500">✓ &lt;2s accident detection</li>
                                            <li className="text-green-500">✓ 25% reduction in fatality rate</li>
                                            <li className="text-green-500">✓ 95% system uptime</li>
                                            <li className="text-green-500">✓ ₹20-30 Cr fine revenue identified</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-4">Impact</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="text-xl font-bold text-accent-teal">87</div>
                                                <div className="text-xs text-text-secondary">Lives saved (estimated)</div>
                                            </div>
                                            <div>
                                                <div className="text-xl font-bold text-accent-orange">₹94 Cr</div>
                                                <div className="text-xs text-text-secondary">Economic value created</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </motion.div>
            )}
        </main>
    );
}
