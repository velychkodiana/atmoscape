// src/components/weather/WeatherDetails.jsx
import React from 'react';
import { Wind, Droplets, Gauge } from 'lucide-react';

export default function WeatherDetails({ displayData, isLoading, t, isMobile }) {
    return (
        <div className={isMobile ? "mobile-details-grid" : "details-grid"}>
            {/* ВІТЕР */}
            <div className="detail-item">
                <span className="detail-icon"><Wind size={18} /></span>
                {!isMobile && <div><div className="detail-label">{t('wind')}</div></div>}
                {isMobile ? (
                    <>
                        <div className="detail-label">{t('wind')}</div>
                        <div className="detail-value">{displayData?.wind || '--'}</div>
                    </>
                ) : (
                    <div className="detail-value">{displayData?.wind || '--'} m/s</div>
                )}
            </div>

            {/* ВОЛОГІСТЬ */}
            <div className="detail-item">
                <span className="detail-icon"><Droplets size={18} /></span>
                {!isMobile && <div><div className="detail-label">{t('humidity')}</div></div>}
                {isMobile ? (
                    <>
                        <div className="detail-label">{t('humidity')}</div>
                        <div className="detail-value">{displayData?.humidity || '--'}%</div>
                    </>
                ) : (
                    <div className="detail-value">{displayData?.humidity || '--'}%</div>
                )}
            </div>

            {/* ТИСК */}
            <div className="detail-item">
                <span className="detail-icon"><Gauge size={18} /></span>
                {!isMobile && <div><div className="detail-label">{t('pressure')}</div></div>}
                {isMobile ? (
                    <>
                        <div className="detail-label">{t('pressure')}</div>
                        <div className="detail-value">{displayData?.pressure || '--'}</div>
                    </>
                ) : (
                    <div className="detail-value">{displayData?.pressure || '--'} hPa</div>
                )}
            </div>
        </div>
    );
}