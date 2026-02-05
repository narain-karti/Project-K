'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Environment, PerspectiveCamera, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useState, useMemo } from 'react';

// --- 3D Components ---

function CityBlock({ position, scale, color }: { position: [number, number, number], scale: [number, number, number], color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    // Random vertical movement for "floating" effect
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.002;
        }
    });

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
            <meshBasicMaterial color={color} transparent opacity={0.1} />
        </mesh>
    );
}

function ScanningLaser() {
    const lineRef = useRef<THREE.Line>(null);
    const [points] = useState(() => [new THREE.Vector3(-550, 0, 0), new THREE.Vector3(50, 0, 0)]);

    useFrame((state) => {
        if (lineRef.current) {
            const z = Math.sin(state.clock.elapsedTime * 0.5) * 20;
            lineRef.current.position.z = z;
            lineRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.5) * 5;
        }
    });

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        return geo;
    }, [points]);

    return (
        <line ref={lineRef as any}>
            <bufferGeometry attach="geometry" {...geometry} />
            <lineBasicMaterial color="#00ffff" linewidth={2} opacity={0.8} transparent />
        </line>
    );
}

function FloatingCity() {
    const count = 40; // Increased count for better background coverage
    // Generate random blocks
    const blocks = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 30 - 5,
                (Math.random() - 0.5) * 50 - 10
            ] as [number, number, number],
            scale: [
                1 + Math.random() * 3,
                1 + Math.random() * 10,
                1 + Math.random() * 3
            ] as [number, number, number],
            color: Math.random() > 0.5 ? '#2dd4bf' : '#8b5cf6' // Teal or Purple
        }));
    }, []);

    return (
        <group rotation={[0, -Math.PI / 4, 0]}>
            {blocks.map((block, i) => (
                <Float key={i} speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
                    <CityBlock {...block} />
                </Float>
            ))}
            <ScanningLaser />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
}

export default function GlobalBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={50} />
                <ambientLight intensity={0.5} />
                <FloatingCity />
                <Environment preset="city" />
            </Canvas>

            {/* Grid Overlay for "Tech" feel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)' }}></div>
        </div>
    );
}
