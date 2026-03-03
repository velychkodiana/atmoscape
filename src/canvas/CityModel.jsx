import React, { useEffect, useRef } from 'react';
import { useGLTF, Float, Clone } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function CityModel({ modelUrl, isMini = false }) {
    const { scene } = useGLTF(modelUrl);
    const miniRef = useRef();

    useEffect(() => {
        return () => { useGLTF.clear(modelUrl); };
    }, [modelUrl]);

    // 🔥 БРОНЯ ДЛЯ МІНІ-КАРТОК: Плавне крутіння, яке ніколи не стрибає від скролу
    useFrame(() => {
        if (isMini && miniRef.current) {
            miniRef.current.rotation.y += 0.003; // Дуже повільне обертання
        }
    });


    // Якщо це міні-картка — віддаємо стабільну версію
    if (isMini) {
        return (
            <group raycast={() => null}>
                {/* 🔥 Змінили scale з 2.5 на 3.8 і опустили трохи нижче (position y: -1.5) */}
                <group ref={miniRef} position={[0, -1.5, 0]} rotation={[0, 0.3, 0]}>
                    <Clone object={scene} scale={3.8} />
                </group>
            </group>
        );
    }

    // Якщо це головний екран — віддаємо повноцінну літаючу версію
    return (
        <group raycast={() => null}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1} floatingRange={[-0.1, 0.1]}>
                <Clone object={scene} scale={2.5} position={[0, -1, 0]} rotation={[0, 0.3, 0]} />
            </Float>
        </group>
    );
}