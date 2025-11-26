'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import AccidentAlert from './AccidentAlert';
import { Loader2 } from 'lucide-react';

// Fix Leaflet default icon issue with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
    routeRequest: any;
}

// Component to handle routing
function RoutingMachine({ routeRequest, onRouteLoaded }: { routeRequest: any, onRouteLoaded: (route: any) => void }) {
    const map = useMap();
    const [routingControl, setRoutingControl] = useState<any>(null);

    useEffect(() => {
        if (!map || !routeRequest) return;

        // Dynamically import leaflet-routing-machine (client-side only)
        import('leaflet-routing-machine').then((L) => {
            // Remove previous routing control
            if (routingControl) {
                map.removeControl(routingControl);
            }

            // Geocode locations using Nominatim (OpenStreetMap)
            const geocode = async (location: string) => {
                if (location === 'Current Location') {
                    return [28.6139, 77.2090]; // Default Delhi coordinates
                }

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
                    );
                    const data = await response.json();
                    if (data && data[0]) {
                        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                    }
                } catch (error) {
                    console.error('Geocoding error:', error);
                }
                return [28.6139, 77.2090]; // Fallback
            };

            // Get coordinates and create route
            Promise.all([
                geocode(routeRequest.source),
                geocode(routeRequest.destination)
            ]).then(([start, end]) => {
                const control = L.Routing.control({
                    waypoints: [
                        L.latLng(start[0], start[1]),
                        L.latLng(end[0], end[1])
                    ],
                    routeWhileDragging: false,
                    addWaypoints: false,
                    lineOptions: {
                        styles: [{
                            color: routeRequest?.preferences?.includes('pollution-free') ? '#34D399' : '#00D9FF',
                            opacity: 0.8,
                            weight: 5
                        }],
                        extendToWaypoints: true,
                        missingRouteTolerance: 0
                    },
                    show: false, // Hide directions panel
                    createMarker: () => null, // Don't show default markers
                }).addTo(map);

                control.on('routesfound', function (e: any) {
                    const route = e.routes[0];
                    onRouteLoaded(route);
                });

                setRoutingControl(control);

                // Fit map to route bounds
                map.fitBounds([
                    [start[0], start[1]],
                    [end[0], end[1]]
                ]);
            });
        });

        return () => {
            if (routingControl) {
                map.removeControl(routingControl);
            }
        };
    }, [map, routeRequest]);

    return null;
}

export default function MapView({ routeRequest }: MapViewProps) {
    const [mounted, setMounted] = useState(false);
    const [accidentAlert, setAccidentAlert] = useState<{ show: boolean, location: [number, number] | null }>({
        show: false,
        location: null
    });
    const [accidentMarker, setAccidentMarker] = useState<[number, number] | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRouteLoaded = (route: any) => {
        // Simulate accident detection after 3 seconds
        setTimeout(() => {
            if (route && route.coordinates && route.coordinates.length > 0) {
                const accidentIndex = Math.floor(route.coordinates.length * 0.3); // 30% along route
                const accidentPoint = route.coordinates[accidentIndex];
                const location: [number, number] = [accidentPoint.lat, accidentPoint.lng];
                setAccidentMarker(location);
                setAccidentAlert({ show: true, location });
            }
        }, 3000);
    };

    const handleRedirect = () => {
        setAccidentAlert({ ...accidentAlert, show: false });
        // In a real app, would recalculate route avoiding accident
    };

    const handleContinue = () => {
        setAccidentAlert({ ...accidentAlert, show: false });
    };

    if (!mounted) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-xl">
                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <MapContainer
                center={[28.6139, 77.2090]}
                zoom={13}
                style={{ height: '100%', width: '100%', background: '#1a1a2e' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {routeRequest && (
                    <RoutingMachine
                        routeRequest={routeRequest}
                        onRouteLoaded={handleRouteLoaded}
                    />
                )}

                {accidentMarker && (
                    <Marker
                        position={accidentMarker}
                        icon={L.divIcon({
                            className: 'custom-accident-marker',
                            html: `<div style="
                                width: 30px; 
                                height: 30px; 
                                background: #EF4444; 
                                border: 3px solid white; 
                                border-radius: 50%;
                                animation: pulse 1s infinite;
                            "></div>`,
                            iconSize: [30, 30]
                        })}
                    >
                        <Popup>
                            <div className="text-sm">
                                <strong className="text-red-500">⚠️ Accident Detected</strong>
                                <p className="text-xs mt-1">50 meters ahead</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {accidentAlert.show && (
                <AccidentAlert
                    onRedirect={handleRedirect}
                    onContinue={handleContinue}
                />
            )}

            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
}
