'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface DetectionContextType {
    isHighConfidence: boolean;
    setHighConfidence: (status: boolean) => void;
    currentDetection: string | null;
    setCurrentDetection: (detection: string | null) => void;
    confidenceLevel: number;
    setConfidenceLevel: (level: number) => void;
}

const DetectionContext = createContext<DetectionContextType | undefined>(undefined);

export function DetectionProvider({ children }: { children: ReactNode }) {
    const [isHighConfidence, setIsHighConfidence] = useState(false);
    const [currentDetection, setCurrentDetection] = useState<string | null>(null);
    const [confidenceLevel, setConfidenceLevel] = useState(0);

    return (
        <DetectionContext.Provider
            value={{
                isHighConfidence,
                setHighConfidence: setIsHighConfidence,
                currentDetection,
                setCurrentDetection,
                confidenceLevel,
                setConfidenceLevel,
            }}
        >
            {children}
        </DetectionContext.Provider>
    );
}

export function useDetection() {
    const context = useContext(DetectionContext);
    if (context === undefined) {
        throw new Error('useDetection must be used within a DetectionProvider');
    }
    return context;
}
