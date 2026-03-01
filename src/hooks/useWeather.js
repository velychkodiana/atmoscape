import { useState, useCallback } from 'react';
import axios from 'axios';

const API_KEY = '67566d6efcc2fbb713a253a7f791e97f'; // Твій ключ
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

export function useWeather() {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [locationDetails, setLocationDetails] = useState(null); // Зберігаємо область/країну
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. ЖИВИЙ ПОШУК МІСТ (АВТОКОМПЛІТ)
    const getCitySuggestions = async (query) => {
        if (!query || query.length < 2) return [];
        try {
            const res = await axios.get(GEO_URL, {
                params: { q: query, limit: 5, appid: API_KEY }
            });
            return res.data; // Повертає масив: [{name, lat, lon, state, country}, ...]
        } catch (err) {
            console.error("Помилка автокомпліту:", err);
            return [];
        }
    };

    // 2. ГОЛОВНИЙ ЗАПИТ ПОГОДИ
    // location параметром тепер може бути рядок ('Kyiv') АБО об'єкт з координатами ({lat, lon, name, state})
    const fetchWeather = useCallback(async (location, lang = 'ua') => {
        if (!location) return;
        setIsLoading(true);
        setError(null);

        try {
            let params = { appid: API_KEY, units: 'metric', lang };

            // Якщо нам передали об'єкт з координатами (ми вибрали місто зі списку)
            if (typeof location === 'object' && location.lat) {
                params.lat = location.lat;
                params.lon = location.lon;
                setLocationDetails(location); // Зберігаємо інфо про область
            } else {
                // Якщо це просто рядок (наприклад, дефолтне місто при старті)
                params.q = location;
                setLocationDetails({ name: location }); // Немає області, тільки ім'я
            }

            const currentRes = await axios.get(`${BASE_URL}/weather`, { params });
            setWeatherData(currentRes.data);

            const forecastRes = await axios.get(`${BASE_URL}/forecast`, { params });
            const dailyForecast = forecastRes.data.list.filter(item => item.dt_txt.includes('12:00:00'));
            const formattedForecast = dailyForecast.map(item => {
                const date = new Date(item.dt_txt);
                const dayName = date.toLocaleDateString(lang === 'ua' ? 'uk-UA' : 'en-US', { weekday: 'short' });
                return {
                    id: item.dt,
                    dayName: dayName.toUpperCase(),
                    temp: Math.round(item.main.temp),
                    icon: item.weather[0].icon,
                    raw: item
                };
            });

            setForecastData(formattedForecast);
        } catch (err) {
            console.error('API Error:', err);
            setError('Помилка завантаження даних');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { weatherData, forecastData, locationDetails, isLoading, error, fetchWeather, getCitySuggestions };
}