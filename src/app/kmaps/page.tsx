'use client';

import { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import MapView from './components/MapView';
import { motion } from 'framer-motion';

export default function KMapsPage() {
    const [routeRequest, setRouteRequest] = useState<any>(null);

    const handleRouteUpdate = (data: any) => {
        console.log("Route update received:", data);
        setRouteRequest(data);
    };

    return (
        <main className="h-screen w-full bg-black overflow-hidden flex flex-col md:flex-row pt-16 relative">
            {/* Ambient Glow Background */}
            <div className="absolute top-1/2 left-[200px] w-[500px] h-[500px] bg-gradient-to-br from-accent-cyan/20 via-accent-violet/20 to-transparent rounded-full blur-[100px] pointer-events-none animate-pulse" />

            {/* Left Side - Floating Chat Interface */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{
                    x: 0,
                    opacity: 1,
                    y: [0, -10, 0], // Floating animation
                }}
                transition={{
                    opacity: { duration: 0.5 },
                    x: { duration: 0.5 },
                    y: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
                className="w-full md:w-[420px] h-[calc(100vh-80px)] md:ml-6 md:mr-6 md:mt-6 md:mb-6 shrink-0 z-10 relative"
                style={{
                    filter: 'drop-shadow(0 0 40px rgba(0, 217, 255, 0.3)) drop-shadow(0 0 80px rgba(138, 97, 255, 0.2))'
                }}
            >
                <div className="h-full rounded-2xl md:rounded-3xl overflow-hidden ring-1 ring-white/10">
                    <ChatInterface onRouteUpdate={handleRouteUpdate} />
                </div>
            </motion.div>

            {/* Right Side - Map View */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 h-[60vh] md:h-full relative"
            >
                <MapView routeRequest={routeRequest} />

                {/* Overlay Gradient */}
                <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-black/50 to-transparent pointer-events-none hidden md:block" />
            </motion.div>
        </main>
    );
}
