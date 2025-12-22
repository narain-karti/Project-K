'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapView from './components/MapView';
import FilterPanel from './components/FilterPanel';
import ChatInterface from './components/ChatInterface';
import IncidentFeed from './components/IncidentFeed';
import IntelligencePanel from './components/IntelligencePanel';
import { useIncidentData, Incident } from './hooks/useIncidentData';

export default function KMapsPage() {
    const { incidents, allIncidents, filters, setFilters } = useIncidentData();
    const [focusedLocation, setFocusedLocation] = useState<[number, number] | null>(null);
    const [routeRequest, setRouteRequest] = useState<any>(null); // State for Smart Routing
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Loading Sequence
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleIncidentClick = (incident: Incident) => {
        setFocusedLocation(incident.location);
    };

    const handleRouteUpdate = (routeData: any) => {
        console.log("📍 Route Update Received in Page:", routeData);
        setRouteRequest(routeData);
    };

    return (
        <main className="h-screen w-full bg-black overflow-hidden relative font-sans text-white">

            {/* 1. Loading Overlay */}
            <AnimatePresence>
                {!isLoaded && (
                    <motion.div
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black"
                        exit={{ opacity: 0, transition: { duration: 1 } }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 border-t-2 border-indigo-500 rounded-full animate-spin mx-auto mb-6" />
                            <h1 className="text-2xl font-light tracking-widest uppercase text-indigo-400">
                                Initializing Chennai City Intelligence
                            </h1>
                            <p className="text-xs text-white/30 mt-2 font-mono">
                                Connecting to sensor network...
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. Main Content */}
            <motion.div
                className="w-full h-full relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                {/* Background Map */}
                <div className="absolute inset-0 z-0">
                    <MapView
                        incidents={incidents}
                        focusedLocation={focusedLocation}
                        routeRequest={routeRequest}
                    />
                </div>

                {/* UI Overlay Layer */}
                <div className="absolute inset-0 z-10 pointer-events-none p-4 pt-24 md:p-6 md:pt-28 flex flex-col justify-between">

                    {/* Header CTA */}
                    <div className="flex justify-between items-start pointer-events-auto">
                        <div className="bg-black/80 backdrop-blur border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-bold tracking-wider">LIVE MONITORING</span>
                        </div>

                    </div>

                    {/* Main Interface Layout */}
                    <div className="flex flex-col md:flex-row gap-4 h-full mt-4 overflow-hidden pointer-events-none">

                        {/* LEFT: Filters & Legend (Mobile: Top, Desktop: Left) */}
                        <div className="w-full md:w-80 shrink-0 pointer-events-auto flex flex-col gap-4 max-h-[40vh] md:max-h-full overflow-y-auto custom-scrollbar">
                            <FilterPanel filters={filters} setFilters={setFilters} />

                            {/* Chat Interface */}
                            <div className="md:h-96 min-h-[300px] rounded-2xl overflow-hidden glass-card shrink-0">
                                <ChatInterface
                                    onRouteUpdate={handleRouteUpdate}
                                    filters={filters}
                                />
                            </div>
                        </div>

                        {/* CENTER: Spacer (Map interaction zone) */}
                        <div className="flex-1 min-w-0 hidden md:block" />

                        {/* RIGHT: Feed & Intelligence (Mobile: Bottom, Desktop: Right) */}
                        <div className="w-full md:w-96 shrink-0 pointer-events-auto flex flex-col gap-4 max-h-[40vh] md:max-h-full overflow-y-auto custom-scrollbar mt-auto md:mt-0">
                            <div className="hidden md:block">
                                <IntelligencePanel incidents={allIncidents} />
                            </div>
                            <IncidentFeed incidents={incidents} onIncidentClick={handleIncidentClick} />
                        </div>
                    </div>

                    {/* Footer Trust Notice */}
                    <div className="mt-4 text-center pointer-events-auto">
                        <p className="text-[10px] text-white/30 tracking-wide uppercase">
                            All visualizations generated from live ML detections in Chennai. No synthetic data displayed.
                        </p>
                    </div>

                </div>
            </motion.div>
        </main>
    );
}
