// src/components/weather/ForecastList.jsx
import React from 'react';
import { getWeatherIcon } from '../../utils/helpers';

export default function ForecastList({ isMobile, t, weatherData, forecastData, selectedForecast, setSelectedForecast }) {
    return (
        <section className={`forecast-wrapper ${isMobile ? 'mobile-forecast' : ''}`}>
            <div className={`forecast-card glass-panel ${!selectedForecast ? 'active' : ''}`} onClick={() => setSelectedForecast(null)}>
                <span className="forecast-day" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>12:00</span>
                <span className="forecast-day">{t('today')}</span>
                <div className="forecast-icon" style={{ margin: '10px 0' }}>{getWeatherIcon(weatherData?.weather[0].icon, 32)}</div>
                <span className="forecast-temp">{weatherData ? Math.round(weatherData.main.temp) : '--'}°</span>
            </div>
            {forecastData.map((day) => (
                <div key={day.id} className={`forecast-card glass-panel ${selectedForecast?.id === day.id ? 'active' : ''}`} onClick={() => setSelectedForecast(day)}>
                    <span className="forecast-day" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>12:00</span>
                    <span className="forecast-day">{day.dayName}</span>
                    <div className="forecast-icon" style={{ margin: '10px 0' }}>{getWeatherIcon(day.icon, 32)}</div>
                    <span className="forecast-temp">{day.temp > 0 ? '+' : ''}{day.temp}°</span>
                </div>
            ))}
        </section>
    );
}