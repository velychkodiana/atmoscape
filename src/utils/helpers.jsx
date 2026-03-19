// src/utils/helpers.jsx
import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog } from 'lucide-react';

export const getWeatherIcon = (iconCode, size = 48) => {
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

export const getLocalName = (cityObj, lang) => {
    if (!cityObj) return '';
    if (typeof cityObj === 'string') return cityObj;
    const langKey = lang === 'ua' ? 'uk' : 'en';
    return cityObj.local_names?.[langKey] || cityObj.name;
};

export const formatState = (stateStr, lang) => {
    if (!stateStr) return '';
    if (lang === 'ua') {
        const normalized = stateStr.toLowerCase().trim();
        const stateMap = {
            'kharkiv oblast': 'Харківська область', 'odesa oblast': 'Одеська область', 'kyiv oblast': 'Київська область',
            'kyiv city': 'м. Київ', 'kyiv': 'м. Київ', 'lviv oblast': 'Львівська область', 'dnipropetrovsk oblast': 'Дніпропетровська область',
            'donetsk oblast': 'Донецька область', 'zaporizhia oblast': 'Запорізька область', 'zaporizhzhia oblast': 'Запорізька область',
            'mykolaiv oblast': 'Миколаївська область', 'kherson oblast': 'Херсонська область', 'poltava oblast': 'Полтавська область',
            'chernihiv oblast': 'Чернігівська область', 'cherkasy oblast': 'Черкаська область', 'zhytomyr oblast': 'Житомирська область',
            'sumy oblast': 'Сумська область', 'khmelnytskyi oblast': 'Хмельницька область', 'chernivtsi oblast': 'Чернівецька область',
            'rivne oblast': 'Рівненська область', 'ivano-frankivsk oblast': 'Івано-Франківська область', 'ternopil oblast': 'Тернопільська область',
            'volyn oblast': 'Волинська область', 'zakarpattia oblast': 'Закарпатська область', 'kirovohrad oblast': 'Кіровоградська область',
            'luhansk oblast': 'Луганська область', 'crimea': 'АР Крим', 'autonomous republic of crimea': 'АР Крим',
            'sevastopol': 'м. Севастополь', 'sevastopol city': 'м. Севастополь'
        };

        if (stateMap[normalized]) return stateMap[normalized];
        if (normalized.includes('kyiv') || normalized.includes('kiev')) return 'Київська область';
        if (normalized.includes('kharkiv') || normalized.includes('kharkov')) return 'Харківська область';
        if (normalized.includes('odes')) return 'Одеська область';
        if (normalized.includes('lviv') || normalized.includes('lvov')) return 'Львівська область';
        if (normalized.includes('dnipro') || normalized.includes('dnep')) return 'Дніпропетровська область';
        if (normalized.includes('donetsk') || normalized.includes('donbas')) return 'Донецька область';
        if (normalized.includes('zaporizh')) return 'Запорізька область';
        if (normalized.includes('mykolaiv') || normalized.includes('nikolaev')) return 'Миколаївська область';
        if (normalized.includes('kherson')) return 'Херсонська область';
        if (normalized.includes('poltav')) return 'Полтавська область';
        if (normalized.includes('chernihiv') || normalized.includes('chernigov')) return 'Чернігівська область';
        if (normalized.includes('cherkas')) return 'Черкаська область';
        if (normalized.includes('zhytomyr') || normalized.includes('zhitomir')) return 'Житомирська область';
        if (normalized.includes('sumy') || normalized.includes('sumsk')) return 'Сумська область';
        if (normalized.includes('khmelnyt')) return 'Хмельницька область';
        if (normalized.includes('chernivts') || normalized.includes('chernovts')) return 'Чернівецька область';
        if (normalized.includes('rivn') || normalized.includes('rovn')) return 'Рівненська область';
        if (normalized.includes('frankivsk')) return 'Івано-Франківська область';
        if (normalized.includes('ternopil')) return 'Тернопільська область';
        if (normalized.includes('volyn') || normalized.includes('lutsk')) return 'Волинська область';
        if (normalized.includes('zakarpatt') || normalized.includes('transcarpathia')) return 'Закарпатська область';
        if (normalized.includes('kirovohrad') || normalized.includes('kropyvnyts')) return 'Кіровоградська область';
        if (normalized.includes('luhansk') || normalized.includes('lugansk')) return 'Луганська область';
        if (normalized.includes('vinnyts') || normalized.includes('vinnits')) return 'Вінницька область';
        if (normalized.includes('crimea') || normalized.includes('krymska')) return 'АР Крим';

        return stateStr.replace(/Oblast/ig, 'область').replace(/City/ig, 'місто').replace(/State/ig, 'штат').replace(/Province/ig, 'провінція');
    }
    return stateStr;
};