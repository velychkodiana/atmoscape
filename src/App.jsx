import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import './i18n';
import './index.css';

//  КОМПОНЕНТИ ТА УТИЛІТИ
import { getLocalName } from './utils/helpers';
import HeaderControls from './components/ui/HeaderControls';
import SearchBar from './components/ui/SearchBar';
import ErrorBoundary from './components/ui/ErrorBoundary';
import HeroWeather from './components/weather/HeroWeather';
import ForecastList from './components/weather/ForecastList';
import MobileLayout from './layouts/MobileLayout';
import DesktopLayout from './layouts/DesktopLayout';

// ІНШІ БЛОКИ ТА 3D
import CityModel from './canvas/CityModel';
import WeatherEffects from './canvas/WeatherEffects';
import MiniCityCard from './components/MiniCityCard';
import Footer from './components/Footer';
import ModelLoader from './components/ModelLoader';
import NotFound from './components/NotFound'; // або './pages/NotFound'

// ЛОГІКА ТА КОНФІГИ
import { useWeather } from './hooks/useWeather';
import { getModelUrl } from './config/models';

function App() {
    // 1. STATE ДОДАТКУ
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState('ua');
    const [theme, setTheme] = useState('light');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const [currentCity, setCurrentCity] = useState(() => localStorage.getItem('atmoscape_last_city') || 'Kyiv');
    const [selectedForecast, setSelectedForecast] = useState(null);
    const [hasError, setHasError] = useState(false);

    // Стан пошуку
    const [searchInput, setSearchInput] = useState('');
    const [searchError, setSearchError] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem('atmoscape_recent');
        return saved ? JSON.parse(saved) : [{name: 'London', country: 'GB'}, {name: 'Kyiv', local_names: {uk: 'Київ'}, country: 'UA'}];
    });

    // 2. ХУК ПОГОДИ
    const { weatherData, forecastData, locationDetails, isLoading, fetchWeather, getCitySuggestions } = useWeather();

    // 3. ЕФЕКТИ (ЖИТТЄВИЙ ЦИКЛ)
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

    useEffect(() => { fetchWeather(currentCity, lang); }, [currentCity, lang]);

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
    }, [searchInput]); // ПРИБРАЛИ звідси getCitySuggestions

    // 4. ОБРОБНИКИ ПОДІЙ
    const handleLangChange = () => {
        const newLang = lang === 'ua' ? 'en' : 'ua';
        setLang(newLang);
        i18n.changeLanguage(newLang);
        setSelectedForecast(null);
    };

    const handleCitySelect = useCallback((cityObj) => {
        setHasError(false);
        setCurrentCity(cityObj);
        const cityName = typeof cityObj === 'string' ? cityObj : cityObj.name;
        localStorage.setItem('atmoscape_last_city', cityName);
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
            setHasError(false);
            try {
                const results = await getCitySuggestions(searchInput);
                if (results && results.length > 0) {
                    handleCitySelect(results[0]);
                } else {
                    setSearchError(true);
                    setHasError(true);
                    setTimeout(() => setSearchError(false), 2500);
                }
            } catch (error) {
                setHasError(true);
            }
        }
    };

    // 5. ПІДГОТОВКА ДАНИХ ДЛЯ ВІДОБРАЖЕННЯ
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

    const cityNameDisplay = getLocalName(locationDetails || weatherData?.name || currentCity, lang);

    // 6. ПЕРЕВІРКА НА КРИТИЧНУ ПОМИЛКУ
    if (hasError) return <NotFound />;


    // 7. КОМПОЗИЦІЯ (UI)
    const headerControlsSlot = <HeaderControls lang={lang} handleLangChange={handleLangChange} theme={theme} setTheme={setTheme} />;

    const searchBarSlot = <SearchBar isMobile={isMobile} t={t} lang={lang} searchError={searchError} setSearchError={setSearchError} searchInput={searchInput} setSearchInput={setSearchInput} handleSearch={handleSearch} isSearchFocused={isSearchFocused} setIsSearchFocused={setIsSearchFocused} suggestions={suggestions} recentSearches={recentSearches} isTyping={isTyping} handleCitySelect={handleCitySelect} />;

    const heroTextSlot = <HeroWeather displayData={displayData} isLoading={isLoading} cityNameDisplay={cityNameDisplay} locationDetails={locationDetails} weatherData={weatherData} t={t} lang={lang} isMobile={isMobile} />;

    // Створюємо стабільний ключ, який не блимає при завантаженні API
    const safeKey = typeof currentCity === 'string' ? currentCity : currentCity?.name || 'default';

    const hero3DSlot = (
        <ErrorBoundary key={safeKey} errorTitle={t('errorTitle')} errorDesc={t('errorDesc')} errorBtn={t('errorBtn')}>
            <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
                <WeatherEffects iconCode={displayData?.icon} />
                <Suspense fallback={<ModelLoader isMain />}>
                    <CityModel modelUrl={getModelUrl(cityNameDisplay, locationDetails?.state)} />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </ErrorBoundary>
    );

    const forecastSlot = <ForecastList isMobile={isMobile} t={t} weatherData={weatherData} forecastData={forecastData} selectedForecast={selectedForecast} setSelectedForecast={setSelectedForecast} />;

    const miniCitiesSlot = (
        <>
            {['Kyiv', 'Lviv', 'Odesa', 'Kharkiv'].map((city) => (
                <MiniCityCard key={city} city={city} onClick={() => { setCurrentCity(city); setSelectedForecast(null); window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });}} />
            ))}
        </>
    );


    // 8. ФІНАЛЬНИЙ РЕНДЕР (Диспетчер Лейаутів)
    if (isMobile) {
        return <MobileLayout
            header={headerControlsSlot}
            searchBar={searchBarSlot}
            heroText={heroTextSlot}
            hero3D={hero3DSlot}
            forecast={forecastSlot}
            miniCities={miniCitiesSlot}
            footer={<Footer />}
        />;
    }

    return <DesktopLayout
        header={headerControlsSlot}
        searchBar={searchBarSlot}
        heroText={heroTextSlot}
        hero3D={hero3DSlot}
        forecast={forecastSlot}
        miniCities={miniCitiesSlot}
        footer={<Footer />}
    />;
}

export default App;