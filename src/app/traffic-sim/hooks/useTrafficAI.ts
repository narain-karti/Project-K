'use client';

import { useState, useEffect, useCallback } from 'react';
import { Vehicle, TrafficLightState, Decision, AIMode, Direction, Metrics } from '../types';
import { calculateDensity, calculateGreenDuration } from '../utils';

const DIRECTIONS: Direction[] = ['north', 'south', 'east', 'west'];

export function useTrafficAI(vehicles: Vehicle[], aiMode: AIMode) {
    const [lights, setLights] = useState<TrafficLightState[]>([
        { direction: 'north', state: 'green', timer: 0, duration: 5000 },
        { direction: 'south', state: 'red', timer: 0, duration: 5000 },
        { direction: 'east', state: 'red', timer: 0, duration: 5000 },
        { direction: 'west', state: 'red', timer: 0, duration: 5000 },
    ]);

    const [decisions, setDecisions] = useState<Decision[]>([]);
    const [metrics, setMetrics] = useState<Metrics>({
        averageWaitTime: 0,
        throughput: 0,
        ambulanceResponseTime: 0,
        aiDecisions: 0,
        totalVehicles: 0,
        vehiclesProcessed: 0,
    });

    // Detect ambulance and preempt signals
    const detectAmbulance = useCallback(() => {
        const ambulance = vehicles.find(v => v.type === 'ambulance');
        if (!ambulance) return null;

        const distanceToCenter = Math.sqrt(
            ambulance.position[0] ** 2 + ambulance.position[2] ** 2
        );

        // Preempt if ambulance is within 20 units of intersection
        if (distanceToCenter < 20) {
            return ambulance.direction;
        }
        return null;
    }, [vehicles]);

    // Calculate lane densities
    const getLaneDensities = useCallback(() => {
        return DIRECTIONS.map(dir => ({
            direction: dir,
            density: calculateDensity(vehicles, dir),
        }));
    }, [vehicles]);

    // Update traffic lights based on AI logic
    useEffect(() => {
        const interval = setInterval(() => {
            const ambulanceDirection = detectAmbulance();

            setLights(prevLights => {
                const newLights = [...prevLights];

                // AMBULANCE PREEMPTION
                if (ambulanceDirection) {
                    const preempted = newLights.some(
                        light => light.direction === ambulanceDirection && light.state !== 'green'
                    );

                    if (preempted) {
                        setDecisions(prev => [
                            {
                                timestamp: Date.now(),
                                type: 'ambulance-preempt',
                                description: `Ambulance detected on ${ambulanceDirection} lane - preempting signals`,
                                affectedLanes: [ambulanceDirection],
                            },
                            ...prev.slice(0, 9),
                        ]);

                        setMetrics(prev => ({ ...prev, aiDecisions: prev.aiDecisions + 1 }));
                    }

                    // Set ambulance lane to green, others to red
                    return newLights.map(light => ({
                        ...light,
                        state: light.direction === ambulanceDirection ? 'green' : 'red',
                        timer: 0,
                        duration: 8000,
                    }));
                }

                // NORMAL AI CYCLE
                const densities = getLaneDensities();
                let updated = false;

                newLights.forEach((light, index) => {
                    light.timer += 100;

                    // Transition logic
                    if (light.state === 'green' && light.timer >= light.duration) {
                        light.state = 'yellow';
                        light.timer = 0;
                        light.duration = 2000; // Yellow duration
                        updated = true;
                    } else if (light.state === 'yellow' && light.timer >= light.duration) {
                        light.state = 'red';
                        light.timer = 0;

                        // Find next direction to turn green based on density
                        const currentIndex = DIRECTIONS.indexOf(light.direction);
                        const nextIndex = (currentIndex + 1) % DIRECTIONS.length;
                        const nextDirection = DIRECTIONS[nextIndex];
                        const nextLight = newLights.find(l => l.direction === nextDirection);

                        if (nextLight) {
                            const density = densities.find(d => d.direction === nextDirection)?.density || 0.5;
                            nextLight.state = 'green';
                            nextLight.timer = 0;
                            nextLight.duration = calculateGreenDuration(density, aiMode);

                            if (aiMode === 'learning-based') {
                                setDecisions(prev => [
                                    {
                                        timestamp: Date.now(),
                                        type: 'density-adjust',
                                        description: `Adjusted ${nextDirection} green time to ${(nextLight.duration / 1000).toFixed(1)}s (density: ${(density * 100).toFixed(0)}%)`,
                                        affectedLanes: [nextDirection],
                                    },
                                    ...prev.slice(0, 9),
                                ]);
                            }

                            updated = true;
                        }
                    }
                });

                if (updated) {
                    setMetrics(prev => ({ ...prev, aiDecisions: prev.aiDecisions + 1 }));
                }

                return newLights;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [vehicles, aiMode, detectAmbulance, getLaneDensities]);

    // Update metrics
    useEffect(() => {
        const totalWaitTime = vehicles.reduce((sum, v) => sum + v.waitTime, 0);
        const avgWait = vehicles.length > 0 ? totalWaitTime / vehicles.length : 0;

        setMetrics(prev => ({
            ...prev,
            averageWaitTime: avgWait,
            throughput: prev.vehiclesProcessed / ((Date.now() - (prev as any).startTime || 1) / 60000),
            totalVehicles: vehicles.length,
        }));
    }, [vehicles]);

    return { lights, decisions, metrics };
}
