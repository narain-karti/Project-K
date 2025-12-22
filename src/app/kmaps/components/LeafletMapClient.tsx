import { MapContainer, TileLayer, ZoomControl, useMap, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Incident } from '../hooks/useIncidentData';
import IncidentMarker from './IncidentMarker';
import { useEffect, useState } from 'react';

// Fix Leaflet default icon issue
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, map.getZoom(), { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

interface RouteRequest {
    source?: string;
    destination?: string;
    preferences?: string[];
}

function RoutingManager({ routeRequest }: { routeRequest?: RouteRequest | null }) {
    const map = useMap();
    const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
    const [startPos, setStartPos] = useState<[number, number] | null>(null);
    const [endPos, setEndPos] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (!routeRequest?.destination) return;

        const fetchRoute = async () => {
            try {
                // 1. Geocode Source (Default to Chennai Center if 'Current Location')
                let start: [number, number] = [13.0827, 80.2707];
                if (routeRequest.source && routeRequest.source.toLowerCase() !== 'current location') {
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(routeRequest.source + ', Chennai')}`);
                    const data = await res.json();
                    if (data && data[0]) start = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                }

                // 2. Geocode Destination
                let end: [number, number] | null = null;
                const resDest = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(routeRequest.destination + ', Chennai')}`);
                const dataDest = await resDest.json();
                if (dataDest && dataDest[0]) end = [parseFloat(dataDest[0].lat), parseFloat(dataDest[0].lon)];

                if (!end) {
                    console.error("Destination not found");
                    return;
                }

                setStartPos(start);
                setEndPos(end);

                // 3. Fetch OSRM Route
                const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
                const routeRes = await fetch(osrmUrl);
                const routeData = await routeRes.json();

                if (routeData.code === 'Ok' && routeData.routes[0]) {
                    const coords = routeData.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
                    setRouteCoords(coords);

                    // 4. Fit Bounds
                    const bounds = L.latLngBounds(coords);
                    map.fitBounds(bounds, { padding: [50, 50] });
                }

            } catch (error) {
                console.error("Routing Error:", error);
            }
        };

        fetchRoute();
    }, [routeRequest, map]);

    if (routeCoords.length === 0) return null;

    return (
        <>
            {/* Animated Route Line */}
            <Polyline
                positions={routeCoords}
                pathOptions={{
                    color: '#2dd4bf',
                    weight: 6,
                    opacity: 0.8,
                    dashArray: '10, 20', // Dashed line for animation
                    className: 'route-line-animation' // See global css or add style tag
                }}
            />
            <style>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: -200;
                    }
                }
                .route-line-animation {
                    animation: dash 5s linear infinite;
                }
            `}</style>

            {startPos && <Marker position={startPos}><Popup>Start: {routeRequest?.source || 'Current Location'}</Popup></Marker>}
            {endPos && <Marker position={endPos}><Popup>Destination: {routeRequest?.destination}</Popup></Marker>}
        </>
    );
}

interface LeafletMapClientProps {
    incidents: Incident[];
    focusedLocation: [number, number] | null;
    routeRequest?: RouteRequest | null;
}

export default function LeafletMapClient({ incidents, focusedLocation, routeRequest }: LeafletMapClientProps) {
    const CHENNAI_CENTER: [number, number] = [13.0827, 80.2707];

    return (
        <MapContainer
            center={CHENNAI_CENTER}
            zoom={12}
            zoomControl={false}
            style={{ height: '100%', width: '100%', background: '#000000' }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                subdomains='abcd'
                maxZoom={20}
            />
            <ZoomControl position="bottomright" />

            {/* Incidents */}
            {incidents.map(incident => (
                <IncidentMarker key={incident.id} incident={incident} />
            ))}

            {/* Controls */}
            {focusedLocation && <MapController center={focusedLocation} />}
            <RoutingManager routeRequest={routeRequest} />
        </MapContainer>
    );
}
