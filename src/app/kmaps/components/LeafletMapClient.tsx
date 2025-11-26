import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

interface LeafletMapClientProps {
    routeRequest: any;
    onRouteLoaded: (route: any) => void;
    accidentLocation: [number, number] | null;
}

// Component to handle routing
function RoutingMachine({ routeRequest, onRouteLoaded }: { routeRequest: any, onRouteLoaded: (route: any) => void }) {
    const map = useMap();
    const [routingControl, setRoutingControl] = useState<any>(null);

    useEffect(() => {
        if (!map || !routeRequest) return;

        // Geocode locations using Nominatim
        const geocode = async (location: string) => {
            if (location === 'Current Location') {
                return [28.6139, 77.2090]; // Default Delhi
            }

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
                );
                const data = await response.json();
                if (data && data[0]) {
                    console.log('Geocoded:', location, 'to', [data[0].lat, data[0].lon]);
                    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                }
            } catch (error) {
                console.error('Geocoding error:', error);
            }
            return [28.6139, 77.2090];
        };

        // Get coordinates and create route
        Promise.all([
            geocode(routeRequest.source),
            geocode(routeRequest.destination)
        ]).then(async ([start, end]) => {
            console.log('Route from', start, 'to', end);

            // Import routing machine dynamically
            const LRM = await import('leaflet-routing-machine');

            // Remove previous routing control
            if (routingControl) {
                map.removeControl(routingControl);
            }

            const control = LRM.control({
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
                show: false,
                createMarker: () => null,
            }).addTo(map);

            control.on('routesfound', function (e: any) {
                console.log('Route found:', e.routes[0]);
                const route = e.routes[0];
                onRouteLoaded(route);
            });

            setRoutingControl(control);

            // Fit bounds
            map.fitBounds([
                [start[0], start[1]],
                [end[0], end[1]]
            ]);
        }).catch(err => {
            console.error('Routing error:', err);
        });

        return () => {
            if (routingControl && map) {
                try {
                    map.removeControl(routingControl);
                } catch (e) {
                    console.error('Error removing control:', e);
                }
            }
        };
    }, [map, routeRequest]);

    return null;
}

export default function LeafletMapClient({ routeRequest, onRouteLoaded, accidentLocation }: LeafletMapClientProps) {
    return (
        <MapContainer
            center={[28.6139, 77.2090]}
            zoom={6}
            style={{ height: '100%', width: '100%', background: '#1a1a2e' }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {routeRequest && (
                <RoutingMachine
                    routeRequest={routeRequest}
                    onRouteLoaded={onRouteLoaded}
                />
            )}

            {accidentLocation && (
                <Marker
                    position={accidentLocation}
                    icon={L.divIcon({
                        className: 'custom-accident-marker',
                        html: `<div style="
                            width: 30px; 
                            height: 30px; 
                            background: #EF4444; 
                            border: 3px solid white; 
                            border-radius: 50%;
                            box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
                        "></div>`,
                        iconSize: [30, 30]
                    })}
                >
                    <Popup>
                        <div className="text-sm">
                            <strong className="text-red-500">⚠️ Accident</strong>
                            <p className="text-xs mt-1">50m ahead</p>
                        </div>
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}
