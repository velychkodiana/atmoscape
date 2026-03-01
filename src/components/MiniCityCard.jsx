import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MiniModel from '../canvas/MiniModel';

const API_KEY = '67566d6efcc2fbb713a253a7f791e97f'; // Твій ключ

export default function MiniCityCard({ city, onClick }) {
    const [temp, setTemp] = useState(null);

    useEffect(() => {
        // Швидкий запит тільки для поточної температури
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
            .then(res => setTemp(Math.round(res.data.main.temp)))
            .catch(() => setTemp('--'));
    }, [city]);

    return (
        <div className="mini-city-card glass-panel" onClick={onClick}>
            <div className="mini-city-info">
                <h3>{city}</h3>
                <div className="mini-city-temp">
                    {temp !== null ? `${temp > 0 ? '+' : ''}${temp}°` : '...'}
                </div>
            </div>
            <div className="mini-3d-placeholder">
                {/* Додали обгортку, щоб модель не перекривала клік */}
                <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <MiniModel city={city} />
                </div>
            </div>
        </div>
    );
}