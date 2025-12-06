// Open-Meteo API (무료, API 키 불필요)
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

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
    loading: document.getElementById('loading')
};

// 위치 정보 저장
let currentLocation = null;

// WMO Weather Code를 날씨 설명과 아이콘으로 변환
function getWeatherFromCode(code) {
    const weatherMap = {
        0: { icon: '☀️', desc: '맑음' },
        1: { icon: '🌤️', desc: '대체로 맑음' },
        2: { icon: '⛅', desc: '부분적으로 흐림' },
        3: { icon: '☁️', desc: '흐림' },
        45: { icon: '🌫️', desc: '안개' },
        48: { icon: '🌫️', desc: '서리 안개' },
        51: { icon: '🌦️', desc: '약한 이슬비' },
        53: { icon: '🌦️', desc: '적당한 이슬비' },
        55: { icon: '🌦️', desc: '강한 이슬비' },
        56: { icon: '🌨️', desc: '약한 진눈깨비' },
        57: { icon: '🌨️', desc: '강한 진눈깨비' },
        61: { icon: '🌧️', desc: '약한 비' },
        63: { icon: '🌧️', desc: '적당한 비' },
        65: { icon: '🌧️', desc: '강한 비' },
        66: { icon: '🌨️', desc: '약한 얼음비' },
        67: { icon: '🌨️', desc: '강한 얼음비' },
        71: { icon: '❄️', desc: '약한 눈' },
        73: { icon: '❄️', desc: '적당한 눈' },
        75: { icon: '❄️', desc: '강한 눈' },
        77: { icon: '❄️', desc: '눈송이' },
        80: { icon: '🌦️', desc: '약한 소나기' },
        81: { icon: '🌦️', desc: '적당한 소나기' },
        82: { icon: '🌦️', desc: '강한 소나기' },
        85: { icon: '🌨️', desc: '약한 눈 소나기' },
        86: { icon: '🌨️', desc: '강한 눈 소나기' },
        95: { icon: '⛈️', desc: '천둥번개' },
        96: { icon: '⛈️', desc: '우박과 천둥번개' },
        99: { icon: '⛈️', desc: '강한 우박과 천둥번개' }
    };
    
    return weatherMap[code] || { icon: '☀️', desc: '알 수 없음' };
}

// 위치 정보 가져오기
async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('위치 정보를 지원하지 않는 브라우저입니다.'));
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
                reject(new Error('위치 정보를 가져올 수 없습니다.'));
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    });
}

// 위치명 가져오기 (역지오코딩)
async function getLocationName(lat, lon) {
    try {
        // Open-Meteo의 역지오코딩 API 사용
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

// 날씨 정보 가져오기 (Open-Meteo)
async function getWeatherData(lat, lon) {
    try {
        const url = `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,pm10,pm2_5,uv_index,weather_code`;
        
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

// 미세먼지 상태 평가
function getPMStatus(value, type) {
    if (type === 'pm10') {
        if (value <= 30) return { text: '좋음', class: 'status-good' };
        if (value <= 80) return { text: '보통', class: 'status-moderate' };
        if (value <= 150) return { text: '나쁨', class: 'status-unhealthy' };
        return { text: '매우나쁨', class: 'status-very-unhealthy' };
    } else if (type === 'pm25') {
        if (value <= 15) return { text: '좋음', class: 'status-good' };
        if (value <= 35) return { text: '보통', class: 'status-moderate' };
        if (value <= 75) return { text: '나쁨', class: 'status-unhealthy' };
        return { text: '매우나쁨', class: 'status-very-unhealthy' };
    }
}

// 자외선 지수 상태 평가
function getUVStatus(value) {
    if (value <= 2) return { text: '낮음', class: 'status-good' };
    if (value <= 5) return { text: '보통', class: 'status-moderate' };
    if (value <= 7) return { text: '높음', class: 'status-unhealthy' };
    if (value <= 10) return { text: '매우높음', class: 'status-very-unhealthy' };
    return { text: '위험', class: 'status-very-unhealthy' };
}

// 데이터 표시
async function displayWeatherData(weatherData, locationName) {
    // 위치 정보
    elements.location.textContent = locationName || '위치 확인 중...';
    
    // 온도
    elements.temperature.textContent = Math.round(weatherData.temperature_2m);
    
    // 날씨 아이콘 및 설명
    const weatherInfo = getWeatherFromCode(weatherData.weather_code);
    elements.weatherIcon.textContent = weatherInfo.icon;
    elements.weatherDesc.textContent = weatherInfo.desc;
    
    // 체감온도
    elements.feelsLike.textContent = `${Math.round(weatherData.apparent_temperature)}°C`;
    
    // 미세먼지 (PM10)
    if (weatherData.pm10 !== null && weatherData.pm10 !== undefined) {
        const pm10 = weatherData.pm10;
        const pm10Status = getPMStatus(pm10, 'pm10');
        elements.pm10.querySelector('.value').textContent = Math.round(pm10);
        elements.pm10Status.textContent = pm10Status.text;
        elements.pm10Status.className = `info-status ${pm10Status.class}`;
    } else {
        elements.pm10.querySelector('.value').textContent = '--';
        elements.pm10Status.textContent = '데이터 없음';
        elements.pm10Status.className = 'info-status';
    }
    
    // 초미세먼지 (PM2.5)
    if (weatherData.pm2_5 !== null && weatherData.pm2_5 !== undefined) {
        const pm25 = weatherData.pm2_5;
        const pm25Status = getPMStatus(pm25, 'pm25');
        elements.pm25.querySelector('.value').textContent = Math.round(pm25);
        elements.pm25Status.textContent = pm25Status.text;
        elements.pm25Status.className = `info-status ${pm25Status.class}`;
    } else {
        elements.pm25.querySelector('.value').textContent = '--';
        elements.pm25Status.textContent = '데이터 없음';
        elements.pm25Status.className = 'info-status';
    }
    
    // 자외선 지수
    if (weatherData.uv_index !== null && weatherData.uv_index !== undefined) {
        const uvValue = Math.round(weatherData.uv_index);
        const uvStatusData = getUVStatus(uvValue);
        elements.uvIndex.textContent = uvValue;
        elements.uvStatus.textContent = uvStatusData.text;
        elements.uvStatus.className = `info-status ${uvStatusData.class}`;
    } else {
        elements.uvIndex.textContent = '--';
        elements.uvStatus.textContent = '데이터 없음';
        elements.uvStatus.className = 'info-status';
    }
}

// 날씨 정보 로드
async function loadWeatherData() {
    try {
        elements.loading.classList.remove('hidden');
        
        const location = await getCurrentLocation();
        const [weatherData, locationName] = await Promise.all([
            getWeatherData(location.lat, location.lon),
            getLocationName(location.lat, location.lon)
        ]);
        
        await displayWeatherData(weatherData, locationName);
        elements.loading.classList.add('hidden');
    } catch (error) {
        elements.loading.classList.add('hidden');
        alert('날씨 정보를 불러올 수 없습니다. 위치 권한을 확인해주세요.');
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
    
    const shareText = `지금날씨 🌤️\n\n${locationText}\n온도: ${temp}°C (${desc})\n미세먼지: ${pm10Text}\n초미세먼지: ${pm25Text}\n\n#지금날씨`;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: '지금날씨',
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
            alert('클립보드에 복사되었습니다!');
        });
    } else {
        prompt('아래 텍스트를 복사하세요:', text + '\n' + window.location.href);
    }
}

// 이벤트 리스너
elements.refreshBtn.addEventListener('click', loadWeatherData);
elements.shareBtn.addEventListener('click', shareWeather);

// 페이지 로드 시 날씨 정보 가져오기
loadWeatherData();

// 주기적 업데이트 (10분마다)
setInterval(loadWeatherData, 600000);
