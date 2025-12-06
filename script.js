// Open-Meteo API (무료, API 키 불필요)
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

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

// 주요 도시 좌표 (fallback 및 비교용)
const majorCities = {
    '서울': { lat: 37.5665, lon: 126.9780, name: '서울' },
    '강남': { lat: 37.4979, lon: 127.0276, name: '강남' },
    '홍대': { lat: 37.5563, lon: 126.9233, name: '홍대' },
    '잠실': { lat: 37.5133, lon: 127.1028, name: '잠실' },
    '인천': { lat: 37.4563, lon: 126.7052, name: '인천' },
    '부산': { lat: 35.1796, lon: 129.0756, name: '부산' },
    '대구': { lat: 35.8714, lon: 128.6014, name: '대구' }
};

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

// 외출 지수 메시지 생성
function getOutdoorTip(temperature, pm25, uvIndex) {
    if (pm25 !== null && pm25 > 35) {
        return '😷 마스크 권장 (초미세먼지 높음)';
    }
    if (temperature !== null && temperature < 5) {
        return '🧣 겉옷 필수!';
    }
    if (temperature !== null && temperature < 10) {
        return '🌬️ 목도리 챙기면 좋아요';
    }
    if (uvIndex !== null && uvIndex > 6) {
        return '🧴 자외선 강함 – 선크림 필수';
    }
    if (uvIndex !== null && uvIndex <= 2) {
        return '🧴 자외선 낮음 – 편한 외출 가능';
    }
    if (temperature !== null && temperature >= 25) {
        return '🥤 시원한 음료 챙기세요';
    }
    return '☀️ 좋은 날씨예요!';
}

// 데이터 표시
async function displayWeatherData(weatherData, airQualityData, locationName, lat, lon) {
    // 현재 데이터 저장 (공유 이미지용)
    currentWeatherData = weatherData;
    currentAirQualityData = airQualityData;
    currentLocationName = locationName;
    // 위치 정보
    elements.location.textContent = locationName || '위치 확인 중...';
    
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
        elements.pm10Status.textContent = '데이터 없음';
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
        elements.pm25Status.textContent = '데이터 없음';
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
        elements.uvStatus.textContent = '데이터 없음';
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
                    name: cityName,
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
        alert('날씨 데이터를 먼저 불러와주세요.');
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
        ctx.fillText(`${currentLocationName}  |  지금날씨`, 600, 100);
        
        // 날씨 아이콘 및 온도
        const temp = Math.round(currentWeatherData.temperature_2m);
        const feelsLike = Math.round(currentWeatherData.apparent_temperature || currentWeatherData.temperature_2m);
        const weatherCode = currentWeatherData.weather_code || 0;
        const weatherInfo = getWeatherFromCode(weatherCode);
        
        ctx.font = '120px Arial';
        ctx.fillText(weatherInfo.icon, 600, 250);
        
        ctx.font = 'bold 72px Arial';
        ctx.fillText(`⛅ ${temp}°C (체감 ${feelsLike}°C)`, 600, 350);
        
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
            
            airInfo = `미세 ${Math.round(pm10)} ${pm10Status.text} · 초미세 ${Math.round(pm25)} ${pm25Status.text} · UV ${uvValue} ${uvStatusData.text}`;
        } else {
            const uvValue = Math.round(currentWeatherData.uv_index || 0);
            const uvStatusData = getUVStatus(uvValue);
            airInfo = `UV ${uvValue} ${uvStatusData.text}`;
        }
        
        ctx.font = '36px Arial';
        ctx.fillText(airInfo, 600, 450);
        
        // 이미지를 Blob으로 변환
        canvas.toBlob(async (blob) => {
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'weather.png', { type: 'image/png' })] })) {
                try {
                    const file = new File([blob], '지금날씨.png', { type: 'image/png' });
                    await navigator.share({
                        title: '지금날씨',
                        text: `${currentLocationName} 날씨 정보`,
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
        alert('이미지 생성에 실패했습니다.');
    }
}

// 이미지 다운로드
function downloadImage(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '지금날씨.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('이미지가 다운로드되었습니다!');
}

// 이벤트 리스너
elements.refreshBtn.addEventListener('click', loadWeatherData);
elements.shareBtn.addEventListener('click', shareWeather);
elements.shareImageBtn.addEventListener('click', createAndShareImage);

// 페이지 로드 시 날씨 정보 가져오기
loadWeatherData();

// 주기적 업데이트 (10분마다)
setInterval(loadWeatherData, 600000);
