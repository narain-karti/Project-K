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

    }, [map, routeRequest]);

return null;
}

export default function LeafletMapClient({ routeRequest, onRouteLoaded, accidentLocation }: LeafletMapClientProps) {
    console.log('LeafletMapClient rendering with:', { routeRequest, accidentLocation });

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
