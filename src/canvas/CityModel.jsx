import React from 'react';
import { useGLTF, Float, Clone } from '@react-three/drei';

export default function CityModel({ modelUrl }) {
    const { scene } = useGLTF(modelUrl);

    return (
        /* Залишаємо тільки плавне літання (Float).
           Додаємо rotation сюди, щоб модель стояла під правильним кутом */
        <Float speed={2} rotationIntensity={0.5} floatIntensity={2} floatingRange={[-0.2, 0.2]}>
            <Clone object={scene} scale={2.5} position={[0, -1, 0]} rotation={[0, 0.3, 0]} />
        </Float>
    );
}