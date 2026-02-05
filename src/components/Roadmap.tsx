'use client';

import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { useState, useRef, useMemo } from 'react';
import { Rocket, Target, Zap, Shield, Globe, TrendingUp, CheckCircle, Activity, Users, Building, Download, Cpu } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Line, Stars, Environment, PerspectiveCamera, Float, Instance, Instances } from '@react-three/drei';
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

// --- 3D Components ---

function CityBlock({ position, scale, color }: { position: [number, number, number], scale: [number, number, number], color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    // Random vertical movement for "floating" effect (handled by Float wrapper usually, but manual fine tune here)
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.002;
        }
    });

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
            <meshBasicMaterial color={color} transparent opacity={0.1} />
        </mesh>
    );
}

function ScanningLaser() {
    const lineRef = useRef<THREE.Line>(null);
    const [points] = useState(() => [new THREE.Vector3(-50, 0, 0), new THREE.Vector3(50, 0, 0)]);

    useFrame((state) => {
        if (lineRef.current) {
            const z = Math.sin(state.clock.elapsedTime * 0.5) * 20;
            lineRef.current.position.z = z;
            lineRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.5) * 5;
        }
    });

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        return geo;
    }, [points]);

    return (
        <line ref={lineRef}>
            <bufferGeometry attach="geometry" {...geometry} />
            <lineBasicMaterial color="#00ffff" linewidth={2} opacity={0.8} transparent />
        </line>
    );
}

function FloatingCity() {
    const count = 30;
    // Generate random blocks
    const blocks = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 20 - 5,
                (Math.random() - 0.5) * 40 - 10
            ] as [number, number, number],
            scale: [
                1 + Math.random() * 3,
                1 + Math.random() * 10,
                1 + Math.random() * 3
            ] as [number, number, number],
            color: Math.random() > 0.5 ? '#2dd4bf' : '#8b5cf6' // Teal or Purple
        }));
    }, []);

    return (
        <group rotation={[0, -Math.PI / 4, 0]}>
            {blocks.map((block, i) => (
                <Float key={i} speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
                    <CityBlock {...block} />
                </Float>
            ))}
            <ScanningLaser />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
}

// --- Main Component ---

export default function Roadmap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
    const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

    // Parallax for cards
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <section ref={containerRef} className="py-32 relative overflow-hidden bg-black/40 min-h-screen">

            {/* 3D Background */}
            <div className="absolute inset-0 z-0 opacity-60">
                <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={50} />
                    <ambientLight intensity={0.5} />
                    <FloatingCity />
                    <Environment preset="city" />
                </Canvas>
            </div>

            {/* Foreground Content */}
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
                <motion.div style={{ y }} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-32">
                    {phases.map((phase, i) => (
                        <PhaseCard
                            key={phase.id}
                            phase={phase}
                            index={i}
                            isHovered={hoveredPhase === phase.id}
                            setHovered={setHoveredPhase}
                        />
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
                                                    {/* Connecting lines for "Particles" effect could be CSS animations here, simplified for performance */}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FloatingPanel>

            </div>

            {/* Grid Overlay for "Tech" feel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)' }}></div>
        </section>
    );
}

function PhaseCard({ phase, index, isHovered, setHovered }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group h-full"
            onMouseEnter={() => setHovered(phase.id)}
            onMouseLeave={() => setHovered(null)}
        >
            {/* Laser connection line horizontal */}
            {index < 4 && (
                <div className="absolute top-8 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent hidden md:block opacity-30" />
            )}

            {/* Card Body */}
            <div className={`h-full relative overflow-hidden rounded-xl border transition-all duration-500 backdrop-blur-xl bg-black/40
        ${isHovered ? 'border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'border-white/10'}`}
            >
                {/* Tech Grid Background on Card */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

                <div className="relative z-10 p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <span className={`text-xs font-mono px-2 py-1 rounded bg-white/5 border border-white/10 ${isHovered ? 'text-cyan-300 border-cyan-500/30' : 'text-gray-400'}`}>
                            PHASE 0{phase.id}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${phase.status === 'current' ? 'bg-green-500 animate-ping' : 'bg-gray-700'}`} />
                    </div>

                    {/* Icon & Title */}
                    <div className="mb-6">
                        <phase.icon className={`w-8 h-8 mb-3 transition-colors ${isHovered ? 'text-cyan-400' : 'text-gray-500'}`} />
                        <h3 className="text-xl font-bold leading-tight mb-1 text-white">{phase.title}</h3>
                        <p className="text-xs text-cyan-200/60 font-mono">{phase.timeframe}</p>
                    </div>

                    {/* Objectives */}
                    <ul className="space-y-2 mb-8 flex-grow">
                        {phase.objectives.map((obj: string, i: number) => (
                            <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                <span className="mt-1 w-1 h-1 bg-cyan-500/50 rounded-full" />
                                {obj}
                            </li>
                        ))}
                    </ul>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/5">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Status</p>
                        <p className={`text-sm font-bold ${phase.status === 'completed' ? 'text-blue-400' : phase.status === 'current' ? 'text-green-400' : 'text-gray-300'}`}>
                            {phase.metrics}
                        </p>
                    </div>
                </div>

                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-b ${phase.color.replace('from-', 'from-').split(' ')[0]}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            </div>
        </motion.div>
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
