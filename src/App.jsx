import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Sun, Moon, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog, Wind, Droplets, Gauge, Search, Clock, CloudOff } from 'lucide-react';

import './i18n';
import { useTranslation } from 'react-i18next';

import CityModel from './canvas/CityModel';
import WeatherEffects from './canvas/WeatherEffects';
import MiniCityCard from './components/MiniCityCard';
import Footer from './components/Footer';
import { useWeather } from './hooks/useWeather';

// 🔥 ІМПОРТУЄМО НАШУ НОВУ ХМАРНУ ЛОГІКУ З КОНФІГУ
import { getModelUrl } from './config/models';

import './index.css';

// Подушка безпеки з перекладом
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-page-wrapper">
                    <div className="glass-panel error-glass">
                        <div className="error-icon-wrapper">
                            <CloudOff size={64} strokeWidth={1.5} />
                        </div>
                        <h1 className="error-title">{this.props.errorTitle}</h1>
                        <p className="error-text">{this.props.errorDesc}</p>
                        <button className="error-btn" onClick={() => window.location.reload()}>
                            {this.props.errorBtn}
                        </button>
                    </div>
                </div>
            );
        }
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

function App() {
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState('ua');
    const [theme, setTheme] = useState('light');
    const [searchInput, setSearchInput] = useState('');
    const [currentCity, setCurrentCity] = useState('Kyiv');
    const [selectedForecast, setSelectedForecast] = useState(null);
    const [searchError, setSearchError] = useState(false);

    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem('atmoscape_recent');
        return saved ? JSON.parse(saved) : [{name: 'London', country: 'GB'}, {name: 'Kyiv', local_names: {uk: 'Київ'}, country: 'UA'}];
    });

    const [suggestions, setSuggestions] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const { weatherData, forecastData, locationDetails, isLoading, fetchWeather, getCitySuggestions } = useWeather();

    const handleLangChange = () => {
        const newLang = lang === 'ua' ? 'en' : 'ua';
        setLang(newLang);
        i18n.changeLanguage(newLang);
        setSelectedForecast(null);
    };

    const getLocalName = (cityObj) => {
        if (!cityObj) return '';
        if (typeof cityObj === 'string') return cityObj;
        const langKey = lang === 'ua' ? 'uk' : 'en';
        return cityObj.local_names?.[langKey] || cityObj.name;
    };

    const formatState = (stateStr) => {
        if (!stateStr) return '';
        if (lang === 'ua') {
            const stateMap = {
                'kharkiv oblast': 'Харківська область', 'odesa oblast': 'Одеська область', 'kyiv oblast': 'Київська область',
                'kyiv city': 'м. Київ', 'kyiv': 'м. Київ', 'lviv oblast': 'Львівська область', 'dnipropetrovsk oblast': 'Дніпропетровська область',
                'donetsk oblast': 'Донецька область', 'zaporizhia oblast': 'Запорізька область', 'zaporizhzhia oblast': 'Запорізька область',
                'mykolaiv oblast': 'Миколаївська область', 'kherson oblast': 'Херсонська область', 'poltava oblast': 'Полтавська область',
                'chernihiv oblast': 'Чернігівська область', 'cherkasy oblast': 'Черкаська область', 'zhytomyr oblast': 'Житомирська область',
                'sumy oblast': 'Сумська область', 'khmelnytskyi oblast': 'Хмельницька область', 'chernivtsi oblast': 'Чернівецька область',
                'rivne oblast': 'Рівненська область', 'ivano-frankivsk oblast': 'Івано-Франківська область', 'ternopil oblast': 'Тернопільська область',
                'volyn oblast': 'Волинська область', 'zakarpattia oblast': 'Закарпатська область', 'kirovohrad oblast': 'Кіровоградська область',
                'luhansk oblast': 'Луганська область', 'crimea': 'АР Крим', 'autonomous republic of crimea': 'АР Крим'
            };
            const normalized = stateStr.toLowerCase().trim();
            if (stateMap[normalized]) return stateMap[normalized];
            return stateStr.replace(/Oblast/ig, 'область');
        }
        return stateStr;
    };

    useEffect(() => { fetchWeather(currentCity, lang); }, [currentCity, lang, fetchWeather]);

    useEffect(() => {
        const fetchGeo = async () => {
            if (searchInput.length > 2) {
                setIsTyping(true);
                const results = await getCitySuggestions(searchInput);
                setSuggestions(results || []);
                setIsTyping(false);
            } else { setSuggestions([]); }
        };
        const timeoutId = setTimeout(fetchGeo, 400);
        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

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
            if (results && results.length > 0) handleCitySelect(results[0]);
            else {
                setSearchError(true);
                setTimeout(() => setSearchError(false), 2500);
            }
        }
    };

    const displayData = selectedForecast ? {
        temp: selectedForecast.temp, description: selectedForecast.raw.weather[0].description,
        feels_like: selectedForecast.raw.main.feels_like, wind: selectedForecast.raw.wind?.speed || selectedForecast.raw.wind_speed,
        humidity: selectedForecast.raw.main.humidity, pressure: selectedForecast.raw.main.pressure,
        icon: selectedForecast.icon, dateLabel: selectedForecast.dayName
    } : weatherData ? {
        temp: weatherData.main.temp, description: weatherData.weather[0].description,
        feels_like: weatherData.main.feels_like, wind: weatherData.wind?.speed,
        humidity: weatherData.main.humidity, pressure: weatherData.main.pressure,
        icon: weatherData.weather[0].icon, dateLabel: t('today')
    } : null;

    const cityNameDisplay = getLocalName(locationDetails || weatherData?.name || currentCity);

    return (
        <div className="app-layout">
            {/* HEADER */}
            <header className="glass-panel header-container">
                <h1 className="logo">AtmoScape</h1>
                <div className="search-container">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder={searchError ? t('notFound') : t('search')}
                        className={`search-input ${searchError ? 'search-error' : ''}`}
                        value={searchInput}
                        onChange={(e) => { setSearchInput(e.target.value); if(searchError) setSearchError(false); }}
                        onKeyDown={handleSearch}
                        onClick={() => setIsSearchFocused(true)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    />
                    {isSearchFocused && (suggestions.length > 0 || recentSearches.length > 0) && (
                        <div className="recent-dropdown glass-panel">
                            {searchInput.length > 2 ? (
                                <>
                                    <div className="recent-header">{isTyping ? t('searching') : t('suggestions')}</div>
                                    {suggestions.map((city, idx) => (
                                        <div key={idx} className="recent-item" onMouseDown={(e) => { e.preventDefault(); handleCitySelect(city); }}>
                                            <Search size={14} style={{ opacity: 0.5 }} />
                                            <div className="recent-item-text">
                                                <span>{getLocalName(city)}</span>
                                                <small>{formatState(city.state)}{city.state ? ', ' : ''}{city.country}</small>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <div className="recent-header">{t('recent')}</div>
                                    {recentSearches.map((city, idx) => (
                                        <div key={idx} className="recent-item" onMouseDown={(e) => { e.preventDefault(); handleCitySelect(city); }}>
                                            <Clock size={14} style={{ opacity: 0.5 }} />
                                            <div className="recent-item-text">
                                                <span>{getLocalName(city)}</span>
                                                <small>{formatState(city.state)}{city.state ? ', ' : ''}{city.country}</small>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="controls">
                    <button onClick={handleLangChange} className="control-btn">{lang.toUpperCase()}</button>
                    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="control-btn">
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                </div>
            </header>

            {/* HERO SECTION */}
            <main className="hero-section glass-panel">
                <div className="hero-text">
                    <div className="editorial-date">{displayData?.dateLabel || <div className="skeleton skeleton-desc" style={{width: '100px'}}></div>}</div>

                    {isLoading ? (
                        <>
                            <div className="skeleton skeleton-title"></div>
                            <div className="skeleton skeleton-sub"></div>
                            <div className="skeleton skeleton-temp"></div>
                            <div className="skeleton skeleton-desc"></div>
                        </>
                    ) : (
                        <>
                            <h1 className="editorial-title">{cityNameDisplay}</h1>
                            <div className="location-sub">
                                {formatState(locationDetails?.state)}{locationDetails?.state ? ', ' : ''}{locationDetails?.country || weatherData?.sys?.country || ''}
                            </div>
                            <div className="editorial-temp">{displayData ? Math.round(displayData.temp) : '--'}°</div>
                            <p className="editorial-desc" style={{ textTransform: 'capitalize' }}>
                                {displayData?.description || '...'} • {t('feels')} {displayData ? Math.round(displayData.feels_like) : '--'}°
                            </p>
                        </>
                    )}

                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-icon"><Wind size={22} /></span>
                            <div>
                                <div className="detail-label">{t('wind')}</div>
                                {isLoading ? <div className="skeleton skeleton-detail"></div> : <div className="detail-value">{displayData?.wind || '--'} m/s</div>}
                            </div>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon"><Droplets size={22} /></span>
                            <div>
                                <div className="detail-label">{t('humidity')}</div>
                                {isLoading ? <div className="skeleton skeleton-detail"></div> : <div className="detail-value">{displayData?.humidity || '--'}%</div>}
                            </div>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon"><Gauge size={22} /></span>
                            <div>
                                <div className="detail-label">{t('pressure')}</div>
                                {isLoading ? <div className="skeleton skeleton-detail"></div> : <div className="detail-value">{displayData?.pressure || '--'} hPa</div>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hero-3d">
                    <ErrorBoundary
                        key={cityNameDisplay}
                        errorTitle={t('errorTitle')}
                        errorDesc={t('errorDesc')}
                        errorBtn={t('errorBtn')}
                    >
                        <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
                            <WeatherEffects iconCode={displayData?.icon} />
                            <Suspense fallback={null}>
                                {/* 🔥 ВИКОРИСТОВУЄМО ІМПОРТОВАНУ ФУНКЦІЮ З CONFIG/MODELS.JS */}
                                <CityModel modelUrl={getModelUrl(cityNameDisplay, locationDetails?.state)} />
                                <Environment preset="city" />
                            </Suspense>
                        </Canvas>
                    </ErrorBoundary>
                </div>
            </main>

            {/* FORECAST */}
            <section className="forecast-wrapper">
                <div className={`forecast-card glass-panel ${!selectedForecast ? 'active' : ''}`} onClick={() => setSelectedForecast(null)}>
                    <span className="forecast-day" style={{fontSize:'0.75rem', marginBottom:'5px'}}>12:00</span>
                    <span className="forecast-day">{t('today')}</span>
                    <div className="forecast-icon" style={{margin:'10px 0'}}>{getWeatherIcon(weatherData?.weather[0].icon, 32)}</div>
                    <span className="forecast-temp">{weatherData ? Math.round(weatherData.main.temp) : '--'}°</span>
                </div>
                {forecastData.map((day) => (
                    <div key={day.id} className={`forecast-card glass-panel ${selectedForecast?.id === day.id ? 'active' : ''}`} onClick={() => setSelectedForecast(day)}>
                        <span className="forecast-day" style={{fontSize:'0.75rem', marginBottom:'5px'}}>12:00</span>
                        <span className="forecast-day">{day.dayName}</span>
                        <div className="forecast-icon" style={{margin:'10px 0'}}>{getWeatherIcon(day.icon, 32)}</div>
                        <span className="forecast-temp">{day.temp > 0 ? '+' : ''}{day.temp}°</span>
                    </div>
                ))}
            </section>

            {/* MINI CITIES */}
            <section className="bottom-grid">
                {['Kyiv', 'Lviv', 'Odesa', 'Kharkiv'].map((city) => (
                    <MiniCityCard
                        key={city}
                        city={city}
                        onClick={() => {
                            setCurrentCity(city);
                            setSelectedForecast(null);
                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                        }}
                    />
                ))}
            </section>

            <Footer />
        </div>
    );
}

export default App;