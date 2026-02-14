'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Clock, Zap, Navigation, Shield, Heart } from 'lucide-react';

interface StorySection {
    title: string;
    content: string;
    icon: React.ReactNode;
    gradient: string;
}

const storySections: StorySection[] = [
    {
        title: "The Problem: Seconds Matter",
        content: "Every day, India loses hundreds of people on the road — not because help doesn't exist, but because help doesn't arrive in time. Most accidents go unnoticed for minutes, sometimes even longer, and emergency vehicles get trapped in the same chaos they're racing to escape. Project K was built to directly attack this life-and-death gap. It transforms the nation's existing traffic cameras into real-time responders that can detect an accident in under half a second and trigger immediate action. This is traffic infrastructure that doesn't just observe danger — it reacts to it.",
        icon: <Clock className="w-12 h-12" />,
        gradient: "from-red-500 to-orange-500"
    },
    {
        title: "Intelligence at Every Intersection",
        content: "With Project K, every intersection becomes a life-saving intelligence node. Our edge AI identifies collisions the moment they occur, flags stopped or damaged vehicles, recognizes blocked lanes, and understands critical incidents instantly — without depending on the cloud. This drastic reduction in detection time means first responders can be alerted within seconds, turning minutes of delay into moments of action, and those moments can be the difference between survival and loss.",
        icon: <Zap className="w-12 h-12" />,
        gradient: "from-accent-cyan to-accent-violet"
    },
    {
        title: "Clear the Way for Life",
        content: "Ambulances finally get what they've always needed: a city that clears the way for them automatically. When Project K identifies an emergency vehicle, nearby intersections synchronize to create a dynamic green corridor. Signals shift, lanes open up, and routes are optimized in real time using cloud-backed intelligence. This cuts travel time drastically and improves the golden-hour survival rate for critical patients. Your city literally moves out of the way when lives are at stake.",
        icon: <Navigation className="w-12 h-12" />,
        gradient: "from-green-500 to-emerald-500"
    },
    {
        title: "Hybrid Architecture: Never Fails",
        content: "What makes this life-saving ecosystem possible is the hybrid edge–cloud architecture at the heart of Project K. The edge handles instant decisions — accident detection, signal shifts, emergency overrides — in under 500ms. The cloud monitors traffic across the entire city, coordinating multiple intersections to remove bottlenecks and prevent cascading congestion. Even if the cloud goes offline, every node keeps operating with 85–90% efficiency, ensuring that no life hangs in the balance because of a network outage.",
        icon: <Shield className="w-12 h-12" />,
        gradient: "from-accent-violet to-accent-rose"
    },
    {
        title: "A Silent Guardian Built Into Your Streets",
        content: "This isn't just smarter traffic; it's safer cities. With continuous accident analysis, real-time hazard discovery, predictive detection patterns, and intelligent ambulance routing, Project K becomes a silent guardian built into the streets. It doesn't wait for someone to report a crash. It doesn't wait for traffic to fix itself. It acts instantly — preventing more injuries, accelerating emergency response, and ensuring that every second counts for the people whose lives depend on them.",
        icon: <Heart className="w-12 h-12" />,
        gradient: "from-accent-rose to-accent-amber"
    }
];

function StoryCard({ section, index }: { section: StorySection; index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const isEven = index % 2 === 0;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: isEven ? -100 : 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -100 : 100 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16 gpu-optimize"
        >
            <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}>
                {/* Icon Card */}
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className={`flex-shrink-0 w-32 h-32 bg-gradient-to-br ${section.gradient} rounded-2xl flex items-center justify-center text-white shadow-2xl`}
                >
                    {section.icon}
                </motion.div>

                {/* Content Card */}
                <div className="glass-card rounded-2xl p-8 flex-1">
                    <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                        {section.title}
                    </h3>
                    <p className="text-text-secondary text-lg leading-relaxed">
                        {section.content}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export default function ProjectKStory() {
    return (
        <div className="w-full max-w-6xl mx-auto py-16 px-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h2 className="text-5xl font-bold mb-4">How Project K Saves Lives</h2>
                <p className="text-text-secondary text-xl">
                    From detection to action in milliseconds — this is infrastructure that responds when it matters most
                </p>
            </motion.div>

            {storySections.map((section, index) => (
                <StoryCard key={index} section={section} index={index} />
            ))}
        </div>
    );
}
