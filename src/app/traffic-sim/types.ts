export type VehicleType = 'car' | 'ambulance';
export type Direction = 'north' | 'south' | 'east' | 'west';
export type LightState = 'red' | 'yellow' | 'green';
export type AIMode = 'rule-based' | 'learning-based';
export type CameraMode = 'top-down' | 'isometric' | 'follow';

export interface Vehicle {
    id: string;
    type: VehicleType;
    direction: Direction;
    position: [number, number, number];
    speed: number;
    lane: number;
    color: string;
    waitTime: number;
}

export interface TrafficLightState {
    direction: Direction;
    state: LightState;
    timer: number;
    duration: number;
}

export interface Lane {
    direction: Direction;
    vehicles: Vehicle[];
    density: number;
}

export interface Metrics {
    averageWaitTime: number;
    throughput: number;
    ambulanceResponseTime: number;
    aiDecisions: number;
    totalVehicles: number;
    vehiclesProcessed: number;
}

export interface Decision {
    timestamp: number;
    type: 'density-adjust' | 'ambulance-preempt' | 'normal-cycle';
    description: string;
    affectedLanes: Direction[];
}

export interface SimulationState {
    vehicles: Vehicle[];
    lights: TrafficLightState[];
    metrics: Metrics;
    decisions: Decision[];
    aiMode: AIMode;
    cameraMode: CameraMode;
    trafficIntensity: number;
    ambulanceFrequency: number;
    isStoryMode: boolean;
    storyStep: number;
}
