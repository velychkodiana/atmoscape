// 🔥 Твій єдиний центр керування 3D-моделями
export const cloudModels = {
    kyiv: 'https://firebasestorage.googleapis.com/v0/b/atmoscape-storage.firebasestorage.app/o/kyiv.glb?alt=media&token=ebb32162-3d23-4a26-956f-a7c179076cde',
    lviv: 'ТУТ_ПОСИЛАННЯ_НА_ЛЬВІВ_З_FIREBASE',
    odesa: 'ТУТ_ПОСИЛАННЯ_НА_ОДЕСУ_З_FIREBASE',
    kharkiv: 'https://firebasestorage.googleapis.com/v0/b/atmoscape-storage.firebasestorage.app/o/kharkiv.glb?alt=media&token=0d6e780d-61a8-491c-9f32-27300b60c31b',
    // Додавай нові міста сюди:
    // poltava: 'https://firebasestorage...',
};

const regionKeywords = {
    'kharkiv': 'kharkiv', 'харків': 'kharkiv',
    'odes': 'odesa',      'одес': 'odesa',
    'kyiv': 'kyiv',       'київ': 'kyiv',
    'lviv': 'lviv',       'львів': 'lviv',
    'dnip': 'dnipro',     'дніпр': 'dnipro',
    'donet': 'donetsk',   'донец': 'donetsk',
    'zapor': 'zaporizhzhia', 'запорі': 'zaporizhzhia'
};

export const getModelUrl = (cityName, stateName) => {
    const city = cityName?.toLowerCase().trim() || 'kyiv';
    const state = stateName?.toLowerCase() || '';

    // 1. Точний збіг (обласний центр)
    if (cloudModels[city]) return cloudModels[city];

    // 2. Збіг по області (для містечок і сіл)
    for (const [keyword, modelName] of Object.entries(regionKeywords)) {
        if (state.includes(keyword) && cloudModels[modelName]) {
            return cloudModels[modelName];
        }
    }

    // 3. Дефолт: показуємо Київ, якщо нічого не знайшли
    return cloudModels['kyiv'];
};