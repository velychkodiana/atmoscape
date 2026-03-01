import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Sun, Moon, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog, Wind, Droplets, Gauge, Search, Clock } from 'lucide-react';

import CityModel from './canvas/CityModel';
import WeatherEffects from './canvas/WeatherEffects';
import MiniCityCard from './components/MiniCityCard';
import Footer from './components/Footer';
import { useWeather } from './hooks/useWeather';
import './index.css';

// Запобігає падінню всього додатка через помилки в 3D моделях
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) return <div className="error-placeholder"><h3>⚠️ 3D Error</h3></div>;
        return this.props.children;
    }
}

const getWeatherIcon = (iconCode, size = 48) => {
    if (!iconCode) return <Cloud size={size} strokeWidth={1.5} />;
    const code = iconCode.toLowerCase();
    if (code.includes('01')) return <Sun size={size} strokeWidth={1.5} />;
    if (code.includes('02') || code.includes('03') || code.includes('04')) return <Cloud size={size} strokeWidth={1.5} />;
    if (code.includes('09') || code.includes('10')) return <CloudRain size={size} strokeWidth={1.5} />;
    if (code.includes('11')) return <CloudLightning size={size} strokeWidth={1.5} />;
    if (code.includes('13')) return <Snowflake size={size} strokeWidth={1.5} />;
    if (code.includes('50')) return <CloudFog size={size} strokeWidth={1.5} />;
    return <Cloud size={size} strokeWidth={1.5} />;
};

const regionFallbackMap = {
    'біла церква': 'kyiv', 'bila tserkva': 'kyiv', 'brovary': 'kyiv',
    'kryvyi rih': 'dnipro', 'кривий ріг': 'dnipro',
    'uman': 'cherkasy', 'умань': 'cherkasy',
    'mukachevo': 'uzhhorod', 'мукачево': 'uzhhorod'
};

const getModelUrl = (cityName) => {
    const city = cityName?.toLowerCase().trim() || 'kyiv';
    const supported = ['kyiv', 'lviv', 'odesa', 'kharkiv', 'dnipro', 'donetsk', 'zaporizhzhia'];
    if (supported.includes(city)) return `/models/${city}.glb`;
    if (regionFallbackMap[city]) return `/models/${regionFallbackMap[city]}.glb`;
    return '/models/kyiv.glb';
};

function App() {
    const [lang, setLang] = useState('ua');
    const [theme, setTheme] = useState('light');
    const [searchInput, setSearchInput] = useState('');
    const [currentCity, setCurrentCity] = useState('Kyiv');
    const [selectedForecast, setSelectedForecast] = useState(null);
    const [searchError, setSearchError] = useState(false);

    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem('atmoscape_recent');
        return saved ? JSON.parse(saved) : [{name: 'London', country: 'GB'}, {name: 'Kyiv', country: 'UA'}];
    });

    const [suggestions, setSuggestions] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const { weatherData, forecastData, locationDetails, isLoading, fetchWeather, getCitySuggestions } = useWeather();

    // Допоміжна функція капіталізації
    const capitalize = (str) => {
        if (!str) return '';
        return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    };

    useEffect(() => {
        fetchWeather(currentCity, lang);
    }, [currentCity, lang, fetchWeather]);

    // Живий пошук підказок
    useEffect(() => {
        const fetchGeo = async () => {
            if (searchInput.length > 2) {
                setIsTyping(true);
                const results = await getCitySuggestions(searchInput);
                setSuggestions(results || []);
                setIsTyping(false);
            } else {
                setSuggestions([]);
            }
        };
        const timeoutId = setTimeout(fetchGeo, 400);
        return () => clearTimeout(timeoutId);
    }, [searchInput, getCitySuggestions]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const handleCitySelect = useCallback((cityObj) => {
        setCurrentCity(cityObj);
        setSearchInput('');
        setIsSearchFocused(false);
        setSelectedForecast(null);
        setSearchError(false);

        setRecentSearches(prev => {
            const updated = [cityObj, ...prev.filter(c => c.name !== cityObj.name)].slice(0, 5);
            localStorage.setItem('atmoscape_recent', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const handleSearch = async (e) => {
        if (e.key === 'Enter' && searchInput.trim() !== '') {
            const results = await getCitySuggestions(searchInput);
            if (results && results.length > 0) {
                handleCitySelect(results[0]);
            } else {
                setSearchError(true);
                setTimeout(() => setSearchError(false), 2500);
            }
        }
    };

    const t = {
        ua: { wind: 'Вітер', humidity: 'Вологість', pressure: 'Тиск', feels: 'Відчувається', search: 'Пошук міста...', today: 'СЬОГОДНІ', notFound: 'Місто не знайдено!' },
        en: { wind: 'Wind', humidity: 'Humidity', pressure: 'Pressure', feels: 'Feels like', search: 'Search city...', today: 'TODAY', notFound: 'City not found!' }
    };

    // 🔥 ВИПРАВЛЕНО: Правильне мапування даних для поточного дня та прогнозу
    const displayData = selectedForecast ? {
        temp: selectedForecast.temp,
        description: selectedForecast.raw.weather[0].description,
        feels_like: selectedForecast.raw.main.feels_like,
        wind: selectedForecast.raw.wind?.speed || selectedForecast.raw.wind_speed, // Додано перевірку
        humidity: selectedForecast.raw.main.humidity,
        pressure: selectedForecast.raw.main.pressure,
        icon: selectedForecast.icon,
        dateLabel: selectedForecast.dayName
    } : weatherData ? {
        temp: weatherData.main.temp,
        description: weatherData.weather[0].description,
        feels_like: weatherData.main.feels_like,
        wind: weatherData.wind?.speed,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        icon: weatherData.weather[0].icon,
        dateLabel: t[lang].today
    } : null;
    const cityNameDisplay = capitalize(locationDetails?.name || weatherData?.name || (typeof currentCity === 'string' ? currentCity : currentCity.name));

    return (
        <div className="app-layout">
            {/* HEADER */}
            <header className="glass-panel header-container">
                <h1 className="logo" style={{ fontFamily: 'var(--font-editorial)' }}>AtmoScape</h1>

                <div className="search-container">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder={searchError ? t[lang].notFound : t[lang].search}
                        className={`search-input ${searchError ? 'search-error' : ''}`}
                        value={searchInput}
                        onChange={(e) => { setSearchInput(e.target.value); if(searchError) setSearchError(false); }}
                        onKeyDown={handleSearch}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    />

                    {isSearchFocused && (suggestions.length > 0 || recentSearches.length > 0) && (
                        <div className="recent-dropdown glass-panel">
                            {searchInput.length > 2 ? (
                                <>
                                    <div className="recent-header">{isTyping ? '...' : 'Suggestions'}</div>
                                    {suggestions.map((city, idx) => (
                                        <div key={idx} className="recent-item" onMouseDown={(e) => { e.preventDefault(); handleCitySelect(city); }}>
                                            <Search size={14} style={{ opacity: 0.5 }} />
                                            <div className="recent-item-text">
                                                <span>{city.name}</span>
                                                <small>{city.state ? `${city.state}, ` : ''}{city.country}</small>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <div className="recent-header">{lang === 'ua' ? 'Останні' : 'Recent'}</div>
                                    {recentSearches.map((city, idx) => (
                                        <div key={idx} className="recent-item" onMouseDown={(e) => { e.preventDefault(); handleCitySelect(city); }}>
                                            <Clock size={14} style={{ opacity: 0.5 }} />
                                            <div className="recent-item-text">
                                                <span>{city.name}</span>
                                                <small>{city.state ? `${city.state}, ` : ''}{city.country}</small>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="controls">
                    <button onClick={() => { setLang(l => l === 'ua' ? 'en' : 'ua'); setSelectedForecast(null); }} className="control-btn">{lang.toUpperCase()}</button>
                    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="control-btn">
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                </div>
            </header>

            {/* HERO SECTION */}
            <main className="hero-section glass-panel">
                <div className="hero-text">
                    <div className="editorial-date">{displayData?.dateLabel || '...'}</div>
                    <h1 className="editorial-title" title={cityNameDisplay}>
                        {isLoading ? '...' : cityNameDisplay}
                    </h1>
                    <div className="location-sub">
                        {locationDetails?.state ? `${locationDetails.state}, ` : ''}{locationDetails?.country || weatherData?.sys?.country || ''}
                    </div>
                    <div className="editorial-temp">{displayData ? Math.round(displayData.temp) : '--'}°</div>
                    <p className="editorial-desc">
                        {displayData?.description || '...'} • {t[lang].feels} {displayData ? Math.round(displayData.feels_like) : '--'}°
                    </p>

                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-icon"><Wind size={22} /></span>
                            <div><div className="detail-label">{t[lang].wind}</div><div className="detail-value">{displayData?.wind || '--'} m/s</div></div>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon"><Droplets size={22} /></span>
                            <div><div className="detail-label">{t[lang].humidity}</div><div className="detail-value">{displayData?.humidity || '--'}%</div></div>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon"><Gauge size={22} /></span>
                            <div><div className="detail-label">{t[lang].pressure}</div><div className="detail-value">{displayData?.pressure || '--'} hPa</div></div>
                        </div>
                    </div>
                </div>

                <div className="hero-3d">
                    <ErrorBoundary>
                        <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
                            <WeatherEffects iconCode={displayData?.icon} />
                            <Suspense fallback={null}>
                                <CityModel key={cityNameDisplay} modelUrl={getModelUrl(cityNameDisplay)} />
                                <Environment preset="city" />
                                <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} far={4} />
                            </Suspense>
                        </Canvas>
                    </ErrorBoundary>
                </div>
            </main>

            {/* FORECAST */}
            <section className="forecast-wrapper">
                <div className={`forecast-card glass-panel ${!selectedForecast ? 'active' : ''}`} onClick={() => setSelectedForecast(null)}>
                    <span className="forecast-time">12:00</span>
                    <span className="forecast-day">{t[lang].today}</span>
                    <div className="forecast-icon">{getWeatherIcon(weatherData?.weather[0].icon, 32)}</div>
                    <span className="forecast-temp">{weatherData ? Math.round(weatherData.main.temp) : '--'}°</span>
                </div>
                {forecastData.map((day) => (
                    <div key={day.id} className={`forecast-card glass-panel ${selectedForecast?.id === day.id ? 'active' : ''}`} onClick={() => setSelectedForecast(day)}>
                        <span className="forecast-time">12:00</span>
                        <span className="forecast-day">{day.dayName}</span>
                        <div className="forecast-icon">{getWeatherIcon(day.icon, 32)}</div>
                        <span className="forecast-temp">{day.temp > 0 ? '+' : ''}{day.temp}°</span>
                    </div>
                ))}
            </section>

            {/* MINI CITIES */}
            <section className="bottom-grid">
                {['Kyiv', 'Lviv', 'Odesa', 'Kharkiv'].map((city) => (
                    <MiniCityCard key={city} city={city} onClick={() => { setCurrentCity(city); setSelectedForecast(null); }} />
                ))}
            </section>

            <Footer />
        </div>
    );
}

export default App;