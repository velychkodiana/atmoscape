import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';

function RotatingModel({ modelUrl }) {
    const { scene } = useGLTF(modelUrl);
    const meshRef = useRef();

    useFrame(() => {
        if (meshRef.current) meshRef.current.rotation.y += 0.005;
    });

    return <primitive ref={meshRef} object={scene.clone()} scale={0.4} position={[0, -0.5, 0]} />;
}

export default function MiniModel({ city }) {
    // ТИМЧАСОВИЙ ФІКС: поки у нас є тільки kyiv.glb, вантажимо його для всіх міні-карток,
    // щоб уникнути білого екрану через 404 помилку.
    // Коли додаси інші файли (lviv.glb), зміни цей рядок назад на логіку з масивом.
    const modelUrl = '/models/kyiv.glb';

    return (
        <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 5, 3]} intensity={1.5} />
            {/* Suspense обов'язковий для 3D, інакше React падає */}
            <Suspense fallback={null}>
                <Environment preset="city" />
                <RotatingModel modelUrl={modelUrl} />
            </Suspense>
        </Canvas>
    );
}