'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import AccidentAlert from './AccidentAlert';

interface MapViewProps {
    routeRequest: any;
}

// Dynamically import the actual map component with SSR disabled
const LeafletMap = dynamic(() => import('./LeafletMapClient'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-xl">
            <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
        </div>
    )
});

export default function MapView({ routeRequest }: MapViewProps) {
    const [accidentAlert, setAccidentAlert] = useState<{ show: boolean, location: [number, number] | null }>({
        show: false,
        location: null
    });

    const handleRouteLoaded = (route: any) => {
        // Simulate accident detection after 3 seconds
        setTimeout(() => {
            if (route && route.coordinates && route.coordinates.length > 0) {
                const accidentIndex = Math.floor(route.coordinates.length * 0.3);
                const accidentPoint = route.coordinates[accidentIndex];
                const location: [number, number] = [accidentPoint.lat, accidentPoint.lng];
                setAccidentAlert({ show: true, location });
            }
        }, 3000);
    };

    const handleRedirect = () => {
        setAccidentAlert({ ...accidentAlert, show: false });
    };

    const handleContinue = () => {
        setAccidentAlert({ ...accidentAlert, show: false });
    };

    return (
        <div className="relative w-full h-full">
            <LeafletMap
                routeRequest={routeRequest}
                onRouteLoaded={handleRouteLoaded}
                accidentLocation={accidentAlert.location}
            />

            {accidentAlert.show && (
                <AccidentAlert
                    onRedirect={handleRedirect}
                    onContinue={handleContinue}
                />
            )}
        </div>
    );
}
