import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            wind: 'Wind', humidity: 'Humidity', pressure: 'Pressure',
            feels: 'Feels like', search: 'Search city...', today: 'TODAY',
            notFound: 'City not found!', recent: 'Recent Searches',
            suggestions: 'Suggestions', searching: 'Searching...',
            // Ключі для помилок
            errorTitle: 'Oops, storm warning!',
            errorDesc: 'Something went wrong displaying this dimension. But don\'t worry, we are already clearing the clouds.',
            errorBtn: 'Reload sky',
            modelMissing: 'Model missing',
            loadingMain: "Loading 3D model...",
            loadingMini: "Loading 3D..."
        }
    },
    ua: {
        translation: {
            wind: 'Вітер', humidity: 'Вологість', pressure: 'Тиск',
            feels: 'Відчувається', search: 'Пошук міста...', today: 'СЬОГОДНІ',
            notFound: 'Місто не знайдено!', recent: 'Останні пошуки',
            suggestions: 'Знайдено міст', searching: 'Шукаю...',
            // Ключі для помилок
            errorTitle: 'Упс, штормове попередження!',
            errorDesc: 'Щось пішло не так із відображенням цього виміру. Але не хвилюйся, ми вже розганяємо хмари.',
            errorBtn: 'Перезавантажити небо',
            modelMissing: 'Модель відсутня',
            loadingMain: "Завантаження 3D-моделі...",
            loadingMini: "Завантаження 3D..."
        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'ua',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
});

export default i18n;