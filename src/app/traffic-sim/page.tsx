'use client';

import { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import TrafficScene from './components/TrafficScene';
import ControlPanel from './components/ui/ControlPanel';
import MetricsDashboard from './components/ui/MetricsDashboard';
import DecisionFlow from './components/ui/DecisionFlow';
import ComparisonChart from './components/ui/ComparisonChart';
import StoryMode from './components/StoryMode';
import { useTrafficAI } from './hooks/useTrafficAI';
import { Vehicle, AIMode, CameraMode, Direction } from './types';
import { generateVehicleId, getRandomDirection, getVehicleColor, generateVehiclePath, shouldStopAtLight, distanceToIntersection } from './utils';

export default function TrafficSimPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [trafficIntensity, setTrafficIntensity] = useState(50);
    const [ambulanceFrequency, setAmbulanceFrequency] = useState(20);
    const [aiMode, setAiMode] = useState<AIMode>('learning-based');
    const [cameraMode, setCameraMode] = useState<CameraMode>('isometric');
    const [isStoryMode, setIsStoryMode] = useState(false);
    const [storyStep, setStoryStep] = useState(0);

    const { lights, decisions, metrics } = useTrafficAI(vehicles, aiMode);

    // Spawn vehicles
    useEffect(() => {
        const spawnInterval = Math.max(500, 3000 - (trafficIntensity * 25));

        const interval = setInterval(() => {
            if (vehicles.length < 30 && !isStoryMode) {
                const isAmbulance = Math.random() * 100 < ambulanceFrequency;
                const direction = getRandomDirection();
                const lane = Math.random() > 0.5 ? 0 : 1;

                const newVehicle: Vehicle = {
                    id: generateVehicleId(),
                    type: isAmbulance ? 'ambulance' : 'car',
                    direction,
                    position: getStartPosition(direction, lane),
                    speed: isAmbulance ? 0.3 : 0.15,
                    lane,
                    color: getVehicleColor(isAmbulance ? 'ambulance' : 'car'),
                    waitTime: 0,
                };

                setVehicles(prev => [...prev, newVehicle]);
            }
        }, spawnInterval);

        return () => clearInterval(interval);
    }, [trafficIntensity, ambulanceFrequency, vehicles.length, isStoryMode]);

    // Update vehicle positions
    useEffect(() => {
        const interval = setInterval(() => {
            setVehicles(prev => {
                return prev
                    .map(vehicle => {
                        const path = generateVehiclePath(vehicle.direction, vehicle.lane);
                        const currentIndex = path.findIndex(
                            p => Math.abs(p.x - vehicle.position[0]) < 0.5 && Math.abs(p.z - vehicle.position[2]) < 0.5
                        );

                        if (currentIndex === -1 || currentIndex >= path.length - 1) {
                            return null; // Remove vehicle
                        }

                        const distToCenter = distanceToIntersection(vehicle.position);
                        const light = lights.find(l => l.direction === vehicle.direction);
                        const shouldStop = light && shouldStopAtLight(vehicle, light.state, distToCenter);

                        let newSpeed = vehicle.speed;
                        let newWaitTime = vehicle.waitTime;

                        if (shouldStop && distToCenter < 10) {
                            newSpeed = 0;
                            newWaitTime += 0.1;
                        } else {
                            newSpeed = vehicle.type === 'ambulance' ? 0.3 : 0.15;
                        }

                        const nextPoint = path[currentIndex + 1];
                        const direction = {
                            x: nextPoint.x - vehicle.position[0],
                            z: nextPoint.z - vehicle.position[2],
                        };
                        const length = Math.sqrt(direction.x ** 2 + direction.z ** 2);
                        const normalized = { x: direction.x / length, z: direction.z / length };

                        return {
                            ...vehicle,
                            position: [
                                vehicle.position[0] + normalized.x * newSpeed,
                                vehicle.position[1],
                                vehicle.position[2] + normalized.z * newSpeed,
                            ] as [number, number, number],
                            speed: newSpeed,
                            waitTime: newWaitTime,
                        };
                    })
                    .filter(Boolean) as Vehicle[];
            });
        }, 100);

        return () => clearInterval(interval);
    }, [lights]);

    // Story mode controller
    useEffect(() => {
        if (!isStoryMode) return;

        const storyDurations = [3000, 2000, 2500, 3000, 3000, 2500, 3000];
        const duration = storyDurations[storyStep] || 3000;

        if (storyStep === 1) {
            // Spawn ambulance for story
            const ambulance: Vehicle = {
                id: 'story-ambulance',
                type: 'ambulance',
                direction: 'south',
                position: [1, 0.5, 25],
                speed: 0.3,
                lane: 0,
                color: '#ff3333',
                waitTime: 0,
            };
            setVehicles(prev => [...prev, ambulance]);
            setCameraMode('follow');
        }

        if (storyStep < 6) {
            const timer = setTimeout(() => {
                setStoryStep(prev => prev + 1);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isStoryMode, storyStep]);

    const handleStartStory = useCallback(() => {
        setIsStoryMode(true);
        setStoryStep(0);
        setVehicles([]);
        setCameraMode('isometric');
    }, []);

    const handleCompleteStory = useCallback(() => {
        setIsStoryMode(false);
        setStoryStep(0);
        setCameraMode('isometric');
    }, []);

    return (
        <div className="h-screen w-full bg-black relative overflow-hidden">
            {/* 3D Canvas */}
            <Canvas
                shadows
                camera={{ position: [30, 30, 30], fov: 50 }}
                className="absolute inset-0"
            >
                <TrafficScene vehicles={vehicles} lights={lights} cameraMode={cameraMode} />
            </Canvas>

            {/* UI Overlay */}
            <ControlPanel
                trafficIntensity={trafficIntensity}
                setTrafficIntensity={setTrafficIntensity}
                ambulanceFrequency={ambulanceFrequency}
                setAmbulanceFrequency={setAmbulanceFrequency}
                aiMode={aiMode}
                setAiMode={setAiMode}
                cameraMode={cameraMode}
                setCameraMode={setCameraMode}
                onStartStory={handleStartStory}
                isStoryMode={isStoryMode}
            />

            <MetricsDashboard metrics={metrics} />
            <DecisionFlow decisions={decisions} />
            <ComparisonChart />

            {/* Story Mode Overlay */}
            <StoryMode
                isActive={isStoryMode}
                step={storyStep}
                onComplete={handleCompleteStory}
            />

            {/* Title Badge */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-teal via-accent-purple to-accent-cyan">
                    Traffic AI Simulation (3D)
                </h1>
            </div>
        </div>
    );
}

function getStartPosition(direction: Direction, lane: number): [number, number, number] {
    const laneOffset = (lane - 0.5) * 2;

    switch (direction) {
        case 'north': return [laneOffset, 0.5, -25];
        case 'south': return [-laneOffset, 0.5, 25];
        case 'east': return [-25, 0.5, laneOffset];
        case 'west': return [25, 0.5, -laneOffset];
    }
}
