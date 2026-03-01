import React, { useMemo } from 'react';
import { useGLTF, Float, PresentationControls } from '@react-three/drei';

export default function CityModel({ modelUrl }) {
    const { scene } = useGLTF(modelUrl);

    // 🔥 ФІКС: Клонуємо модель. Тепер React StrictMode її не знищить!
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    return (
        <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
            <Float speed={2} rotationIntensity={0.5} floatIntensity={2} floatingRange={[-0.2, 0.2]}>
                {/* Використовуємо клоновану сцену */}
                <primitive object={clonedScene} scale={2.5} position={[0, -1, 0]} />
            </Float>
        </PresentationControls>
    );
}