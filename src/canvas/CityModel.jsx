import React from 'react';
import { useGLTF, Float, PresentationControls, Clone } from '@react-three/drei';

export default function CityModel({ modelUrl }) {
    // Просто завантажуємо оригінал
    const { scene } = useGLTF(modelUrl);

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

                {/* 🔥 ФІКС: Використовуємо спеціальний компонент Clone.
                    Він гарантує, що модель ніколи не "зламається" при зміні міст */}
                <Clone object={scene} scale={2.5} position={[0, -1, 0]} />

            </Float>
        </PresentationControls>
    );
}