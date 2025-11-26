'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';
import AccidentAlert from './AccidentAlert';

const containerStyle = {
    width: '100%',
    height: '100%'
};

const defaultCenter = {
    lat: 28.6139,
    lng: 77.2090
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
        },
        {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
        },
        {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
        },
        {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
        },
        {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
        },
        {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
        },
        {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
        },
    ]
};

interface MapViewProps {
    routeRequest: any;
}

export default function MapView({ routeRequest }: MapViewProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
        libraries: ['places', 'geometry']
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [accidentAlert, setAccidentAlert] = useState<{ show: boolean, location: google.maps.LatLng | null }>({ show: false, location: null });
    const [currentRouteIndex, setCurrentRouteIndex] = useState(0);

    // Log any loading errors
    useEffect(() => {
        if (loadError) {
            console.error('Google Maps API loading error:', loadError);
        }
    }, [loadError]);

    // Check if API key is present
    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
        console.log('Google Maps API Key present:', !!apiKey);
        if (!apiKey) {
            console.error('NEXT_PUBLIC_GOOGLE_MAPS_KEY is not set in environment variables');
        }
    }, []);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    useEffect(() => {
        if (isLoaded && routeRequest && map) {
            const directionsService = new google.maps.DirectionsService();

            const origin = routeRequest.source === 'Current Location' ? defaultCenter : routeRequest.source; // Fallback for demo

            directionsService.route(
                {
                    origin: origin,
                    destination: routeRequest.destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                    provideRouteAlternatives: true
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK && result) {
                        setDirections(result);

                        // Simulate accident detection after 3 seconds
                        setTimeout(() => {
                            if (result.routes[0] && result.routes[0].overview_path) {
                                const path = result.routes[0].overview_path;
                                const accidentPoint = path[Math.floor(path.length * 0.3)]; // 30% along the route
                                setAccidentAlert({ show: true, location: accidentPoint });
                            }
                        }, 3000);
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );
        }
    }, [isLoaded, routeRequest, map]);

    const handleRedirect = () => {
        setAccidentAlert({ ...accidentAlert, show: false });
        // In a real app, we would recalculate the route avoiding the accident point
        // For prototype, we'll just switch to an alternative route if available
        if (directions && directions.routes.length > 1) {
            setCurrentRouteIndex(1); // Switch to alternative
        }
    };

    const handleContinue = () => {
        setAccidentAlert({ ...accidentAlert, show: false });
    };

    if (loadError) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/20 backdrop-blur-xl p-8 text-center">
                <div className="text-red-500 text-xl mb-4">⚠️ Maps Loading Error</div>
                <p className="text-text-secondary mb-2">Google Maps failed to load.</p>
                <p className="text-sm text-text-secondary mb-4">Please check:</p>
                <ul className="text-left text-sm text-text-secondary space-y-1">
                    <li>✓ API key is valid</li>
                    <li>✓ Billing is enabled on Google Cloud</li>
                    <li>✓ Maps JavaScript API is enabled</li>
                    <li>✓ Directions API is enabled</li>
                </ul>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-xl">
                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={mapOptions}
            >
                {directions && (
                    <DirectionsRenderer
                        directions={directions}
                        routeIndex={currentRouteIndex}
                        options={{
                            polylineOptions: {
                                strokeColor: routeRequest?.preferences?.includes('pollution-free') ? '#34D399' : '#00D9FF',
                                strokeWeight: 5
                            }
                        }}
                    />
                )}

                {accidentAlert.location && (
                    <Marker
                        position={accidentAlert.location}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: "#EF4444",
                            fillOpacity: 1,
                            strokeColor: "#ffffff",
                            strokeWeight: 2,
                        }}
                        animation={google.maps.Animation.BOUNCE}
                    />
                )}
            </GoogleMap>

            {accidentAlert.show && (
                <AccidentAlert
                    onRedirect={handleRedirect}
                    onContinue={handleContinue}
                />
            )}
        </div>
    );
}
