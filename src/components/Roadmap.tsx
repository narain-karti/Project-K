'use client';

import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Rocket, Target, Zap, Shield, Globe, TrendingUp, CheckCircle, Activity, Users, Building, Download, Cpu, X, ArrowRight } from 'lucide-react';
import * as THREE from 'three';

// --- Types ---
type Phase = {
    id: number;
    title: string;
    timeframe: string;
    status: 'completed' | 'current' | 'upcoming';
    color: string;
    icon: any;
    objectives: string[];
    metrics: string;
};

// --- Data ---
const phases: Phase[] = [
    {
        id: 1,
        title: "Proof of Concept",
        timeframe: "Q1 2026",
        status: "completed",
        color: "from-blue-400 to-cyan-400",
        icon: Zap,
        objectives: ["85%+ vehicle detection", "Single intersection proto", "10,000+ labeled images"],
        metrics: "Validation Complete"
    },
    {
        id: 2,
        title: "MVP Development",
        timeframe: "Q2-Q3 2026",
        status: "current",
        color: "from-cyan-400 to-teal-400",
        icon: Rocket,
        objectives: ["Multi-intersection mgmt", "Emergency corridors", "Cloud dashboard"],
        metrics: "In Progress (75%)"
    },
    {
        id: 3,
        title: "Pilot Deployment",
        timeframe: "Q3-Q4 2026",
        status: "upcoming",
        color: "from-teal-400 to-emerald-400",
        icon: Building,
        objectives: ["50-100 cameras", "2-3 Tier 2 cities", "Citizen mobile app"],
        metrics: "Target: 2 Cities"
    },
    {
        id: 4,
        title: "Scaling & AV Integration",
        timeframe: "2027 H1",
        status: "upcoming",
        color: "from-purple-400 to-indigo-500",
        icon: Activity,
        objectives: ["500+ intersections/city", "V2X protocol", "Predictive forecasting"],
        metrics: "Target: 5 Cities"
    },
    {
        id: 5,
        title: "Market Leadership",
        timeframe: "2027 H2+",
        status: "upcoming",
        color: "from-indigo-500 to-blue-600",
        icon: Globe,
        objectives: ["National presence", "SE Asia expansion", "Digital twin simulation"],
        metrics: "Target: 50+ Cities"
    }
];

const tracks = [
    { name: "Development", status: ["AI/ML Models", "Edge Hardware", "Platform V1", "V2X Integration", "Global API"] },
    { name: "Business", status: ["Seed Funding", "Govt Tenders", "Series A", "Strategic Partnerships", "IPO Readiness"] },
    { name: "Deployment", status: ["Lab Testing", "Pune Pilot", "Indore/Surat", "Metro Expansion", "International"] }
];

// --- Components ---

function Magnetic({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
    }

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    }

    const { x, y } = position;
    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    )
}


export default function Roadmap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
    const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);
    const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

    // Parallax for cards
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <section ref={containerRef} className="py-32 relative overflow-hidden bg-transparent min-h-screen">
            <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
                {/* Header */}
                <div className="text-center mb-20 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block mb-4 px-4 py-1 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 backdrop-blur-md"
                    >
                        <span className="text-accent-cyan text-sm font-mono tracking-widest">SYSTEM ROADMAP v1.0</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-cyan-200"
                    >
                        Building the Future
                    </motion.h2>
                </div>

                {/* Phase Cards Timeline */}
                <motion.div style={{ y }} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-32 perspective-1000">
                    {phases.map((phase, i) => (
                        <Magnetic key={phase.id}>
                            <PhaseCard
                                phase={phase}
                                index={i}
                                isHovered={hoveredPhase === phase.id}
                                isNeighbor={hoveredPhase !== null && Math.abs(hoveredPhase - phase.id) === 1}
                                isDimmed={hoveredPhase !== null && hoveredPhase !== phase.id && Math.abs(hoveredPhase - phase.id) !== 1}
                                setHovered={setHoveredPhase}
                                setSelected={setSelectedPhase}
                            />
                        </Magnetic>
                    ))}
                </motion.div>

                {/* Parallel Tracks Panel */}
                <FloatingPanel>
                    <div className="p-8 md:p-12">
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                            <Cpu className="text-accent-cyan animate-pulse" /> Parallel Execution Tracks
                        </h3>
                        <div className="space-y-8">
                            {tracks.map((track, i) => (
                                <div key={track.name} className="relative group">
                                    <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-center">
                                        <span className="font-mono text-sm text-cyan-200/70">{track.name}</span>
                                        <div className="grid grid-cols-5 gap-2">
                                            {track.status.map((step, j) => (
                                                <div key={step} className={`relative p-2 rounded border text-[10px] md:text-xs text-center transition-all duration-300
                           ${j < 2 ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]' :
                                                        j === 2 ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 animate-pulse' :
                                                            'bg-white/5 border-white/5 text-gray-500'}`}
                                                >
                                                    {step}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FloatingPanel>

                {/* Expanded Card Modal */}
                <AnimatePresence>
                    {selectedPhase && (
                        <ExpandedPhaseModal
                            phase={phases.find(p => p.id === selectedPhase)!}
                            onClose={() => setSelectedPhase(null)}
                        />
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}

function PhaseCard({ phase, index, isHovered, isNeighbor, isDimmed, setHovered, setSelected }: any) {
    return (
        <motion.div
            layoutId={`card-${phase.id}`}
            onClick={() => setSelected(phase.id)}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            className={`relative group h-[340px] cursor-pointer`}
            onMouseEnter={() => setHovered(phase.id)}
            onMouseLeave={() => setHovered(null)}
            animate={{
                scale: isHovered ? 1.05 : isNeighbor ? 0.98 : isDimmed ? 0.95 : 1,
                opacity: isDimmed ? 0.5 : 1,
                filter: isDimmed ? 'blur(2px)' : 'none'
            }}
        >
            {/* Laser connection line horizontal */}
            {index < 4 && (
                <div className="absolute top-8 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent hidden md:block opacity-30" />
            )}

            {/* Card Body */}
            <div className={`h-full relative overflow-hidden rounded-xl border transition-all duration-300 backdrop-blur-xl bg-black/40
        ${isHovered ? 'border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'border-white/10'}`}
            >
                {/* Tech Grid Background on Card */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

                <div className="relative z-10 p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <span className={`text-[10px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 ${isHovered ? 'text-cyan-300 border-cyan-500/30' : 'text-gray-400'}`}>
                            PHASE 0{phase.id}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${phase.status === 'current' ? 'bg-green-500 animate-ping' : 'bg-gray-700'}`} />
                    </div>

                    {/* Icon & Title */}
                    <div className="mb-6">
                        <motion.div layoutId={`icon-${phase.id}`}>
                            <phase.icon className={`w-8 h-8 mb-3 transition-colors ${isHovered ? 'text-cyan-400' : 'text-gray-500'}`} />
                        </motion.div>
                        <motion.h3 layoutId={`title-${phase.id}`} className="text-lg font-bold leading-tight mb-1 text-white">{phase.title}</motion.h3>
                        <p className="text-xs text-cyan-200/60 font-mono">{phase.timeframe}</p>
                    </div>

                    {/* Objectives */}
                    <ul className="space-y-2 mb-8 flex-grow">
                        {phase.objectives.slice(0, 3).map((obj: string, i: number) => (
                            <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                <span className="mt-1 w-1 h-1 bg-cyan-500/50 rounded-full" />
                                {obj}
                            </li>
                        ))}
                    </ul>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Status</p>
                            <p className={`text-xs font-bold ${phase.status === 'completed' ? 'text-blue-400' : phase.status === 'current' ? 'text-green-400' : 'text-gray-300'}`}>
                                {phase.metrics}
                            </p>
                        </div>
                        <motion.div
                            animate={{ x: isHovered ? 5 : 0, opacity: isHovered ? 1 : 0 }}
                            className="bg-cyan-500/20 p-1.5 rounded-lg"
                        >
                            <ArrowRight className="w-4 h-4 text-cyan-400" />
                        </motion.div>
                    </div>
                </div>

                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-b ${phase.color.replace('from-', 'from-').split(' ')[0]}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            </div>
        </motion.div>
    );
}

function ExpandedPhaseModal({ phase, onClose }: { phase: Phase, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
                layoutId={`card-${phase.id}`}
                className="relative w-full max-w-2xl bg-black/90 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.2)] z-10"
            >
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-20">
                    <X className="w-5 h-5 text-white" />
                </button>

                <div className="p-10 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="inline-block px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6">
                            PHASE 0{phase.id} — {phase.status.toUpperCase()}
                        </div>
                        <motion.div layoutId={`icon-${phase.id}`}>
                            <phase.icon className="w-16 h-16 text-cyan-400 mb-6" />
                        </motion.div>
                        <motion.h3 layoutId={`title-${phase.id}`} className="text-3xl md:text-4xl font-bold text-white mb-2">{phase.title}</motion.h3>
                        <p className="text-xl text-cyan-200/70 font-mono mb-8">{phase.timeframe}</p>

                        <p className="text-gray-400 leading-relaxed">
                            Detailed overview of {phase.title}. This phase focuses on {phase.objectives[0]} and establishing the core infrastructure for the Project K ecosystem.
                        </p>
                    </div>

                    <div className="flex flex-col justify-center">
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-cyan-400" /> Key Objectives
                        </h4>
                        <ul className="space-y-4">
                            {phase.objectives.map((obj, i) => (
                                <motion.li
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    key={i}
                                    className="flex items-start gap-3 text-gray-300 p-3 rounded-xl bg-white/5 border border-white/5"
                                >
                                    <CheckCircle className="w-5 h-5 text-cyan-500 shrink-0" />
                                    {obj}
                                </motion.li>
                            ))}
                        </ul>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Target Metric</span>
                                <span className="text-2xl font-bold text-white">{phase.metrics}</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: phase.status === 'completed' ? '100%' : '75%' }}
                                    className={`h-full ${phase.status === 'completed' ? 'bg-blue-500' : 'bg-green-500'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function FloatingPanel({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl relative overflow-hidden border border-white/10 bg-black/60 backdrop-blur-xl"
        >
            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
