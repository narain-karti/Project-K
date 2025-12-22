'use client';

import { motion } from 'framer-motion';
import { useSound } from './sounds';

interface Scenario {
    id: string;
    name: string;
    emoji: string;
    description: string;
    config: {
        trafficIntensity: number;
        ambulanceFrequency: number;
        mode: 'fixed' | 'adaptive' | 'emergency';
    };
    color: string;
}

const scenarios: Scenario[] = [
    {
        id: 'rush-hour',
        name: 'Rush Hour',
        emoji: '🚗',
        description: 'Heavy traffic from all directions',
        config: {
            trafficIntensity: 50,
            ambulanceFrequency: 5,
            mode: 'adaptive',
        },
        color: 'from-orange-500/30 to-red-500/30',
    },
    {
        id: 'emergency',
        name: 'Emergency Response',
        emoji: '🚑',
        description: 'Ambulances approaching frequently',
        config: {
            trafficIntensity: 25,
            ambulanceFrequency: 40,
            mode: 'emergency',
        },
        color: 'from-red-500/30 to-pink-500/30',
    },
    {
        id: 'night',
        name: 'Night Mode',
        emoji: '🌃',
        description: 'Light traffic, calm streets',
        config: {
            trafficIntensity: 10,
            ambulanceFrequency: 5,
            mode: 'adaptive',
        },
        color: 'from-indigo-500/30 to-purple-500/30',
    },
    {
        id: 'unbalanced',
        name: 'Unbalanced',
        emoji: '🔀',
        description: 'Heavy on one direction only',
        config: {
            trafficIntensity: 35,
            ambulanceFrequency: 10,
            mode: 'adaptive',
        },
        color: 'from-cyan-500/30 to-blue-500/30',
    },
];

interface Props {
    onSelectScenario: (config: Scenario['config']) => void;
    currentScenario?: string;
}

export default function TrafficScenarios({ onSelectScenario, currentScenario }: Props) {
    const sound = useSound();

    const handleSelect = (scenario: Scenario) => {
        sound.playMode();
        onSelectScenario(scenario.config);
    };

    return (
        <motion.div
            className="glass-card rounded-2xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h3 className="text-lg font-bold mb-3 text-accent-violet">🎬 Traffic Scenarios</h3>
            <div className="grid grid-cols-2 gap-2">
                {scenarios.map((scenario) => (
                    <motion.button
                        key={scenario.id}
                        onClick={() => handleSelect(scenario)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-xl text-left transition-all border ${currentScenario === scenario.id
                            ? 'border-accent-cyan bg-accent-cyan/20'
                            : 'border-white/10 hover:border-white/30'
                            } bg-gradient-to-br ${scenario.color}`}
                    >
                        <div className="text-2xl mb-1">{scenario.emoji}</div>
                        <div className="text-sm font-semibold">{scenario.name}</div>
                        <div className="text-xs text-text-secondary mt-1 line-clamp-2">
                            {scenario.description}
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Preset Info */}
            <div className="mt-3 p-2 bg-white/5 rounded-lg text-xs text-text-secondary">
                <span className="text-accent-cyan">💡 Tip:</span> Select a scenario to instantly configure
                traffic intensity, ambulance frequency, and AI mode.
            </div>
        </motion.div>
    );
}
