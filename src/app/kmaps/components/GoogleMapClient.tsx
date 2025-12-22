'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer, DirectionsService } from '@react-google-maps/api';
import { Incident } from '../hooks/useIncidentData';
import { AlertTriangle, CloudRain, Shield, Activity, X } from 'lucide-react';

const CHENNAI_CENTER = { lat: 13.0827, lng: 80.2707 };

const containerStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000'
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
        { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
        { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
        { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
        { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
        { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
        { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
        { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
    ]
};

interface RouteRequest {
    source?: string;
    destination?: string;
    preferences?: string[];
}

interface GoogleMapClientProps {
    incidents: Incident[];
    focusedLocation: [number, number] | null;
    routeRequest?: RouteRequest | null;
}

function GoogleMapClient({ incidents, focusedLocation, routeRequest }: GoogleMapClientProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
        libraries: ['places']
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Handle Route Requests
    useEffect(() => {
        if (!routeRequest?.destination || !map) return;

        const directionsService = new google.maps.DirectionsService();

        // Default source to Chennai Center if not provided (simulating 'Current Location')
        const origin = routeRequest.source && routeRequest.source.toLowerCase() !== 'current location'
            ? routeRequest.source
            : CHENNAI_CENTER;

        directionsService.route({
            origin: origin,
            destination: routeRequest.destination,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
                setDirectionsResponse(result);

                // Fit bounds to route
                const bounds = new google.maps.LatLngBounds();
                result.routes[0].legs.forEach(leg => {
                    leg.steps.forEach(step => {
                        bounds.extend(step.start_location);
                        bounds.extend(step.end_location);
                    });
                });
                map.fitBounds(bounds);
            } else {
                console.error(`Directions request failed due to ${status}`);
            }
        });
    }, [routeRequest, map]);

    // Handle Focused Location Updates (Fly to)
    useEffect(() => {
        if (focusedLocation && map) {
            map.panTo({ lat: focusedLocation[0], lng: focusedLocation[1] });
            map.setZoom(15);
        }
    }, [focusedLocation, map]);

    if (!isLoaded) return <div className="w-full h-full bg-black flex items-center justify-center text-white/50">Loading K-Maps Platform...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={CHENNAI_CENTER}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={mapOptions}
        >
            {/* Directions Renderer */}
            {directionsResponse && (
                <DirectionsRenderer
                    options={{
                        directions: directionsResponse,
                        polylineOptions: {
                            strokeColor: '#2dd4bf', // Accent Teal
                            strokeWeight: 6,
                            strokeOpacity: 0.8
                        },
                        suppressMarkers: false
                    }}
                />
            )}

            {/* Incident Markers */}
            {incidents.map(incident => (
                <Marker
                    key={incident.id}
                    position={{ lat: incident.location[0], lng: incident.location[1] }}
                    onClick={() => setSelectedIncident(incident)}
                    icon={{
                        url: incident.type === 'accident'
                            ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                            : incident.type === 'pothole'
                                ? 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                                : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }}
                />
            ))}

            {/* Info Window for Selected Incident */}
            {selectedIncident && (
                <InfoWindow
                    position={{ lat: selectedIncident.location[0], lng: selectedIncident.location[1] }}
                    onCloseClick={() => setSelectedIncident(null)}
                >
                    <div className="p-2 min-w-[200px] text-black">
                        <div className="flex items-center gap-2 mb-2">
                            {selectedIncident.type === 'accident' && <AlertTriangle className="text-red-600 w-5 h-5" />}
                            {selectedIncident.type === 'pothole' && <AlertTriangle className="text-orange-500 w-5 h-5" />}
                            {selectedIncident.type === 'congestion' && <Activity className="text-yellow-500 w-5 h-5" />}
                            <h3 className="font-bold capitalize">{selectedIncident.type} Detected</h3>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{new Date(selectedIncident.timestamp).toLocaleTimeString()}</p>
                        <div className="flex gap-2 text-xs font-bold">
                            <span className="bg-gray-200 px-2 py-1 rounded">Confidence: {(selectedIncident.confidence * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                </InfoWindow>
            )}

            {/* Smart Route Label Overlay (Simulated) */}
            {routeRequest && directionsResponse && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-accent-teal/50 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-accent-teal/20 text-white z-10 pointer-events-none">
                    <Shield className="w-4 h-4 text-accent-teal" />
                    <span className="text-sm font-medium">
                        Optimized for: <span className="text-accent-teal font-bold">{routeRequest.preferences?.[0] || 'Fastest Route'}</span>
                    </span>
                </div>
            )}
        </GoogleMap>
    );
}

export default memo(GoogleMapClient);
