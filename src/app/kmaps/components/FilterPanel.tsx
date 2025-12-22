import { FilterState, IncidentType } from '../hooks/useIncidentData';
import GlassPanel from './GlassPanel';
import { motion } from 'framer-motion';

interface FilterPanelProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
}

export default function FilterPanel({ filters, setFilters }: FilterPanelProps) {
    const toggleType = (type: IncidentType) => {
        setFilters({
            ...filters,
            types: {
                ...filters.types,
                [type]: !filters.types[type]
            }
        });
    };

    const typeConfig: { id: IncidentType; label: string; color: string }[] = [
        { id: 'ACCIDENT', label: 'Accidents', color: 'bg-red-500' },
        { id: 'AMBULANCE', label: 'Ambulance', color: 'bg-green-500' },
        { id: 'POTHOLE', label: 'Potholes', color: 'bg-amber-500' },
        { id: 'WATERLOG', label: 'Waterlog', color: 'bg-blue-500' },
    ];

    return (
        <GlassPanel title="Map Layers" className="w-full">
            <div className="space-y-3">
                {/* Type Toggles */}
                <div className="space-y-2">
                    {typeConfig.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => toggleType(type.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg 
                                transition-all duration-200 hover:bg-white/5
                                ${filters.types[type.id] ? 'bg-white/10 shadow-lg' : 'bg-transparent text-white/40'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${type.color} ${filters.types[type.id] ? 'animate-pulse shadow-[0_0_8px_currentColor]' : ''}`} />
                                <span className="text-sm font-medium">{type.label}</span>
                            </div>
                            <div className={`w-12 h-6 rounded-full relative transition-colors ${filters.types[type.id] ? 'bg-indigo-500' : 'bg-white/10'}`}>
                                <motion.div
                                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg"
                                    animate={{ x: filters.types[type.id] ? 24 : 0 }}
                                />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Confidence Slider */}

            </div>
        </GlassPanel>
    );
}
