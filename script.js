// Open-Meteo API (무료, API 키 불필요)
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

const translations = {
    ko: {
        metaTitle: '지금날씨 - 실시간 날씨 정보',
        metaDescription: '지금날씨 - 실시간 날씨, 미세먼지, 초미세먼지, 체감온도, 자외선 정보를 한눈에 확인하세요',
        metaOgTitle: '지금날씨 - 실시간 날씨 정보',
        metaOgDescription: '실시간 날씨, 미세먼지, 초미세먼지, 체감온도, 자외선 정보를 한눈에 확인하세요',
        metaTwitterTitle: '지금날씨 - 실시간 날씨 정보',
        metaTwitterDescription: '실시간 날씨, 미세먼지, 초미세먼지, 체감온도, 자외선 정보를 한눈에 확인하세요',
        title: '지금날씨',
        refreshAria: '새로고침',
        labelFeelsLike: '체감온도',
        labelPm10: '미세먼지',
        labelPm25: '초미세먼지',
        labelUv: '자외선',
        compareTitle: '📍 주변 비교',
        btnShare: '공유하기 📤',
        btnShareImage: '이미지로 공유 🖼️',
        footerRights: '. All rights reserved.',
        loadingText: '날씨 정보를 불러오는 중...',
        locationLoading: '위치 확인 중...',
        noData: '데이터 없음',
        statusGood: '좋음',
        statusModerate: '보통',
        statusBad: '나쁨',
        statusVeryBad: '매우나쁨',
        uvLow: '낮음',
        uvModerate: '보통',
        uvHigh: '높음',
        uvVeryHigh: '매우높음',
        uvExtreme: '위험',
        tipMask: '😷 마스크 권장 (초미세먼지 높음)',
        tipCoat: '🧣 겉옷 필수!',
        tipScarf: '🌬️ 목도리 챙기면 좋아요',
        tipSunscreenHigh: '🧴 자외선 강함 – 선크림 필수',
        tipSunscreenLow: '🧴 자외선 낮음 – 편한 외출 가능',
        tipDrink: '🥤 시원한 음료 챙기세요',
        tipGood: '☀️ 좋은 날씨예요!',
        alertFetchFail: '날씨 정보를 불러올 수 없습니다. 위치 권한을 확인해주세요.',
        shareTitle: '지금날씨',
        shareText: '지금날씨 🌤️\n\n{location}\n온도: {temp}°C ({desc})\n미세먼지: {pm10}\n초미세먼지: {pm25}\n\n#지금날씨',
        shareCopied: '클립보드에 복사되었습니다!',
        sharePrompt: '아래 텍스트를 복사하세요:',
        shareNeedData: '날씨 데이터를 먼저 불러와주세요.',
        imageCreateFail: '이미지 생성에 실패했습니다.',
        imageDownloaded: '이미지가 다운로드되었습니다!',
        moreTests: '더 많은 테스트 해보기',
        feelsLikeShort: '체감',
        pm10Short: '미세',
        pm25Short: '초미세',
        uvShort: 'UV',
        shareImageTitle: '지금날씨',
        shareImageText: '{location} 날씨 정보',
        downloadFileName: '지금날씨.png'
    },
    en: {
        metaTitle: 'Live Weather Now',
        metaDescription: 'Check real-time weather, PM10/PM2.5, feels-like temperature, and UV index at a glance.',
        metaOgTitle: 'Live Weather Now',
        metaOgDescription: 'Check real-time weather, PM10/PM2.5, feels-like temperature, and UV index at a glance.',
        metaTwitterTitle: 'Live Weather Now',
        metaTwitterDescription: 'Check real-time weather, PM10/PM2.5, feels-like temperature, and UV index at a glance.',
        title: 'Live Weather Now',
        refreshAria: 'Refresh',
        labelFeelsLike: 'Feels like',
        labelPm10: 'PM10',
        labelPm25: 'PM2.5',
        labelUv: 'UV Index',
        compareTitle: '📍 Nearby comparison',
        btnShare: 'Share 📤',
        btnShareImage: 'Share image 🖼️',
        footerRights: '. All rights reserved.',
        loadingText: 'Loading weather information...',
        locationLoading: 'Detecting location...',
        noData: 'No data',
        statusGood: 'Good',
        statusModerate: 'Moderate',
        statusBad: 'Bad',
        statusVeryBad: 'Very bad',
        uvLow: 'Low',
        uvModerate: 'Moderate',
        uvHigh: 'High',
        uvVeryHigh: 'Very high',
        uvExtreme: 'Extreme',
        tipMask: '😷 Mask recommended (PM2.5 is high)',
        tipCoat: '🧣 Wear a coat!',
        tipScarf: '🌬️ A scarf is a good idea',
        tipSunscreenHigh: '🧴 Strong UV – sunscreen required',
        tipSunscreenLow: '🧴 Low UV – easy outing',
        tipDrink: '🥤 Bring a cool drink',
        tipGood: '☀️ Great weather!',
        alertFetchFail: 'Unable to load weather. Check location permissions.',
        shareTitle: 'Live Weather Now',
        shareText: 'Live Weather Now 🌤️\n\n{location}\nTemp: {temp}°C ({desc})\nPM10: {pm10}\nPM2.5: {pm25}\n\n#LiveWeather',
        shareCopied: 'Copied to clipboard!',
        sharePrompt: 'Copy the text below:',
        shareNeedData: 'Load weather data first.',
        imageCreateFail: 'Failed to generate image.',
        imageDownloaded: 'Image downloaded!',
        moreTests: 'See more tests',
        feelsLikeShort: 'Feels',
        pm10Short: 'PM10',
        pm25Short: 'PM2.5',
        uvShort: 'UV',
        shareImageTitle: 'Live Weather Now',
        shareImageText: '{location} weather info',
        downloadFileName: 'live-weather.png'
    }
};

const weatherDescriptions = {
    ko: {
        0: '맑음',
        1: '대체로 맑음',
        2: '부분적으로 흐림',
        3: '흐림',
        45: '안개',
        48: '서리 안개',
        51: '약한 이슬비',
        53: '적당한 이슬비',
        55: '강한 이슬비',
        56: '약한 진눈깨비',
        57: '강한 진눈깨비',
        61: '약한 비',
        63: '적당한 비',
        65: '강한 비',
        66: '약한 얼음비',
        67: '강한 얼음비',
        71: '약한 눈',
        73: '적당한 눈',
        75: '강한 눈',
        77: '눈송이',
        80: '약한 소나기',
        81: '적당한 소나기',
        82: '강한 소나기',
        85: '약한 눈 소나기',
        86: '강한 눈 소나기',
        95: '천둥번개',
        96: '우박과 천둥번개',
        99: '강한 우박과 천둥번개'
    },
    en: {
        0: 'Clear',
        1: 'Mostly clear',
        2: 'Partly cloudy',
        3: 'Cloudy',
        45: 'Fog',
        48: 'Rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Heavy drizzle',
        56: 'Light sleet',
        57: 'Heavy sleet',
        61: 'Light rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Light snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Light showers',
        81: 'Moderate showers',
        82: 'Heavy showers',
        85: 'Light snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Severe thunderstorm with hail'
    }
};

const defaultLang = 'en';
const supportedLangs = ['ko', 'en'];
let currentLang = defaultLang;

function t(key, vars = {}) {
    const table = translations[currentLang] || translations.ko;
    const template = table[key] ?? translations.ko[key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, token) =>
        vars[token] !== undefined ? vars[token] : `{${token}}`
    );
}

function applyTranslations() {
    document.title = t('metaTitle');
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('metaDescription'));
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', t('metaOgTitle'));
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', t('metaOgDescription'));
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', t('metaTwitterTitle'));
    const twitterDesc = document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', t('metaTwitterDescription'));

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
        el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });
}

function setLang(lang, options = {}) {
    const nextLang = translations[lang] ? lang : defaultLang;
    currentLang = nextLang;
    document.documentElement.lang = nextLang;
    localStorage.setItem('preferredLang', nextLang);
    document.querySelectorAll('.lang-switch button').forEach((button) => {
        button.classList.toggle('active', button.dataset.lang === nextLang);
    });
    applyTranslations();
    updateMoreTestsButton();
    if (!currentLocationName && elements.location) {
        elements.location.textContent = t('locationLoading');
    }
    if (currentWeatherData && currentLocation) {
        displayWeatherData(
            currentWeatherData,
            currentAirQualityData,
            currentLocationNameRaw,
            currentLocation.lat,
            currentLocation.lon
        );
    }

    if (options.updateUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', nextLang);
        window.history.replaceState({}, '', url);
    }
}

function getRegionPreferredLang(fallback = defaultLang) {
    const intlLocale =
        typeof Intl === 'object' && typeof Intl.DateTimeFormat === 'function'
            ? Intl.DateTimeFormat().resolvedOptions().locale
            : '';
    const sources = [
        ...(navigator.languages || []),
        navigator.language,
        navigator.userLanguage,
        intlLocale,
    ]
        .filter(Boolean)
        .map((locale) => locale.toLowerCase());
    const hasKorean = sources.some((locale) => locale.startsWith('ko'));
    return hasKorean ? 'ko' : fallback;
}

function detectLang() {
    const params = new URLSearchParams(window.location.search);
    const paramLang = params.get('lang');
    if (supportedLangs.includes(paramLang)) return paramLang;
    const stored = localStorage.getItem('preferredLang');
    if (supportedLangs.includes(stored)) return stored;
    const candidate = getRegionPreferredLang(defaultLang);
    return supportedLangs.includes(candidate) ? candidate : defaultLang;
}

function initLanguage() {
    document.querySelectorAll('.lang-switch button').forEach((button) => {
        button.addEventListener('click', () => {
            setLang(button.dataset.lang, { updateUrl: true });
        });
    });
    setLang(detectLang(), { updateUrl: false });
}

function updateMoreTestsButton() {
    const moreBtn = document.getElementById('more-tests-btn');
    if (moreBtn) {
        moreBtn.textContent = t('moreTests');
    }
}

window.weatherI18n = {
    t,
    setLang
};

// DOM 요소
const elements = {
    location: document.getElementById('location'),
    temperature: document.getElementById('temperature'),
    weatherIcon: document.getElementById('weather-icon'),
    weatherDesc: document.getElementById('weather-desc'),
    feelsLike: document.getElementById('feels-like'),
    pm10: document.getElementById('pm10'),
    pm10Status: document.getElementById('pm10-status'),
    pm25: document.getElementById('pm25'),
    pm25Status: document.getElementById('pm25-status'),
    uvIndex: document.getElementById('uv-index'),
    uvStatus: document.getElementById('uv-status'),
    refreshBtn: document.getElementById('refresh-btn'),
    shareBtn: document.getElementById('share-btn'),
    shareImageBtn: document.getElementById('share-image-btn'),
    tipCard: document.getElementById('tip-card'),
    tipContent: document.getElementById('tip-content'),
    compareSection: document.getElementById('compare-section'),
    compareList: document.getElementById('compare-list'),
    loading: document.getElementById('loading'),
    shareCanvas: document.getElementById('share-canvas')
};

// 위치 정보 저장
let currentLocation = null;
let currentWeatherData = null;
let currentAirQualityData = null;
let currentLocationName = null;
let currentLocationNameRaw = null;

// 주요 도시 좌표 (fallback 및 비교용)
const majorCities = {
    '서울': { lat: 37.5665, lon: 126.9780, name: '서울', nameEn: 'Seoul' },
    '강남': { lat: 37.4979, lon: 127.0276, name: '강남', nameEn: 'Gangnam' },
    '홍대': { lat: 37.5563, lon: 126.9233, name: '홍대', nameEn: 'Hongdae' },
    '잠실': { lat: 37.5133, lon: 127.1028, name: '잠실', nameEn: 'Jamsil' },
    '인천': { lat: 37.4563, lon: 126.7052, name: '인천', nameEn: 'Incheon' },
    '부산': { lat: 35.1796, lon: 129.0756, name: '부산', nameEn: 'Busan' },
    '대구': { lat: 35.8714, lon: 128.6014, name: '대구', nameEn: 'Daegu' }
};

function getLocalizedCityName(name) {
    if (!name) return name;
    const city = majorCities[name];
    if (city) {
        return currentLang === 'en' ? city.nameEn : city.name;
    }
    return name;
}

// WMO Weather Code를 날씨 설명과 아이콘으로 변환
function getWeatherFromCode(code) {
    const descMap = weatherDescriptions[currentLang] || weatherDescriptions.ko;
    const weatherMap = {
        0: { icon: '☀️' },
        1: { icon: '🌤️' },
        2: { icon: '⛅' },
        3: { icon: '☁️' },
        45: { icon: '🌫️' },
        48: { icon: '🌫️' },
        51: { icon: '🌦️' },
        53: { icon: '🌦️' },
        55: { icon: '🌦️' },
        56: { icon: '🌨️' },
        57: { icon: '🌨️' },
        61: { icon: '🌧️' },
        63: { icon: '🌧️' },
        65: { icon: '🌧️' },
        66: { icon: '🌨️' },
        67: { icon: '🌨️' },
        71: { icon: '❄️' },
        73: { icon: '❄️' },
        75: { icon: '❄️' },
        77: { icon: '❄️' },
        80: { icon: '🌦️' },
        81: { icon: '🌦️' },
        82: { icon: '🌦️' },
        85: { icon: '🌨️' },
        86: { icon: '🌨️' },
        95: { icon: '⛈️' },
        96: { icon: '⛈️' },
        99: { icon: '⛈️' }
    };
    
    return weatherMap[code]
        ? { icon: weatherMap[code].icon, desc: descMap[code] || '—' }
        : { icon: '☀️', desc: descMap[0] || '—' };
}

// 구름량과 강수량으로 날씨 코드 유추
function inferWeatherCode(cloudCover, precipitation, isDay) {
    if (precipitation > 0.5) {
        if (precipitation > 5) return 65; // 강한 비
        if (precipitation > 2.5) return 63; // 적당한 비
        return 61; // 약한 비
    }
    
    if (cloudCover >= 75) return 3; // 흐림
    if (cloudCover >= 50) return 2; // 부분적으로 흐림
    if (cloudCover >= 25) return 1; // 대체로 맑음
    
    return isDay ? 0 : 1; // 맑음 또는 대체로 맑음
}

// 위치 정보 가져오기 (fallback 포함)
async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            // GPS 미지원 시 서울 기본값
            console.log('GPS 미지원, 서울 기본값 사용');
            const defaultLoc = majorCities['서울'];
            currentLocation = { lat: defaultLoc.lat, lon: defaultLoc.lon };
            resolve(currentLocation);
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const loc = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                currentLocation = loc;
                resolve(loc);
            },
            (error) => {
                // 위치 권한 거부 시 서울 기본값 사용
                console.log('위치 권한 거부, 서울 기본값 사용');
                const defaultLoc = majorCities['서울'];
                currentLocation = { lat: defaultLoc.lat, lon: defaultLoc.lon };
                resolve(currentLocation);
            },
            { timeout: 5000, enableHighAccuracy: false } // 빠른 응답을 위해 timeout 단축
        );
    });
}

// 위치명 가져오기 (역지오코딩)
async function getLocationName(lat, lon) {
    try {
        const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ko`
        );
        const data = await response.json();
        
        if (data.city || data.locality) {
            return data.city || data.locality || `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        }
        return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    } catch (error) {
        console.error('위치명 가져오기 실패:', error);
        return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    }
}

// 날씨 정보 가져오기 (Open-Meteo) - 추가 파라미터 포함
async function getWeatherData(lat, lon) {
    try {
        // 더 많은 파라미터 요청 (대체 데이터 확보)
        const url = `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,cloud_cover,precipitation,is_day,weather_code,uv_index&timezone=auto`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('날씨 정보를 가져올 수 없습니다.');
        }
        
        const data = await response.json();
        return data.current;
    } catch (error) {
        console.error('날씨 데이터 가져오기 실패:', error);
        throw error;
    }
}

// 공기질 정보 가져오기 (Open-Meteo Air Quality API)
async function getAirQualityData(lat, lon) {
    try {
        const url = `${AIR_QUALITY_API_URL}?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('공기질 정보를 가져올 수 없습니다.');
        }
        
        const data = await response.json();
        return data.current;
    } catch (error) {
        console.error('공기질 데이터 가져오기 실패:', error);
        return null; // 에러 시 null 반환
    }
}

// 자외선 지수 계산 (기상 조건 기반 추정)
function calculateUVIndex(lat, lon, time, cloudCover, weatherCode) {
    // 시간대별 자외선 강도 (대략적)
    const hour = new Date(time).getHours();
    const isDaytime = hour >= 6 && hour < 18;
    
    if (!isDaytime) {
        return 0; // 밤에는 자외선 없음
    }
    
    // 위도 기반 자외선 (적도에 가까울수록 높음)
    const latitudeFactor = Math.cos((lat * Math.PI) / 180);
    
    // 시간대별 자외선 (정오에 가장 높음)
    const timeFactor = Math.abs(Math.cos(((hour - 12) * Math.PI) / 12));
    
    // 기본 자외선 지수 계산
    let baseUV = 10 * latitudeFactor * timeFactor;
    
    // 구름량에 따른 감소
    if (cloudCover !== null && cloudCover !== undefined) {
        baseUV *= (1 - cloudCover / 200); // 구름이 많을수록 감소
    }
    
    // 날씨 코드에 따른 조정
    if (weatherCode >= 61 && weatherCode <= 67) {
        baseUV *= 0.3; // 비가 오면 크게 감소
    } else if (weatherCode >= 71 && weatherCode <= 77) {
        baseUV *= 0.5; // 눈이 오면 감소
    } else if (weatherCode >= 45 && weatherCode <= 48) {
        baseUV *= 0.2; // 안개는 크게 감소
    }
    
    return Math.max(0, Math.min(11, Math.round(baseUV)));
}

// 미세먼지 상태 평가
function getPMStatus(value, type) {
    if (type === 'pm10') {
        if (value <= 30) return { text: t('statusGood'), class: 'status-good' };
        if (value <= 80) return { text: t('statusModerate'), class: 'status-moderate' };
        if (value <= 150) return { text: t('statusBad'), class: 'status-unhealthy' };
        return { text: t('statusVeryBad'), class: 'status-very-unhealthy' };
    } else if (type === 'pm25') {
        if (value <= 15) return { text: t('statusGood'), class: 'status-good' };
        if (value <= 35) return { text: t('statusModerate'), class: 'status-moderate' };
        if (value <= 75) return { text: t('statusBad'), class: 'status-unhealthy' };
        return { text: t('statusVeryBad'), class: 'status-very-unhealthy' };
    }
}

// 자외선 지수 상태 평가
function getUVStatus(value) {
    if (value <= 2) return { text: t('uvLow'), class: 'status-good' };
    if (value <= 5) return { text: t('uvModerate'), class: 'status-moderate' };
    if (value <= 7) return { text: t('uvHigh'), class: 'status-unhealthy' };
    if (value <= 10) return { text: t('uvVeryHigh'), class: 'status-very-unhealthy' };
    return { text: t('uvExtreme'), class: 'status-very-unhealthy' };
}

// 외출 지수 메시지 생성
function getOutdoorTip(temperature, pm25, uvIndex) {
    if (pm25 !== null && pm25 > 35) {
        return t('tipMask');
    }
    if (temperature !== null && temperature < 5) {
        return t('tipCoat');
    }
    if (temperature !== null && temperature < 10) {
        return t('tipScarf');
    }
    if (uvIndex !== null && uvIndex > 6) {
        return t('tipSunscreenHigh');
    }
    if (uvIndex !== null && uvIndex <= 2) {
        return t('tipSunscreenLow');
    }
    if (temperature !== null && temperature >= 25) {
        return t('tipDrink');
    }
    return t('tipGood');
}

// 데이터 표시
async function displayWeatherData(weatherData, airQualityData, locationName, lat, lon) {
    // 현재 데이터 저장 (공유 이미지용)
    currentWeatherData = weatherData;
    currentAirQualityData = airQualityData;
    currentLocationNameRaw = locationName;
    currentLocationName = getLocalizedCityName(locationName);
    // 위치 정보
    elements.location.textContent = currentLocationName || t('locationLoading');
    
    // 기온 (필수 데이터)
    const temperature = weatherData.temperature_2m;
    if (temperature !== null && temperature !== undefined) {
        elements.temperature.textContent = Math.round(temperature);
    } else {
        elements.temperature.textContent = '--';
    }
    
    // 체감온도 (없으면 기온과 동일하게 처리)
    let feelsLike = weatherData.apparent_temperature;
    if (feelsLike === null || feelsLike === undefined) {
        feelsLike = temperature; // 기온으로 대체
    }
    elements.feelsLike.textContent = `${Math.round(feelsLike)}°C`;
    
    // 날씨 상태 (없으면 구름량/강수량으로 유추)
    let weatherCode = weatherData.weather_code;
    if (weatherCode === null || weatherCode === undefined) {
        const cloudCover = weatherData.cloud_cover || 0;
        const precipitation = weatherData.precipitation || 0;
        const isDay = weatherData.is_day !== null ? weatherData.is_day : 1;
        weatherCode = inferWeatherCode(cloudCover, precipitation, isDay);
    }
    
    const weatherInfo = getWeatherFromCode(weatherCode);
    elements.weatherIcon.textContent = weatherInfo.icon;
    elements.weatherDesc.textContent = weatherInfo.desc;
    
    // 미세먼지 (PM10) - 공기질 API에서 가져오거나 날씨 API에서 가져오기
    let pm10 = null;
    if (airQualityData && airQualityData.pm10 !== null && airQualityData.pm10 !== undefined) {
        pm10 = airQualityData.pm10;
    } else if (weatherData.pm10 !== null && weatherData.pm10 !== undefined) {
        pm10 = weatherData.pm10;
    }
    
    if (pm10 !== null) {
        const pm10Status = getPMStatus(pm10, 'pm10');
        elements.pm10.querySelector('.value').textContent = Math.round(pm10);
        elements.pm10Status.textContent = pm10Status.text;
        elements.pm10Status.className = `info-status ${pm10Status.class}`;
    } else {
        elements.pm10.querySelector('.value').textContent = '--';
        elements.pm10Status.textContent = t('noData');
        elements.pm10Status.className = 'info-status';
    }
    
    // 초미세먼지 (PM2.5) - 공기질 API에서 가져오거나 날씨 API에서 가져오기
    let pm25 = null;
    if (airQualityData && airQualityData.pm2_5 !== null && airQualityData.pm2_5 !== undefined) {
        pm25 = airQualityData.pm2_5;
    } else if (weatherData.pm2_5 !== null && weatherData.pm2_5 !== undefined) {
        pm25 = weatherData.pm2_5;
    }
    
    if (pm25 !== null) {
        const pm25Status = getPMStatus(pm25, 'pm25');
        elements.pm25.querySelector('.value').textContent = Math.round(pm25);
        elements.pm25Status.textContent = pm25Status.text;
        elements.pm25Status.className = `info-status ${pm25Status.class}`;
    } else {
        elements.pm25.querySelector('.value').textContent = '--';
        elements.pm25Status.textContent = t('noData');
        elements.pm25Status.className = 'info-status';
    }
    
    // 자외선 지수 (없으면 계산)
    let uvIndex = weatherData.uv_index;
    if (uvIndex === null || uvIndex === undefined) {
        // 계산으로 추정
        const currentTime = new Date().toISOString();
        uvIndex = calculateUVIndex(
            lat, 
            lon, 
            currentTime, 
            weatherData.cloud_cover, 
            weatherCode
        );
    }
    
    if (uvIndex !== null && uvIndex !== undefined) {
        const uvValue = Math.round(uvIndex);
        const uvStatusData = getUVStatus(uvValue);
        elements.uvIndex.textContent = uvValue;
        elements.uvStatus.textContent = uvStatusData.text;
        elements.uvStatus.className = `info-status ${uvStatusData.class}`;
    } else {
        elements.uvIndex.textContent = '--';
        elements.uvStatus.textContent = t('noData');
        elements.uvStatus.className = 'info-status';
    }
    
    // 외출 지수 메시지 표시
    const tipMessage = getOutdoorTip(temperature, pm25, uvIndex);
    elements.tipContent.textContent = tipMessage;
    elements.tipCard.style.display = 'block';
    
    // 이웃 동네 비교 데이터 로드
    loadCompareData(lat, lon);
}

// 날씨 정보 로드
async function loadWeatherData() {
    try {
        elements.loading.classList.remove('hidden');
        
        const location = await getCurrentLocation();
        
        // 날씨 데이터와 공기질 데이터를 병렬로 가져오기
        const [weatherData, airQualityData, locationName] = await Promise.all([
            getWeatherData(location.lat, location.lon),
            getAirQualityData(location.lat, location.lon),
            getLocationName(location.lat, location.lon)
        ]);
        
        await displayWeatherData(weatherData, airQualityData, locationName, location.lat, location.lon);
        elements.loading.classList.add('hidden');
    } catch (error) {
        elements.loading.classList.add('hidden');
        alert(t('alertFetchFail'));
        console.error('날씨 데이터 로드 실패:', error);
    }
}

// 공유 기능
async function shareWeather() {
    const locationText = elements.location.textContent;
    const temp = elements.temperature.textContent;
    const desc = elements.weatherDesc.textContent;
    const pm10Text = elements.pm10Status.textContent;
    const pm25Text = elements.pm25Status.textContent;
    
    const shareText = t('shareText', {
        location: locationText,
        temp,
        desc,
        pm10: pm10Text,
        pm25: pm25Text
    });
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: t('shareTitle'),
                text: shareText,
                url: window.location.href
            });
        } catch (error) {
            if (error.name !== 'AbortError') {
                fallbackShare(shareText);
            }
        }
    } else {
        fallbackShare(shareText);
    }
}

// 공유 대체 방법
function fallbackShare(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text + '\n' + window.location.href).then(() => {
            alert(t('shareCopied'));
        });
    } else {
        prompt(t('sharePrompt'), text + '\n' + window.location.href);
    }
}

// 이웃 동네 비교 데이터 로드
async function loadCompareData(currentLat, currentLon) {
    try {
        // 현재 위치가 서울 근처인지 확인
        const isNearSeoul = currentLat > 37.4 && currentLat < 37.7 && currentLon > 126.8 && currentLon < 127.2;
        
        if (!isNearSeoul) {
            elements.compareSection.style.display = 'none';
            return;
        }
        
        const compareLocations = ['강남', '홍대', '잠실', '인천'];
        const compareData = [];
        
        // 병렬로 데이터 가져오기
        const promises = compareLocations.map(async (cityName) => {
            const city = majorCities[cityName];
            try {
                const [weather, airQuality] = await Promise.all([
                    getWeatherData(city.lat, city.lon),
                    getAirQualityData(city.lat, city.lon)
                ]);
                
                let pm25 = null;
                if (airQuality && airQuality.pm2_5 !== null) {
                    pm25 = airQuality.pm2_5;
                }
                
                const pm25Status = pm25 !== null ? getPMStatus(pm25, 'pm25') : null;
                
                return {
                    name: currentLang === 'en' ? city.nameEn : city.name,
                    temp: Math.round(weather.temperature_2m),
                    pm25Status: pm25Status ? pm25Status.text : '--'
                };
            } catch (error) {
                console.error(`${cityName} 데이터 로드 실패:`, error);
                return null;
            }
        });
        
        const results = await Promise.all(promises);
        const validResults = results.filter(r => r !== null);
        
        if (validResults.length > 0) {
            displayCompareData(validResults);
            elements.compareSection.style.display = 'block';
        } else {
            elements.compareSection.style.display = 'none';
        }
    } catch (error) {
        console.error('비교 데이터 로드 실패:', error);
        elements.compareSection.style.display = 'none';
    }
}

// 이웃 동네 비교 데이터 표시
function displayCompareData(compareData) {
    const listHTML = compareData.map(item => `
        <div class="compare-item">
            <span class="compare-name">${item.name}</span>
            <span class="compare-temp">${item.temp}°C</span>
            <span class="compare-status">${item.pm25Status}</span>
        </div>
    `).join('');
    
    elements.compareList.innerHTML = listHTML;
}

// 이미지 카드 생성 및 공유
async function createAndShareImage() {
    if (!currentWeatherData || !currentLocationName) {
        alert(t('shareNeedData'));
        return;
    }
    
    try {
        const canvas = elements.shareCanvas;
        const ctx = canvas.getContext('2d');
        
        // 캔버스 크기 설정 (SNS 공유 최적화)
        canvas.width = 1200;
        canvas.height = 630;
        
        // 그라데이션 배경
        const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 630);
        
        // 텍스트 색상 및 폰트
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        
        // 위치명
        ctx.font = 'bold 48px Arial';
        ctx.fillText(`${currentLocationName}  |  ${t('title')}`, 600, 100);
        
        // 날씨 아이콘 및 온도
        const temp = Math.round(currentWeatherData.temperature_2m);
        const feelsLike = Math.round(currentWeatherData.apparent_temperature || currentWeatherData.temperature_2m);
        const weatherCode = currentWeatherData.weather_code || 0;
        const weatherInfo = getWeatherFromCode(weatherCode);
        
        ctx.font = '120px Arial';
        ctx.fillText(weatherInfo.icon, 600, 250);
        
        ctx.font = 'bold 72px Arial';
        ctx.fillText(`⛅ ${temp}°C (${t('feelsLikeShort')} ${feelsLike}°C)`, 600, 350);
        
        // 미세먼지 정보
        let pm10 = null;
        let pm25 = null;
        if (currentAirQualityData) {
            pm10 = currentAirQualityData.pm10;
            pm25 = currentAirQualityData.pm2_5;
        }
        
        let airInfo = '';
        if (pm10 !== null && pm25 !== null) {
            const pm10Status = getPMStatus(pm10, 'pm10');
            const pm25Status = getPMStatus(pm25, 'pm25');
            const uvValue = Math.round(currentWeatherData.uv_index || 0);
            const uvStatusData = getUVStatus(uvValue);
            
            airInfo = `${t('pm10Short')} ${Math.round(pm10)} ${pm10Status.text} · ${t('pm25Short')} ${Math.round(pm25)} ${pm25Status.text} · ${t('uvShort')} ${uvValue} ${uvStatusData.text}`;
        } else {
            const uvValue = Math.round(currentWeatherData.uv_index || 0);
            const uvStatusData = getUVStatus(uvValue);
            airInfo = `${t('uvShort')} ${uvValue} ${uvStatusData.text}`;
        }
        
        ctx.font = '36px Arial';
        ctx.fillText(airInfo, 600, 450);
        
        // 이미지를 Blob으로 변환
        canvas.toBlob(async (blob) => {
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'weather.png', { type: 'image/png' })] })) {
                try {
                    const file = new File([blob], t('downloadFileName'), { type: 'image/png' });
                    await navigator.share({
                        title: t('shareImageTitle'),
                        text: t('shareImageText', { location: currentLocationName }),
                        files: [file]
                    });
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        downloadImage(blob);
                    }
                }
            } else {
                downloadImage(blob);
            }
        }, 'image/png');
    } catch (error) {
        console.error('이미지 생성 실패:', error);
        alert(t('imageCreateFail'));
    }
}

// 이미지 다운로드
function downloadImage(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = t('downloadFileName');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(t('imageDownloaded'));
}

// 이벤트 리스너
elements.refreshBtn.addEventListener('click', loadWeatherData);
elements.shareBtn.addEventListener('click', shareWeather);
elements.shareImageBtn.addEventListener('click', createAndShareImage);

// 초기 언어 설정
initLanguage();

// 페이지 로드 시 날씨 정보 가져오기
loadWeatherData();

// 주기적 업데이트 (10분마다)
setInterval(loadWeatherData, 600000);
