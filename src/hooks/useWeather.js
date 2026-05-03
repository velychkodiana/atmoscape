import { useState, useCallback } from 'react';
import axios from 'axios';

const API_KEY = '67566d6efcc2fbb713a253a7f791e97f';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

export function useWeather() {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [locationDetails, setLocationDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getCitySuggestions = async (query) => {
        if (!query || query.length < 2) return [];
        try {
            const res = await axios.get(GEO_URL, { params: { q: query, limit: 5, appid: API_KEY } });
            return res.data;
        } catch (err) { return []; }
    };

    const fetchWeather = useCallback(async (location, lang = 'ua') => {
        if (!location) return;
        setIsLoading(true);
        try {
            const apiLang = lang === 'ua' ? 'uk' : 'en';
            let targetLocation = location;

            // Якщо клікнули на нижню картку (передали текст),
            // ми спершу витягуємо повні дані з перекладом та областю!
            if (typeof location === 'string') {
                const geoRes = await axios.get(GEO_URL, { params: { q: location, limit: 1, appid: API_KEY } });
                if (geoRes.data && geoRes.data.length > 0) {
                    targetLocation = geoRes.data[0];
                }
            }

            let params = { appid: API_KEY, units: 'metric', lang: apiLang };

            if (typeof targetLocation === 'object' && targetLocation.lat) {
                params.lat = targetLocation.lat;
                params.lon = targetLocation.lon;
                setLocationDetails(targetLocation);
            } else {
                params.q = typeof location === 'string' ? location : location.name;
                setLocationDetails({ name: params.q });
            }

            const currentRes = await axios.get(`${BASE_URL}/weather`, { params });
            setWeatherData(currentRes.data);

            const forecastRes = await axios.get(`${BASE_URL}/forecast`, { params });
            const dailyForecast = forecastRes.data.list.filter(item => item.dt_txt.includes('12:00:00'));
            const formattedForecast = dailyForecast.map(item => {
                const date = new Date(item.dt_txt);
                const dayName = date.toLocaleDateString(lang === 'ua' ? 'uk-UA' : 'en-US', { weekday: 'short' });
                return {
                    id: item.dt, dayName: dayName.toUpperCase(), temp: Math.round(item.main.temp), icon: item.weather[0].icon, raw: item
                };
            });

            setForecastData(formattedForecast);
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    }, []);

    return { weatherData, forecastData, locationDetails, isLoading, fetchWeather, getCitySuggestions };
}