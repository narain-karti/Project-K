import { Incident } from '../hooks/useIncidentData';
import GlassPanel from './GlassPanel';
// date-fns removed

interface IncidentFeedProps {
    incidents: Incident[];
    onIncidentClick: (incident: Incident) => void;
}

export default function IncidentFeed({ incidents, onIncidentClick }: IncidentFeedProps) {
    return (
        <GlassPanel title="Live Feed" className="h-[300px] flex flex-col" noPadding>
            <div className="overflow-y-auto custom-scrollbar flex-1 px-4 py-3 space-y-2">
                {incidents.length === 0 && (
                    <div className="text-center text-white/30 py-8 text-sm">
                        Waiting for detections...
                    </div>
                )}
                {incidents.slice(0, 20).map((inc) => (
                    <div
                        key={inc.id}
                        onClick={() => onIncidentClick(inc)}
                        className="group flex gap-3 p-2 rounded hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                    >
                        <div className="mt-1">
                            {inc.type === 'ACCIDENT' && <span className="text-lg">🚨</span>}
                            {inc.type === 'AMBULANCE' && <span className="text-lg">🚑</span>}
                            {inc.type === 'POTHOLE' && <span className="text-lg">🕳️</span>}
                            {inc.type === 'WATERLOG' && <span className="text-lg">🌊</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-medium text-white/90 truncate group-hover:text-indigo-400 transition-colors">
                                    {inc.type}
                                </h4>
                                <span className="text-[10px] text-white/40 font-mono whitespace-nowrap">
                                    {new Date(inc.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-xs text-white/50 truncate">
                                {inc.locationLabel}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full 
                                    ${inc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' :
                                        inc.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-500' :
                                            'bg-blue-500/20 text-blue-500'}`}>
                                    {inc.confidence}% Conf.
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </GlassPanel>
    );
}
