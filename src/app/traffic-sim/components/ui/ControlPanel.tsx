'use client';

import { AIMode, CameraMode } from '../../types';

interface ControlPanelProps {
    trafficIntensity: number;
    setTrafficIntensity: (value: number) => void;
    ambulanceFrequency: number;
    setAmbulanceFrequency: (value: number) => void;
    aiMode: AIMode;
    setAiMode: (mode: AIMode) => void;
    cameraMode: CameraMode;
    setCameraMode: (mode: CameraMode) => void;
    onStartStory: () => void;
    isStoryMode: boolean;
}

export default function ControlPanel({
    trafficIntensity,
    setTrafficIntensity,
    ambulanceFrequency,
    setAmbulanceFrequency,
    aiMode,
    setAiMode,
    cameraMode,
    setCameraMode,
    onStartStory,
    isStoryMode,
}: ControlPanelProps) {
    return (
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-80 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-teal rounded-full animate-pulse" />
                Control Panel
            </h2>

            {/* Traffic Intensity */}
            <div className="mb-4">
                <label className="text-sm text-white/70 mb-2 block">Traffic Intensity</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={trafficIntensity}
                    onChange={(e) => setTrafficIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-teal"
                    disabled={isStoryMode}
                />
                <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                </div>
            </div>

            {/* Ambulance Frequency */}
            <div className="mb-4">
                <label className="text-sm text-white/70 mb-2 block">Ambulance Frequency</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={ambulanceFrequency}
                    onChange={(e) => setAmbulanceFrequency(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
                    disabled={isStoryMode}
                />
                <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>Rare</span>
                    <span>Frequent</span>
                </div>
            </div>

            {/* AI Mode */}
            <div className="mb-4">
                <label className="text-sm text-white/70 mb-2 block">AI Mode</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setAiMode('rule-based')}
                        disabled={isStoryMode}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${aiMode === 'rule-based'
                                ? 'bg-accent-teal text-black'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                    >
                        Rule-Based
                    </button>
                    <button
                        onClick={() => setAiMode('learning-based')}
                        disabled={isStoryMode}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${aiMode === 'learning-based'
                                ? 'bg-accent-purple text-white'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                    >
                        Learning
                    </button>
                </div>
            </div>

            {/* Camera Mode */}
            <div className="mb-4">
                <label className="text-sm text-white/70 mb-2 block">Camera View</label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => setCameraMode('top-down')}
                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${cameraMode === 'top-down'
                                ? 'bg-accent-cyan text-black'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                    >
                        Top
                    </button>
                    <button
                        onClick={() => setCameraMode('isometric')}
                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${cameraMode === 'isometric'
                                ? 'bg-accent-cyan text-black'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                    >
                        Iso
                    </button>
                    <button
                        onClick={() => setCameraMode('follow')}
                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${cameraMode === 'follow'
                                ? 'bg-accent-cyan text-black'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                    >
                        Follow
                    </button>
                </div>
            </div>

            {/* Story Mode Button */}
            <button
                onClick={onStartStory}
                disabled={isStoryMode}
                className="w-full py-3 px-4 bg-gradient-to-r from-accent-rose to-accent-orange text-white font-bold rounded-lg hover:shadow-lg hover:shadow-accent-rose/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isStoryMode ? 'Story Mode Active...' : '▶ Start Story Mode'}
            </button>
        </div>
    );
}
