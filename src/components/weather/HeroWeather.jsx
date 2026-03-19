// src/components/weather/HeroWeather.jsx
import React from 'react';
import { formatState } from '../../utils/helpers';
import WeatherDetails from './WeatherDetails';

export default function HeroWeather({
                                        displayData, isLoading, cityNameDisplay, locationDetails, weatherData, t, lang, isMobile
                                    }) {
    return (
        <>
            <div className="editorial-date">
                {displayData?.dateLabel || <div className="skeleton skeleton-desc" style={{width: '100px', margin: isMobile ? '0 auto' : '0'}}></div>}
            </div>

            {isLoading ? (
                <div style={isMobile ? { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' } : {}}>
                    <div className="skeleton skeleton-title" style={isMobile ? { height: '40px', width: '60%' } : {}}></div>
                    <div className="skeleton skeleton-temp" style={isMobile ? { height: '60px', width: '40%' } : {}}></div>
                    <div className="skeleton skeleton-desc" style={isMobile ? { height: '20px', width: '80%' } : {}}></div>
                </div>
            ) : (
                <>
                    <h1 className="editorial-title">{cityNameDisplay}</h1>
                    <div className="location-sub">
                        {formatState(locationDetails?.state, lang)}{locationDetails?.state ? ', ' : ''}{locationDetails?.country || weatherData?.sys?.country || ''}
                    </div>
                    <div className="editorial-temp">{displayData ? Math.round(displayData.temp) : '--'}°</div>
                    <p className="editorial-desc" style={{ textTransform: 'capitalize' }}>
                        {displayData?.description || '...'} • {t('feels')} {displayData ? Math.round(displayData.feels_like) : '--'}°
                    </p>
                </>
            )}

            {/* Підключаємо блок з деталями */}
            <WeatherDetails displayData={displayData} isLoading={isLoading} t={t} isMobile={isMobile} />
        </>
    );
}