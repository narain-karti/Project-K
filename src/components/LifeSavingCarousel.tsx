'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, AlertTriangle, Zap, Shield, Activity, Target } from 'lucide-react';

type SlideData = {
    id: number;
    title: string;
    subtitle?: string;
    body?: string;
    icon: any;
    color: string;
};

const slides: SlideData[] = [
    {
        id: 1,
        title: "How Project K Saves Lives",
        subtitle: "From detection to action in milliseconds — this is infrastructure that responds when it matters most",
        icon: Heart,
        color: "from-rose-500 to-pink-600"
    },
    {
        id: 2,
        title: "The Problem: Seconds Matter",
        body: "Every day, India loses hundreds of people on the road — not because help doesn't exist, but because help doesn't arrive in time. Most accidents go unnoticed for minutes, sometimes even longer, and emergency vehicles get trapped in the same chaos they're racing to escape.\n\nProject K was built to directly attack this life-and-death gap. It transforms the nation's existing traffic cameras into real-time responders that can detect an accident in under half a second and trigger immediate action. This is traffic infrastructure that doesn't just observe danger — it reacts to it.",
        icon: AlertTriangle,
        color: "from-orange-500 to-red-600"
    },
    {
        id: 3,
        title: "Intelligence at Every Intersection",
        body: "With Project K, every intersection becomes a life-saving intelligence node. Our edge AI identifies collisions the moment they occur, flags stopped or damaged vehicles, recognizes blocked lanes, and understands critical incidents instantly — without depending on the cloud.\n\nThis drastic reduction in detection time means first responders can be alerted within seconds, turning minutes of delay into moments of action — and those moments can be the difference between survival and loss.",
        icon: Zap,
        color: "from-cyan-500 to-blue-600"
    },
    {
        id: 4,
        title: "Clear the Way for Life",
        body: "Ambulances finally get what they've always needed: a city that clears the way automatically. When Project K identifies an emergency vehicle, nearby intersections synchronize to create a dynamic green corridor.\n\nSignals shift, lanes open up, and routes are optimized in real time using cloud-backed intelligence. This cuts travel time drastically and improves golden-hour survival rates. The city literally moves out of the way when lives are at stake.",
        icon: Target,
        color: "from-green-500 to-teal-600"
    },
    {
        id: 5,
        title: "Hybrid Architecture: Never Fails",
        body: "This life-saving ecosystem is powered by a hybrid edge–cloud architecture. The edge handles instant decisions — accident detection, signal shifts, emergency overrides — in under 500ms.\n\nThe cloud monitors traffic across the city, coordinating intersections to prevent bottlenecks and cascading congestion. Even if the cloud goes offline, every node keeps operating with 85–90% efficiency. No life depends on network luck.",
        icon: Shield,
        color: "from-purple-500 to-indigo-600"
    },
    {
        id: 6,
        title: "A Silent Guardian Built Into Your Streets",
        body: "This isn't just smarter traffic — it's safer cities. With continuous accident analysis, real-time hazard discovery, predictive detection patterns, and intelligent ambulance routing, Project K becomes a silent guardian built into the streets.\n\nIt doesn't wait for reports. It doesn't wait for congestion to resolve itself. It acts instantly — preventing further injuries, accelerating emergency response, and ensuring that every second counts for the people whose lives depend on them.",
        icon: Activity,
        color: "from-blue-500 to-violet-600"
    }
];

export default function LifeSavingCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % slides.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
    };

    return (
        <section
            className="py-32 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">

                    {/* LEFT: Stacked Cards */}
                    <div className="relative h-[500px] flex items-center justify-center">
                        <div className="relative w-full max-w-md h-[400px] perspective-1000">
                            {slides.map((slide, index) => {
                                const distance = index - activeIndex;
                                const absDistance = Math.abs(distance);
                                const isActive = index === activeIndex;

                                return (
                                    <motion.div
                                        key={slide.id}
                                        className="absolute inset-0 cursor-pointer"
                                        initial={false}
                                        animate={{
                                            x: distance * 20,
                                            y: distance * 15,
                                            z: -absDistance * 100,
                                            scale: isActive ? 1 : 0.9 - (absDistance * 0.05),
                                            rotateY: distance * -5,
                                            opacity: absDistance > 2 ? 0 : 1,
                                            filter: isActive ? 'blur(0px)' : `blur(${absDistance * 2}px)`
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 30,
                                            duration: 0.6
                                        }}
                                        style={{
                                            zIndex: slides.length - absDistance,
                                            transformStyle: 'preserve-3d'
                                        }}
                                        onClick={() => setActiveIndex(index)}
                                    >
                                        <div className={`h-full rounded-3xl relative overflow-hidden border border-white/10 backdrop-blur-xl bg-gradient-to-br ${slide.color} p-8 shadow-2xl`}>
                                            {/* Tech grid overlay */}
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />

                                            <div className="relative z-10 h-full flex flex-col justify-between">
                                                <div>
                                                    <slide.icon className="w-16 h-16 text-white mb-6 drop-shadow-lg" strokeWidth={1.5} />
                                                    <h3 className="text-3xl font-bold text-white leading-tight mb-3 drop-shadow-md">
                                                        {slide.title}
                                                    </h3>
                                                    {slide.subtitle && (
                                                        <p className="text-white/90 text-sm leading-relaxed drop-shadow-sm">
                                                            {slide.subtitle}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className="h-1 w-12 bg-white/40 rounded-full" />
                                                    <span className="text-white/70 text-xs font-mono">
                                                        {String(slide.id).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT: Synced Text Content */}
                    <div className="relative min-h-[400px] flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                {slides[activeIndex].subtitle && activeIndex === 0 && (
                                    <div className="space-y-4">
                                        <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                                            {slides[activeIndex].title}
                                        </h2>
                                        <p className="text-xl text-gray-300 leading-relaxed">
                                            {slides[activeIndex].subtitle}
                                        </p>
                                    </div>
                                )}

                                {slides[activeIndex].body && (() => {
                                    const IconComponent = slides[activeIndex].icon;
                                    return (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${slides[activeIndex].color} flex items-center justify-center shadow-lg`}>
                                                    <IconComponent className="w-6 h-6 text-white" strokeWidth={2} />
                                                </div>
                                                <h3 className="text-3xl font-bold text-white">
                                                    {slides[activeIndex].title}
                                                </h3>
                                            </div>

                                            <div className="text-gray-300 text-lg leading-relaxed space-y-4">
                                                {slides[activeIndex].body.split('\n\n').map((paragraph, i) => (
                                                    <p key={i}>{paragraph}</p>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Controls */}
                        <div className="flex items-center gap-4 mt-12">
                            <button
                                onClick={handlePrev}
                                className="group p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                            </button>

                            <button
                                onClick={handleNext}
                                className="group p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                            </button>

                            {/* Progress Dots */}
                            <div className="flex gap-2 ml-4">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveIndex(index)}
                                        className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                            ? 'w-8 bg-white'
                                            : 'w-2 bg-white/30 hover:bg-white/50'
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
        </section >
    );
}
