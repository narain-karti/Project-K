import { Direction, Vehicle } from './types';
import * as THREE from 'three';

// Generate path points for vehicle movement along a lane
export function generateVehiclePath(direction: Direction, lane: number): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];
    const laneOffset = (lane - 0.5) * 2; // -1, 1 for two lanes
    const pathLength = 50;

    switch (direction) {
        case 'north':
            for (let i = 0; i <= pathLength; i++) {
                points.push(new THREE.Vector3(laneOffset, 0.5, -25 + i));
            }
            break;
        case 'south':
            for (let i = 0; i <= pathLength; i++) {
                points.push(new THREE.Vector3(-laneOffset, 0.5, 25 - i));
            }
            break;
        case 'east':
            for (let i = 0; i <= pathLength; i++) {
                points.push(new THREE.Vector3(-25 + i, 0.5, laneOffset));
            }
            break;
        case 'west':
            for (let i = 0; i <= pathLength; i++) {
                points.push(new THREE.Vector3(25 - i, 0.5, -laneOffset));
            }
            break;
    }

    return points;
}

// Calculate vehicle density for a lane
export function calculateDensity(vehicles: Vehicle[], direction: Direction): number {
    const laneVehicles = vehicles.filter(v => v.direction === direction);
    return Math.min(laneVehicles.length / 10, 1); // Normalize to 0-1
}

// Get vehicle color based on type
export function getVehicleColor(type: 'car' | 'ambulance'): string {
    return type === 'ambulance' ? '#ff3333' : '#3b82f6';
}

// Get traffic light color
export function getLightColor(state: 'red' | 'yellow' | 'green'): string {
    switch (state) {
        case 'red': return '#ff0000';
        case 'yellow': return '#ffff00';
        case 'green': return '#00ff00';
    }
}

// Calculate optimal green light duration based on density
export function calculateGreenDuration(density: number, aiMode: 'rule-based' | 'learning-based'): number {
    const baseDuration = 5000; // 5 seconds

    if (aiMode === 'rule-based') {
        // Simple threshold-based
        if (density > 0.7) return baseDuration * 1.5;
        if (density > 0.4) return baseDuration;
        return baseDuration * 0.7;
    } else {
        // Adaptive learning simulation
        return baseDuration * (0.5 + density * 1.5);
    }
}

// Check if vehicle should stop at light
export function shouldStopAtLight(
    vehicle: Vehicle,
    lightState: 'red' | 'yellow' | 'green',
    distanceToIntersection: number
): boolean {
    if (lightState === 'green') return false;
    if (vehicle.type === 'ambulance') return false; // Ambulances don't stop
    if (lightState === 'red' && distanceToIntersection < 8) return true;
    if (lightState === 'yellow' && distanceToIntersection < 5) return true;
    return false;
}

// Generate unique vehicle ID
export function generateVehicleId(): string {
    return `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get random direction
export function getRandomDirection(): Direction {
    const directions: Direction[] = ['north', 'south', 'east', 'west'];
    return directions[Math.floor(Math.random() * directions.length)];
}

// Calculate distance to intersection center
export function distanceToIntersection(position: [number, number, number]): number {
    return Math.sqrt(position[0] ** 2 + position[2] ** 2);
}
