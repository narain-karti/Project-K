import { useState, useEffect, useCallback } from 'react';

// Types
export type IncidentType = 'ACCIDENT' | 'AMBULANCE' | 'POTHOLE' | 'WATERLOG' | 'NORMAL';
export type Severity = 'CRITICAL' | 'WARNING' | 'INFO';
export type IncidentStatus = 'NEW' | 'ACTIVE' | 'RESOLVED';

export interface Incident {
    id: string;
    type: IncidentType;
    location: [number, number]; // [lat, lng]
    locationLabel: string;
    timestamp: Date;
    severity: Severity;
    confidence: number;
    status: IncidentStatus;
}

export interface FilterState {
    types: Record<IncidentType, boolean>;
    timeWindow: '5m' | '1h' | '24h';
}

// Mock Data Generators
const CHENNAI_BOUNDS = {
    lat: { min: 12.9000, max: 13.1500 }, // Slightly reduced North to stay central
    lng: { min: 80.1900, max: 80.2600 }  // Reduced East to strictly exclude ocean (Marina beach edge)
};

const LOCATIONS = [
    "Anna Salai - T. Nagar", "OMR - Sholinganallur", "ECR - Thiruvanmiyur",
    "Guindy Flyover", "Velachery Main Road", "Mount Road - Thousand Lights",
    "Poonamallee High Road", "Adyar Junction", "Koyambedu Market", "Marina Beach Service Road"
];

export const useIncidentData = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);

    const [filters, setFilters] = useState<FilterState>({
        types: {
            ACCIDENT: true,
            AMBULANCE: true,
            POTHOLE: true,
            WATERLOG: true,
            NORMAL: false // Usually hidden
        },
        timeWindow: '1h'
    });

    // Add a new random incident
    const generateIncident = useCallback(() => {
        const types: IncidentType[] = ['ACCIDENT', 'AMBULANCE', 'POTHOLE', 'WATERLOG'];
        const type = types[Math.floor(Math.random() * types.length)];

        let severity: Severity = 'INFO';
        if (type === 'ACCIDENT') severity = 'CRITICAL';
        if (type === 'AMBULANCE') severity = 'CRITICAL'; // High priority
        if (type === 'WATERLOG') severity = 'WARNING';
        if (type === 'POTHOLE') severity = 'WARNING';

        const newIncident: Incident = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            location: [
                CHENNAI_BOUNDS.lat.min + Math.random() * (CHENNAI_BOUNDS.lat.max - CHENNAI_BOUNDS.lat.min),
                CHENNAI_BOUNDS.lng.min + Math.random() * (CHENNAI_BOUNDS.lng.max - CHENNAI_BOUNDS.lng.min)
            ],
            locationLabel: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
            timestamp: new Date(),
            severity,
            confidence: 70 + Math.floor(Math.random() * 29), // 70-99%
            status: 'NEW'
        };

        setIncidents(prev => {
            // Keep last 50 incidents to avoid performance issues
            const updated = [newIncident, ...prev].slice(0, 50);
            return updated;
        });
    }, []);

    // Initial population
    useEffect(() => {
        // Generate initial batch
        for (let i = 0; i < 5; i++) generateIncident();

        // Simulation Loop
        const interval = setInterval(() => {
            if (Math.random() > 0.5) { // 50% chance every 3 seconds
                generateIncident();
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [generateIncident]);

    // Derived filtered data
    const filteredIncidents = incidents.filter(inc => {
        // Only show types that are true in filters
        if (!filters.types[inc.type]) return false;

        // Removed minConfidence check as requested
        // if (inc.confidence < filters.minConfidence) return false;

        return true;
    });

    return {
        incidents: filteredIncidents,
        allIncidents: incidents, // useful for stats
        filters,
        setFilters,
        generateIncident // expose for testing/demo
    };
};
