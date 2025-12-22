'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Vehicle as VehicleType } from '../types';

interface VehicleProps {
    vehicle: VehicleType;
}

export default function Vehicle({ vehicle }: VehicleProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    // Blinking light animation for ambulance
    useFrame((state) => {
        if (vehicle.type === 'ambulance' && lightRef.current) {
            const blink = Math.sin(state.clock.elapsedTime * 8) > 0;
            lightRef.current.intensity = blink ? 3 : 0;
        }

        // Slight bobbing animation
        if (meshRef.current) {
            meshRef.current.position.y = vehicle.position[1] + Math.sin(state.clock.elapsedTime * 2 + vehicle.position[0]) * 0.05;
        }
    });

    const isAmbulance = vehicle.type === 'ambulance';

    return (
        <group position={vehicle.position}>
            {/* Vehicle body */}
            <mesh ref={meshRef} castShadow>
                <boxGeometry args={isAmbulance ? [1.5, 1.2, 3] : [1.2, 0.8, 2.5]} />
                <meshStandardMaterial
                    color={vehicle.color}
                    metalness={0.6}
                    roughness={0.4}
                    emissive={isAmbulance ? '#ff3333' : '#000000'}
                    emissiveIntensity={isAmbulance ? 0.3 : 0}
                />
            </mesh>

            {/* Ambulance siren light */}
            {isAmbulance && (
                <>
                    <pointLight
                        ref={lightRef}
                        position={[0, 1, 0]}
                        color="#ff0000"
                        intensity={0}
                        distance={10}
                    />
                    <mesh position={[0, 0.7, 0]}>
                        <cylinderGeometry args={[0.2, 0.2, 0.3, 8]} />
                        <meshStandardMaterial
                            color="#ff0000"
                            emissive="#ff0000"
                            emissiveIntensity={0.8}
                        />
                    </mesh>
                </>
            )}

            {/* Windows */}
            <mesh position={[0, 0.3, 0.5]}>
                <boxGeometry args={[1, 0.4, 0.1]} />
                <meshStandardMaterial color="#333333" transparent opacity={0.6} />
            </mesh>
        </group>
    );
}
