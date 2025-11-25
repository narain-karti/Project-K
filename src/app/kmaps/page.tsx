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
        <main className="h-screen w-full bg-black overflow-hidden flex flex-col md:flex-row pt-20">
            {/* Left Side - Chat Interface */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full md:w-[400px] h-[40vh] md:h-full shrink-0 z-10"
            >
                <ChatInterface onRouteUpdate={handleRouteUpdate} />
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
