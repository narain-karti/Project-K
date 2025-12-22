'use client';

import { useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { CameraMode, Vehicle } from '../types';
import * as THREE from 'three';

interface CameraControllerProps {
    mode: CameraMode;
    ambulance: Vehicle | null;
}

export default function CameraController({ mode, ambulance }: CameraControllerProps) {
    const { camera } = useThree();

    useEffect(() => {
        if (mode === 'top-down') {
            camera.position.set(0, 50, 0);
            camera.lookAt(0, 0, 0);
        } else if (mode === 'isometric') {
            camera.position.set(30, 30, 30);
            camera.lookAt(0, 0, 0);
        }
    }, [mode, camera]);

    useFrame(() => {
        if (mode === 'follow' && ambulance) {
            // Smooth follow camera
            const targetPos = new THREE.Vector3(
                ambulance.position[0] - 10,
                15,
                ambulance.position[2] - 10
            );
            camera.position.lerp(targetPos, 0.05);

            const lookAtPos = new THREE.Vector3(...ambulance.position);
            const currentLookAt = new THREE.Vector3();
            camera.getWorldDirection(currentLookAt);
            currentLookAt.multiplyScalar(10).add(camera.position);
            currentLookAt.lerp(lookAtPos, 0.05);
            camera.lookAt(currentLookAt);
        }
    });

    return null;
}
