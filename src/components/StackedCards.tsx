'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { AlertTriangle, Activity, Zap, Brain, TrendingUp, Target } from 'lucide-react';

const cards = [
    {
        id: 1,
        title: "Instant Accident Detection",
        description: "Detects crashes in under 2 seconds using edge AI, alerting authorities instantly and cutting fatal response delays.",
        icon: AlertTriangle,
        gradient: "from-red-500 to-orange-500"
    },
    {
        id: 2,
        title: "Smart Ambulance Green Corridors",
        description: "Automatically clears traffic by syncing intersections, giving ambulances a real-time AI-generated priority route.",
        icon: Activity,
        gradient: "from-green-500 to-emerald-500"
    },
    {
        id: 3,
        title: "Adaptive Traffic Signals",
        description: "Signals change based on live queue lengths instead of fixed timers, creating smooth, intelligent traffic flow across the city.",
        icon: Zap,
        gradient: "from-yellow-400 to-orange-500"
    },
    {
        id: 4,
        title: "Autonomous Intersection Intelligence",
        description: "Every node thinks on its own, making decisions in <500ms, and stays operational even if the cloud goes down.",
        icon: Brain,
        gradient: "from-purple-500 to-indigo-500"
    },
    {
        id: 5,
        title: "Automatic Road Hazard Detection",
        description: "Identifies potholes, waterlogging, blockages, and anomalies instantly, enabling faster repairs and safer roads.",
        icon: TrendingUp,
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        id: 6,
        title: "City-Wide AI Coordination",
        description: "Cloud intelligence analyzes patterns across all intersections, preventing congestion through network-wide optimization.",
        icon: Target,
        gradient: "from-pink-500 to-rose-500"
    }
];

export default function StackedCards() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.3 });

    return (
        <div ref={containerRef} className="relative w-full max-w-6xl mx-auto min-h-[750px] flex items-center justify-center py-12">
            {/* Glowing Background Effect */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-accent-teal/20 to-accent-purple/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-accent-rose/20 to-accent-amber/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative w-full h-[650px]">
                {cards.map((card, index) => {
                    const Icon = card.icon;

                    // Grid positions: 3 columns x 2 rows
                    const gridPositions = [
                        { row: 0, col: 0 },
                        { row: 0, col: 1 },
                        { row: 0, col: 2 },
                        { row: 1, col: 0 },
                        { row: 1, col: 1 },
                        { row: 1, col: 2 },
                    ];

                    const pos = gridPositions[index];
                    const cardWidth = 360;
                    const cardHeight = 280;
                    const gap = 24;

                    return (
                        <motion.div
                            key={card.id}
                            className="absolute glass-card rounded-2xl p-6 cursor-pointer overflow-hidden"
                            style={{
                                width: cardWidth,
                                height: cardHeight,
                            }}
                            initial={{
                                x: '50%',
                                y: '50%',
                                translateX: '-50%',
                                translateY: '-50%',
                                rotate: (index - 2.5) * 5,
                                scale: 1 - index * 0.08,
                                zIndex: cards.length - index,
                            }}
                            animate={
                                isInView
                                    ? {
                                        x: pos.col * (cardWidth + gap),
                                        y: pos.row * (cardHeight + gap),
                                        translateX: 0,
                                        translateY: 0,
                                        rotate: 0,
                                        scale: 1,
                                        zIndex: index,
                                    }
                                    : {
                                        x: '50%',
                                        y: '50%',
                                        translateX: '-50%',
                                        translateY: '-50%',
                                        rotate: (index - 2.5) * 5,
                                        scale: 1 - index * 0.08,
                                        zIndex: cards.length - index,
                                    }
                            }
                            transition={{
                                type: 'spring',
                                stiffness: 100,
                                damping: 20,
                                delay: isInView ? index * 0.1 : 0,
                            }}
                            whileHover={{ scale: 1.05, zIndex: 100 }}
                        >
                            {/* Card Glow on Hover */}
                            <div className={`absolute -inset-1 bg-gradient-to-r ${card.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`} />

                            <div className="flex items-start gap-4 mb-3">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            <h3 className="text-lg font-bold mb-2 text-text-primary">{card.title}</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">{card.description}</p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
