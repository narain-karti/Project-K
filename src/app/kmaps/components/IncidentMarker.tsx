import { Incident } from '../hooks/useIncidentData';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { AlertTriangle, Ambulance, Droplets, Construction, Zap } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

// Helper to get Lucide icon as string
const getIconString = (type: string) => {
    switch (type) {
        case 'ACCIDENT': return ReactDOMServer.renderToString(<AlertTriangle size={18} color="white" />);
        case 'AMBULANCE': return ReactDOMServer.renderToString(<Ambulance size={18} color="white" />);
        case 'POTHOLE': return ReactDOMServer.renderToString(<Construction size={18} color="white" />);
        case 'WATERLOG': return ReactDOMServer.renderToString(<Droplets size={18} color="white" />);
        default: return ReactDOMServer.renderToString(<Zap size={18} color="white" />);
    }
};

const getIconHtml = (type: string, severity: string) => {
    let color = '#3B82F6';
    let pulseColor = 'rgba(59, 130, 246, 0.5)';

    switch (type) {
        case 'ACCIDENT': color = '#EF4444'; pulseColor = 'rgba(239, 68, 68, 0.6)'; break;
        case 'AMBULANCE': color = '#10B981'; pulseColor = 'rgba(16, 185, 129, 0.6)'; break;
        case 'POTHOLE': color = '#F59E0B'; pulseColor = 'rgba(245, 158, 11, 0.6)'; break;
        case 'WATERLOG': color = '#06B6D4'; pulseColor = 'rgba(6, 182, 212, 0.6)'; break;
    }

    const iconSvg = getIconString(type);
    const pulseClass = severity === 'CRITICAL' ? 'marker-pulse-critical' : 'marker-pulse-normal';

    return `
        <div class="relative w-10 h-10 flex items-center justify-center group">
            <style>
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
                .marker-pulse-critical::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: ${pulseColor};
                    animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                }
                .marker-pulse-normal::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: ${pulseColor};
                    animation: pulse-ring 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                }
            </style>
            <div class="${pulseClass} absolute inset-0 rounded-full"></div>
            <div class="relative z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-2 border-white/90 transition-transform duration-300 group-hover:scale-110" style="background: linear-gradient(135deg, ${color}, #000);">
                ${iconSvg}
            </div>
        </div>
    `;
};

interface IncidentMarkerProps {
    incident: Incident;
}

export default function IncidentMarker({ incident }: IncidentMarkerProps) {
    const [icon, setIcon] = useState<L.DivIcon | null>(null);

    useEffect(() => {
        const newIcon = L.divIcon({
            className: 'custom-marker-icon', // Use transparent class
            html: getIconHtml(incident.type, incident.severity),
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -20]
        });
        setIcon(newIcon);
    }, [incident]);

    if (!icon) return null;

    return (
        <Marker position={incident.location} icon={icon}>
            <Popup className="premium-popup" closeButton={false}>
                <div className="p-3 min-w-[240px] bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl font-sans text-white">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${incident.severity === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                            <span className="text-sm font-bold tracking-wide">{incident.type}</span>
                        </div>
                        <span className="text-[10px] font-mono opacity-50 bg-white/5 px-2 py-1 rounded">
                            {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <h3 className="text-base font-semibold leading-snug">{incident.locationLabel}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                            <AlertTriangle size={12} />
                            <span>Severity: <span className="text-white">{incident.severity}</span></span>
                        </div>

                        <div className="mt-3 pt-2 flex gap-2">
                            <button className="flex-1 bg-white/10 hover:bg-white/20 text-[10px] font-bold py-1.5 rounded transition-colors">
                                VERIFY
                            </button>
                            <button className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-bold py-1.5 rounded transition-colors border border-indigo-500/30">
                                DETAILS
                            </button>
                        </div>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}
