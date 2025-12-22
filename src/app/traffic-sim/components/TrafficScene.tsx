'use client';

import { useMemo } from 'react';
import Vehicle from './Vehicle';
import TrafficLight from './TrafficLight';
import CameraController from './CameraController';
import { Vehicle as VehicleType, TrafficLightState, CameraMode } from '../types';

interface TrafficSceneProps {
    vehicles: VehicleType[];
    lights: TrafficLightState[];
    cameraMode: CameraMode;
}

export default function TrafficScene({ vehicles, lights, cameraMode }: TrafficSceneProps) {
    const ambulance = useMemo(() => vehicles.find(v => v.type === 'ambulance') || null, [vehicles]);

    return (
        <>
            <CameraController mode={cameraMode} ambulance={ambulance} />

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
                position={[20, 40, 20]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-left={-50}
                shadow-camera-right={50}
                shadow-camera-top={50}
                shadow-camera-bottom={-50}
            />
            <hemisphereLight intensity={0.3} color="#ffffff" groundColor="#444444" />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* Roads */}
            {/* North-South road */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
                <planeGeometry args={[8, 100]} />
                <meshStandardMaterial color="#2a2a2a" />
            </mesh>

            {/* East-West road */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
                <planeGeometry args={[100, 8]} />
                <meshStandardMaterial color="#2a2a2a" />
            </mesh>

            {/* Lane markings - North-South */}
            {Array.from({ length: 20 }).map((_, i) => (
                <mesh key={`ns-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -45 + i * 5]}>
                    <planeGeometry args={[0.2, 2]} />
                    <meshBasicMaterial color="#ffff00" />
                </mesh>
            ))}

            {/* Lane markings - East-West */}
            {Array.from({ length: 20 }).map((_, i) => (
                <mesh key={`ew-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-45 + i * 5, 0.02, 0]}>
                    <planeGeometry args={[2, 0.2]} />
                    <meshBasicMaterial color="#ffff00" />
                </mesh>
            ))}

            {/* Intersection center marking */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                <ringGeometry args={[3, 4, 32]} />
                <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
            </mesh>

            {/* Traffic Lights */}
            <TrafficLight
                lightState={lights.find(l => l.direction === 'north') || lights[0]}
                position={[5, 0, 8]}
            />
            <TrafficLight
                lightState={lights.find(l => l.direction === 'south') || lights[1]}
                position={[-5, 0, -8]}
            />
            <TrafficLight
                lightState={lights.find(l => l.direction === 'east') || lights[2]}
                position={[8, 0, -5]}
            />
            <TrafficLight
                lightState={lights.find(l => l.direction === 'west') || lights[3]}
                position={[-8, 0, 5]}
            />

            {/* Vehicles */}
            {vehicles.map(vehicle => (
                <Vehicle key={vehicle.id} vehicle={vehicle} />
            ))}

            {/* Grid helper for debugging (subtle) */}
            <gridHelper args={[100, 50, '#333333', '#222222']} position={[0, 0.001, 0]} />
        </>
    );
}
