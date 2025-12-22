'use client';

import { useState } from 'react';
import { Users, Target, Mail, Phone, MapPin, Send, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';

export default function AboutPage() {
    const [formData, setFormData] = useState({ name: '', email: '', organization: '', message: '' });
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const faqs = [
        {
            q: "How is Project K different from traditional traffic management?",
            a: "Project K uses a hybrid edge-cloud architecture that enables real-time local processing with cloud-based optimization. Unlike pure cloud systems (slow, expensive) or pure edge systems (fragmented), we combine the best of both worlds."
        },
        {
            q: "What if the cloud goes down?",
            a: "Edge nodes operate autonomously with 85-90% efficiency during cloud outages. This is 100-1000x better than pure cloud systems which fail completely."
        },
        {
            q: "How is this different from pure edge AI?",
            a: "Pure edge AI costs ₹32,500 per intersection, takes 18-36 months for model updates, and cannot optimize network-wide. Project K costs ₹8,000-12,000 per node, updates in 24-48 hours, and enables city-wide coordination."
        },
        {
            q: "What about privacy concerns?",
            a: "Only 30-60 second snapshots are used, not continuous video. No facial recognition. Local processing keeps raw images at the intersection. This is 100x more privacy-friendly than continuous surveillance."
        },
        {
            q: "How do we get government adoption?",
            a: "Pilot cities first (Pune, Indore) demonstrate 20%+ accident reduction, then leverage as reference accounts. Government procurement follows proven results."
        },
    ];

    return (
        <main className="min-h-screen pt-24 px-6 md:px-12 pb-12">
            <LoadingScreen
                title="MISSION DIRECTIVE"
                subtitle="Loading Strategic Vision..."
                accent="text-teal-500"
                onComplete={() => setIsLoaded(true)}
            />
            {isLoaded && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <div className="container mx-auto max-w-7xl">
                        <div className="mb-12">
                            <h1 className="text-5xl font-bold mb-4">About Project K</h1>
                            <p className="text-text-secondary text-lg">Our mission to save lives through intelligent infrastructure</p>
                        </div>

                        {/* Mission & Vision */}
                        <section className="mb-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <motion.div
                                    className="glass-card rounded-2xl p-8 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:border-accent-teal/40 hover:bg-gradient-to-br hover:from-accent-teal/10 hover:to-transparent"
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                >
                                    <Target className="w-12 h-12 text-accent-teal mb-4 group-hover:scale-110 transition-transform duration-300" />
                                    <h2 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors duration-300">Our Mission</h2>
                                    <p className="text-text-secondary leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                        To transform India's 13 lakh passive traffic cameras into an intelligent network that saves lives,
                                        prevents accidents, and creates safer roads for everyone. We're not just building technology—we're
                                        building a future where every camera is a guardian angel.
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="glass-card rounded-2xl p-8 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:border-accent-purple/40 hover:bg-gradient-to-br hover:from-accent-purple/10 hover:to-transparent"
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                >
                                    <Users className="w-12 h-12 text-accent-purple mb-4 group-hover:scale-110 transition-transform duration-300" />
                                    <h2 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors duration-300">Our Vision</h2>
                                    <p className="text-text-secondary leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                        By 2030, become India's de facto standard for AI-powered traffic management, deployed in 50+ cities,
                                        saving 50,000+ lives annually, and preventing ₹100,000+ crores in economic losses. We envision a
                                        future where road deaths are as rare as they should be.
                                    </p>
                                </motion.div>
                            </div>
                        </section>

                        {/* Why Now */}
                        <section className="mb-16">
                            <motion.div
                                className="glass-card rounded-2xl p-8 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:border-accent-teal/40 hover:bg-gradient-to-br hover:from-accent-teal/10 hover:to-transparent"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl font-bold mb-6 group-hover:text-white transition-colors duration-300">Why Now?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="group/item">
                                        <div className="text-accent-teal font-bold mb-2 group-hover/item:scale-105 transition-transform duration-300">Market Timing</div>
                                        <p className="text-sm text-text-secondary group-hover/item:text-gray-300 transition-colors duration-300">Smart Cities Mission: ₹48,000 Cr allocated (2025-2030). Government procurement timelines are active now.</p>
                                    </div>
                                    <div className="group/item">
                                        <div className="text-accent-orange font-bold mb-2 group-hover/item:scale-105 transition-transform duration-300">Technology Readiness</div>
                                        <p className="text-sm text-text-secondary group-hover/item:text-gray-300 transition-colors duration-300">Edge AI accelerators are now affordable (₹2-3K). YOLO v11 achieves 94.6% accuracy on Indian roads.</p>
                                    </div>
                                    <div className="group/item">
                                        <div className="text-accent-purple font-bold mb-2 group-hover/item:scale-105 transition-transform duration-300">Regulatory Support</div>
                                        <p className="text-sm text-text-secondary group-hover/item:text-gray-300 transition-colors duration-300">National Road Safety Policy 2023 mandates 50% reduction. SDG 3.6 commitment creates urgency.</p>
                                    </div>
                                </div>
                            </motion.div>
                        </section>

                        {/* Contact Form */}
                        <section className="mb-16">
                            <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="glass-card rounded-2xl p-8">
                                    <h3 className="text-xl font-bold mb-6">Request Pilot Deployment</h3>
                                    <form className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-text-secondary mb-2">Name *</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full glass-card px-4 py-3 rounded-lg bg-transparent border border-white/10 focus:border-accent-teal focus:outline-none transition-colors"
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-text-secondary mb-2">Email *</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full glass-card px-4 py-3 rounded-lg bg-transparent border border-white/10 focus:border-accent-teal focus:outline-none transition-colors"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-text-secondary mb-2">Organization</label>
                                            <input
                                                type="text"
                                                value={formData.organization}
                                                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                                className="w-full glass-card px-4 py-3 rounded-lg bg-transparent border border-white/10 focus:border-accent-teal focus:outline-none transition-colors"
                                                placeholder="City Corporation, State Transport, etc."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-text-secondary mb-2">Message *</label>
                                            <textarea
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full glass-card px-4 py-3 rounded-lg bg-transparent border border-white/10 focus:border-accent-teal focus:outline-none transition-colors"
                                                rows={4}
                                                placeholder="Tell us about your city and requirements..."
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full px-6 py-3 rounded-lg bg-accent-teal text-white font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-accent-teal/50 interactive flex items-center justify-center gap-2"
                                        >
                                            Send Message <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>

                                <div className="space-y-6">
                                    <div className="glass-card rounded-2xl p-6">
                                        <Mail className="w-8 h-8 text-accent-teal mb-3" />
                                        <div className="text-sm text-text-secondary mb-1">Email</div>
                                        <div className="font-medium">pnarainkarti@gmail.com</div>
                                    </div>

                                    <div className="glass-card rounded-2xl p-6">
                                        <Phone className="w-8 h-8 text-accent-orange mb-3" />
                                        <div className="text-sm text-text-secondary mb-1">Phone</div>
                                        <div className="font-medium">+91 8015383591</div>
                                    </div>

                                    <div className="glass-card rounded-2xl p-6">
                                        <MapPin className="w-8 h-8 text-accent-purple mb-3" />
                                        <div className="text-sm text-text-secondary mb-1">Headquarters</div>
                                        <div className="font-medium">Coming Soon</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FAQ */}
                        <section>
                            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="glass-card rounded-2xl overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                            className="w-full text-left p-6 flex items-center justify-between interactive hover:bg-white/5 transition-colors"
                                        >
                                            <span className="font-semibold pr-4 break-words">{faq.q}</span>
                                            <ChevronDown
                                                className={`w-5 h-5 text-accent-teal transition-transform flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        <div className={`grid transition-all duration-300 ease-in-out w-full ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                            <div className="overflow-hidden w-full">
                                                <div className="px-6 pb-6 text-text-secondary w-full break-words">
                                                    {faq.a}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </motion.div>
            )}
        </main>
    );
}
