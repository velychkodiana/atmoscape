import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

// Компонент частинок (Дощ або Сніг)
function Particles({ type }) {
    const count = type === 'rain' ? 2000 : 1500;
    const meshRef = useRef();

    // Генеруємо початкові позиції крапель/сніжинок
    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
            temp[i] = (Math.random() - 0.5) * 40;     // X
            temp[i + 1] = Math.random() * 20;         // Y (Висота)
            temp[i + 2] = (Math.random() - 0.5) * 40; // Z
        }
        return temp;
    }, [count]);

    // Анімація падіння (оновлюється кожен кадр — 60 FPS)
    useFrame(() => {
        if (!meshRef.current) return;
        const positions = meshRef.current.geometry.attributes.position.array;
        const speed = type === 'rain' ? 0.3 : 0.05;

        for (let i = 1; i < count * 3; i += 3) {
            positions[i] -= speed; // Падаємо вниз
            if (positions[i] < -5) {
                positions[i] = 15; // Повертаємо нагору
            }
        }
        meshRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                // 🔥 Зменшуємо сніг з 0.1 до 0.035
                size={type === 'rain' ? 0.05 : 0.035}
                color={type === 'rain' ? '#aaaaaa' : '#ffffff'}
                transparent
                // Робимо сніг трохи яскравішим (0.8), щоб ці дрібні частинки було добре видно
                opacity={type === 'rain' ? 0.6 : 0.8}
                sizeAttenuation
            />
        </points>
    );
}

// Головний компонент ефектів
export default function WeatherEffects({ iconCode }) {
    if (!iconCode) return <ambientLight intensity={0.8} />;

    const isRain = iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11');
    const isSnow = iconCode.includes('13');
    const isFog  = iconCode.includes('50');
    const isNight = iconCode.includes('n');

    // Визначаємо кольори освітлення
    const ambientColor = isNight ? '#334455' : (isRain || isFog || isSnow ? '#aaaaaa' : '#ffffff');
    const dirColor = isNight ? '#ccccff' : (isRain || isFog || isSnow ? '#ffffff' : '#ffddaa');
    const dirIntensity = isNight ? 0.5 : (isRain || isFog || isSnow ? 0.8 : 1.5);
    const fogColor = isNight ? '#1e293b' : (isFog ? '#cccccc' : '#aaaaaa');
    const fogDensity = isFog ? 0.08 : (isRain || isSnow ? 0.02 : 0);

    return (
        <>
            {/* Світло */}
            <ambientLight intensity={isNight ? 0.3 : 0.6} color={ambientColor} />
            <directionalLight position={isNight ? [-5, 10, -5] : [10, 10, 5]} intensity={dirIntensity} color={dirColor} />

            {/* Туман */}
            {fogDensity > 0 && <fogExp2 attach="fog" color={fogColor} density={fogDensity} />}

            {/* Опади */}
            {isRain && <Particles type="rain" />}
            {isSnow && <Particles type="snow" />}
        </>
    );
}