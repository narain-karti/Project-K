'use client';

import { useRef } from 'react';
import { TrafficLightState } from '../types';
import { getLightColor } from '../utils';
import * as THREE from 'three';

interface TrafficLightProps {
    lightState: TrafficLightState;
    position: [number, number, number];
}

export default function TrafficLight({ lightState, position }: TrafficLightProps) {
    const redRef = useRef<THREE.Mesh>(null);
    const yellowRef = useRef<THREE.Mesh>(null);
    const greenRef = useRef<THREE.Mesh>(null);

    const activeColor = getLightColor(lightState.state);

    return (
        <group position={position}>
            {/* Pole */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
                <meshStandardMaterial color="#333333" />
            </mesh>

            {/* Light housing */}
            <mesh position={[0, 4.5, 0]}>
                <boxGeometry args={[0.4, 1.2, 0.3]} />
                <meshStandardMaterial color="#222222" />
            </mesh>

            {/* Red light */}
            <mesh ref={redRef} position={[0, 5, 0.2]}>
                <circleGeometry args={[0.15, 16]} />
                <meshStandardMaterial
                    color={lightState.state === 'red' ? '#ff0000' : '#330000'}
                    emissive={lightState.state === 'red' ? '#ff0000' : '#000000'}
                    emissiveIntensity={lightState.state === 'red' ? 1 : 0}
                />
            </mesh>
            {lightState.state === 'red' && (
                <pointLight position={[0, 5, 0.5]} color="#ff0000" intensity={2} distance={8} />
            )}

            {/* Yellow light */}
            <mesh ref={yellowRef} position={[0, 4.5, 0.2]}>
                <circleGeometry args={[0.15, 16]} />
                <meshStandardMaterial
                    color={lightState.state === 'yellow' ? '#ffff00' : '#333300'}
                    emissive={lightState.state === 'yellow' ? '#ffff00' : '#000000'}
                    emissiveIntensity={lightState.state === 'yellow' ? 1 : 0}
                />
            </mesh>
            {lightState.state === 'yellow' && (
                <pointLight position={[0, 4.5, 0.5]} color="#ffff00" intensity={2} distance={8} />
            )}

            {/* Green light */}
            <mesh ref={greenRef} position={[0, 4, 0.2]}>
                <circleGeometry args={[0.15, 16]} />
                <meshStandardMaterial
                    color={lightState.state === 'green' ? '#00ff00' : '#003300'}
                    emissive={lightState.state === 'green' ? '#00ff00' : '#000000'}
                    emissiveIntensity={lightState.state === 'green' ? 1 : 0}
                />
            </mesh>
            {lightState.state === 'green' && (
                <pointLight position={[0, 4, 0.5]} color="#00ff00" intensity={2} distance={8} />
            )}
        </group>
    );
}
