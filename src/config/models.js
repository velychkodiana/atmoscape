// 🔥 Твій єдиний центр керування 3D-моделями
export const cloudModels = {
    // === ГОТОВІ МОДЕЛІ ===
    mriya: 'https://firebasestorage.googleapis.com/v0/b/atmoscape-storage.firebasestorage.app/o/mriya.glb?alt=media&token=40ded657-f015-428f-bf00-005afdc8dab2',
    kyiv: 'https://firebasestorage.googleapis.com/v0/b/atmoscape-storage.firebasestorage.app/o/kyiv.glb?alt=media&token=ebb32162-3d23-4a26-956f-a7c179076cde',
    odesa: 'https://firebasestorage.googleapis.com/v0/b/atmoscape-storage.firebasestorage.app/o/odesa.glb?alt=media&token=f84e6102-c685-4c7a-91c7-b71673c3d925',
    kharkiv: 'https://firebasestorage.googleapis.com/v0/b/atmoscape-storage.firebasestorage.app/o/kharkiv.glb?alt=media&token=0d6e780d-61a8-491c-9f32-27300b60c31b',

    // === В ПРОЦЕСІ РОЗРОБКИ ===
    lviv: 'ТУТ_ПОСИЛАННЯ_НА_ЛЬВІВ_З_FIREBASE',

    // Додавай нові міста сюди (розкоментовуй, коли закинеш у Firebase):
    // dnipro: 'https://...',
    // donetsk: 'https://...',
    // zaporizhzhia: 'https://...',
    // poltava: 'https://...',
    // vinnytsia: 'https://...',
    // lutsk: 'https://...',
    // zhytomyr: 'https://...',
    // uzhhorod: 'https://...',
    // ivano_frankivsk: 'https://...',
    // kropyvnytskyi: 'https://...',
    // luhansk: 'https://...',
    // mykolaiv: 'https://...',
    // rivne: 'https://...',
    // sumy: 'https://...',
    // ternopil: 'https://...',
    // kherson: 'https://...',
    // khmelnytskyi: 'https://...',
    // cherkasy: 'https://...',
    // chernivtsi: 'https://...',
    // chernihiv: 'https://...',
    // simferopol: 'https://...'
};

// Словник коренів для розумного пошуку
const regionKeywords = {
    // Північ та Центр
    'kyiv': 'kyiv', 'kiev': 'kyiv', 'київ': 'kyiv', 'києв': 'kyiv',
    'poltav': 'poltava', 'полтав': 'poltava',
    'vinnyt': 'vinnytsia', 'вінниц': 'vinnytsia',
    'zhytom': 'zhytomyr', 'житомир': 'zhytomyr',
    'cherkas': 'cherkasy', 'черкас': 'cherkasy',
    'chernih': 'chernihiv', 'черніг': 'chernihiv',
    'kropyv': 'kropyvnytskyi', 'кропив': 'kropyvnytskyi', 'kirovoh': 'kropyvnytskyi', 'кіровог': 'kropyvnytskyi',
    'sum': 'sumy', 'сум': 'sumy',

    // Захід
    'lviv': 'lviv', 'lvov': 'lviv', 'львів': 'lviv', 'львов': 'lviv',
    'lutsk': 'lutsk', 'луцьк': 'lutsk', 'volyn': 'lutsk', 'волин': 'lutsk',
    'uzhhor': 'uzhhorod', 'ужгород': 'uzhhorod', 'zakarp': 'uzhhorod', 'закарп': 'uzhhorod',
    'ivano': 'ivano_frankivsk', 'івано': 'ivano_frankivsk', 'frankiv': 'ivano_frankivsk', 'франків': 'ivano_frankivsk',
    'rivn': 'rivne', 'rovn': 'rivne', 'рівн': 'rivne', 'ровн': 'rivne',
    'ternop': 'ternopil', 'терноп': 'ternopil',
    'khmeln': 'khmelnytskyi', 'хмельн': 'khmelnytskyi',
    'cherniv': 'chernivtsi', 'чернівц': 'chernivtsi',

    // Південь
    'odes': 'odesa', 'одес': 'odesa',
    'mykol': 'mykolaiv', 'микола': 'mykolaiv',
    'kherson': 'kherson', 'херсон': 'kherson',
    'zapor': 'zaporizhzhia', 'запорі': 'zaporizhzhia',
    'simferop': 'simferopol', 'сімфероп': 'simferopol', 'crimea': 'simferopol', 'крим': 'simferopol',

    // Схід
    'kharkiv': 'kharkiv', 'kharkov': 'kharkiv', 'харків': 'kharkiv', 'харков': 'kharkiv',
    'dnip': 'dnipro', 'дніпр': 'dnipro', 'dnep': 'dnipro',
    'donet': 'donetsk', 'donbas': 'donetsk', 'донец': 'donetsk', 'донбас': 'donetsk',
    'luhan': 'luhansk', 'луган': 'luhansk'
};

export const getModelUrl = (cityName, stateName) => {
    const city = cityName?.toLowerCase().trim() || 'kyiv';
    const state = stateName?.toLowerCase() || '';

    // 1. Точний збіг по місту (перевіряємо чи є ключ і чи це справжній лінк)
    if (cloudModels[city] && cloudModels[city].includes('http')) {
        return cloudModels[city];
    }

    // 2. Збіг по області або кореню міста (для містечок, сіл або інших відмінків)
    for (const [keyword, modelName] of Object.entries(regionKeywords)) {
        if ((state.includes(keyword) || city.includes(keyword)) &&
            cloudModels[modelName] &&
            cloudModels[modelName].includes('http')) {
            return cloudModels[modelName];
        }
    }

    // 3. Дефолт: показуємо Київ, якщо нічого не знайшли або модель ще не готова
    return cloudModels['kyiv']; //згодом поставлю мрію
};