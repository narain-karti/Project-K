import { Incident } from '../hooks/useIncidentData';
import GlassPanel from './GlassPanel';

interface IntelligencePanelProps {
    incidents: Incident[];
}

export default function IntelligencePanel({ incidents }: IntelligencePanelProps) {
    const total = incidents.length;
    const critical = incidents.filter(i => i.severity === 'CRITICAL').length;
    const warning = incidents.filter(i => i.severity === 'WARNING').length;

    return (
        <GlassPanel className="w-full pointer-events-auto">
            <div className="flex items-center justify-between text-white">
                <div>
                    <h2 className="text-lg font-bold">Chennai Intelligence</h2>
                    <p className="text-xs text-white/50">Live ML Detections</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-indigo-400">{total}</div>
                    <p className="text-[10px] uppercase tracking-wider text-white/40">Active Events</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-center">
                    <span className="block text-red-500 font-bold text-lg">{critical}</span>
                    <span className="text-[10px] text-red-400/80 uppercase">Critical</span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg text-center">
                    <span className="block text-amber-500 font-bold text-lg">{warning}</span>
                    <span className="text-[10px] text-amber-400/80 uppercase">Warnings</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-[10px] text-white/30 text-center">
                SYSTEM OPERATIONAL • V2.4.0
            </div>
        </GlassPanel>
    );
}
