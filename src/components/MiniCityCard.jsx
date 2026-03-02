import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import CityModel from '../canvas/CityModel';
import { cloudModels } from '../config/models'; // 🔥 Імпортуємо словник

class CardErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3, fontSize: '0.8rem', textAlign: 'center' }}>
                    {this.props.fallbackText}
                </div>
            );
        }
        return this.props.children;
    }
}

export default function MiniCityCard({ city, onClick }) {
    const { t, i18n } = useTranslation();
    const [temp, setTemp] = useState(null);
    const [localName, setLocalName] = useState(city);

    // 🔥 Беремо хмарне посилання. Якщо міста немає в словнику — беремо Київ
    const cityKey = city.toLowerCase();
    const dynamicModelUrl = cloudModels[cityKey] || cloudModels['kyiv'];

    useEffect(() => {
        const fetchMiniWeather = async () => {
            try {
                const API_KEY = '67566d6efcc2fbb713a253a7f791e97f';
                const lang = i18n.language === 'ua' ? 'uk' : 'en';

                const geoRes = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
                if (geoRes.data && geoRes.data.length > 0) {
                    const name = geoRes.data[0].local_names?.[lang] || geoRes.data[0].name;
                    setLocalName(name);
                }

                const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
                setTemp(Math.round(weatherRes.data.main.temp));
            } catch (err) {
                console.error("Помилка завантаження міні-картки", err);
            }
        };

        fetchMiniWeather();
    }, [city, i18n.language]);

    return (
        <div className="mini-city-card glass-panel" onClick={onClick}>
            <div className="mini-3d-placeholder">
                <CardErrorBoundary fallbackText={t('modelMissing')}>
                    <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
                        <ambientLight intensity={1.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />
                        <Suspense fallback={null}>
                            <CityModel modelUrl={dynamicModelUrl} />
                        </Suspense>
                    </Canvas>
                </CardErrorBoundary>
            </div>

            <div className="mini-city-info">
                <span className="mini-city-name">{localName}</span>
                <span className="mini-city-temp">{temp !== null ? `${temp > 0 ? '+' : ''}${temp}°` : '...'}</span>
            </div>
        </div>
    );
}