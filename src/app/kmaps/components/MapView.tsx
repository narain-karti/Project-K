import dynamic from 'next/dynamic';
import { Incident } from '../hooks/useIncidentData';

// Dynamically import Leaflet with no SSR
const LeafletMapClient = dynamic(
    () => import('./LeafletMapClient'),
    { ssr: false }
);

interface RouteRequest {
    source?: string;
    destination?: string;
    preferences?: string[];
}

interface MapViewProps {
    incidents: Incident[];
    focusedLocation: [number, number] | null;
    routeRequest?: RouteRequest | null;
}

export default function MapView({ incidents, focusedLocation, routeRequest }: MapViewProps) {
    return (
        <div className="w-full h-full relative z-0">
            <LeafletMapClient
                incidents={incidents}
                focusedLocation={focusedLocation}
                routeRequest={routeRequest}
            />
        </div>
    );
}
