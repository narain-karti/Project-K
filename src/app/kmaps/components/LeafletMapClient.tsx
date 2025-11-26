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
        console.log('🗺️ RoutingMachine useEffect triggered', { routeRequest, hasMap: !!map });

        if (!map || !routeRequest) {
            console.log('⏭️ Missing map or routeRequest, skipping');
            return;
        }

        console.log('🚀 Starting routing process...');

        // Geocode locations using Nominatim
        const geocode = async (location: string) => {
            console.log('📍 Geocoding:', location);

            if (location === 'Current Location') {
                console.log('✅ Using default location for Current Location');
                return [28.6139, 77.2090];
            }

            try {
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`;
                console.log('🌐 Fetching from Nominatim:', url);

                const response = await fetch(url);
                const data = await response.json();

                console.log('📦 Nominatim response:', data);

                if (data && data[0]) {
                    const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                    console.log('✅ Geocoded:', location, '→', coords);
                    return coords;
                } else {
                    console.warn('⚠️ No results for:', location);
                }
            } catch (error) {
                console.error('❌ Geocoding error for', location, error);
            }
            return [28.6139, 77.2090];
        };

        // Get coordinates and create route
        console.log('🔄 Geocoding source and destination...');
        Promise.all([
            geocode(routeRequest.source),
            geocode(routeRequest.destination)
        ]).then(async ([start, end]) => {
            console.log('🎯 Geocoding complete. Creating route from', start, 'to', end);

            try {
                // Import routing machine - this extends the L global with L.Routing
                console.log('📦 Importing leaflet-routing-machine...');
                await import('leaflet-routing-machine');
                await import('leaflet-routing-machine/dist/leaflet-routing-machine.css');
                console.log('✅ leaflet-routing-machine loaded');

                // Remove previous routing control
                if (routingControl) {
                    console.log('🧹 Removing previous routing control');
                    map.removeControl(routingControl);
                }

                console.log('🛣️ Creating routing control with L.Routing.control()...');

                // After import, use L.Routing.control() directly
                const control = (L as any).Routing.control({
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

                console.log('✅ Routing control added to map');

                control.on('routesfound', function (e: any) {
                    console.log('🎉🎉🎉 Route found!', e.routes[0]);
                    const route = e.routes[0];
                    onRouteLoaded(route);
                });

                control.on('routingerror', function (e: any) {
                    console.error('❌❌❌ Routing error:', e);
                });

                setRoutingControl(control);

                // Fit bounds
                console.log('🔍 Fitting map bounds');
                map.fitBounds([
                    [start[0], start[1]],
                    [end[0], end[1]]
                ]);
            } catch (err) {
                console.error('💥 Error creating route:', err);
            }
        }).catch(err => {
            console.error('💥 Geocoding failed:', err);
        });

        return () => {
            if (routingControl && map) {
                try {
                    console.log('🧹 Cleaning up routing control');
                    map.removeControl(routingControl);
                } catch (e) {
                    console.error('❌ Error removing control:', e);
                }
            }
        };
    }, [map, routeRequest]);

    return null;
}

export default function LeafletMapClient({ routeRequest, onRouteLoaded, accidentLocation }: LeafletMapClientProps) {
    console.log('🖼️ LeafletMapClient rendering with:', { routeRequest, accidentLocation });

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
