// TypeScript types for Traffic AI Simulation

export interface Vector2D {
    x: number;
    y: number;
}

export type VehicleType = 'car' | 'ambulance' | 'truck';
export type Direction = 'north' | 'south' | 'east' | 'west';
export type TrafficLightState = 'red' | 'yellow' | 'green';
export type TrafficMode = 'fixed' | 'adaptive' | 'emergency';

export interface Vehicle {
    id: string;
    type: VehicleType;
    position: Vector2D;
    velocity: Vector2D;
    direction: Direction;
    speed: number;
    maxSpeed: number;
    color: string;
    waitTime: number;
    hasPassedIntersection: boolean;
}

export interface TrafficLight {
    direction: Direction;
    state: TrafficLightState;
    timer: number;
    greenDuration: number;
    yellowDuration: number;
    redDuration: number;
}

export interface IntersectionState {
    lights: TrafficLight[];
    queueLengths: Record<Direction, number>;
    vehicleDensity: Record<Direction, number>;
    emergencyPresent: Record<Direction, boolean>;
}

export interface SimulationMetrics {
    averageWaitTime: number;
    totalVehiclesProcessed: number;
    throughput: number; // vehicles per minute
    signalEfficiency: number; // percentage
    ambulanceResponseTime: number;
    ambulancesProcessed: number;
    timeSaved: number; // vs fixed timer
}

export interface AIDecision {
    timestamp: number;
    currentMode?: TrafficMode;
    activeDirection?: Direction;
    reasoning?: string;
    queueScores?: Record<Direction, number>;
    emergencyOverride: boolean;
    suggestedGreenDuration?: number;
    // Additional properties for TrafficSimulation3D
    action?: string;
    reason?: string;
    priorityScores?: Record<Direction, number>;
    selectedDirection?: Direction;
    signalDuration?: number;
}

export interface SimulationConfig {
    trafficIntensity: number; // vehicles spawned per minute
    ambulanceFrequency: number; // 0-100 percentage
    mode: TrafficMode;
    speed: number; // simulation speed multiplier
    isRunning: boolean;
}

export interface ComparisonData {
    fixedTimer: {
        avgWaitTime: number;
        throughput: number;
        ambulanceTime: number;
    };
    adaptive: {
        avgWaitTime: number;
        throughput: number;
        ambulanceTime: number;
    };
    emergencyPriority: {
        avgWaitTime: number;
        throughput: number;
        ambulanceTime: number;
    };
}
