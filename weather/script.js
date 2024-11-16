const apiKey = '904a626f251b65d24e653d163eb782e7'; // 使用你的 OpenWeatherMap API Key

// 元素選擇
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentWeatherDiv = document.getElementsByClassName('today')[0];
const forecastDiv = document.getElementById('forecastContainer');
const loadingDiv = document.getElementById('loading');
const searchTitle = document.getElementById('searchTitle');
const forecastContainer = document.querySelector('.forecast-container');


// 這段要再精簡優化!!!!!!
// 點擊查詢按鈕後觸發事件
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        // 在搜尋過程中加上模糊效果
        document.body.classList.add('blurred');
        getWeather(city);
        getForecast(city);
        // 將標題更新為用戶輸入的城市名稱
        searchTitle.textContent = city;
        searchTitle.style.color = 'white'
         // 顯示 forecast-container
        forecastContainer.style.display = 'flex'; // 顯示並設定為 Flex 排版
    }
});

// 當按下 Enter 鍵時觸發搜尋
const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // 防止換行
        search(); // 調用搜尋函數
    }
};
cityInput.addEventListener('keydown', handleEnterKeyPress);

// 搜尋函數
const search = () => {
    const city = cityInput.value.trim(); // 取得並去除前後空白的城市名稱
    if (city) {
        // 在搜尋過程中加上模糊效果
        document.body.classList.add('blurred');
        getWeather(city);
        getForecast(city);
        // 將標題更新為用戶輸入的城市名稱
        searchTitle.textContent = city;
        searchTitle.style.color = 'white'
         // 顯示 forecast-containerS
        forecastContainer.style.display = 'flex'; // 顯示並設定為 Flex 排版
    } else {
        alert('Please enter a city name');
    }
};



// 顯示和隱藏 loading 動畫
function showLoading() {
    loadingDiv.style.display = 'block';
}

function hideLoading() {
    loadingDiv.style.display = 'none';
}



// 獲取當前天氣資料
async function getWeather(city) {
    showLoading();
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.cod === 200) {
            displayCurrentWeather(data);
        } else {
            currentWeatherDiv.innerHTML = `<p>找不到該城市</p>`;
        }
    } catch (error) {
        currentWeatherDiv.innerHTML = `<p>無法獲取天氣資料</p>`;
    }
    hideLoading();
}

// 顯示當前天氣
function displayCurrentWeather(data) {
    const { name, main, weather } = data;
    const temp = Math.round(main.temp);        // 四捨五入
    const tempMax = Math.round(main.temp_max); // 四捨五入
    const tempMin = Math.round(main.temp_min); // 四捨五入
    const icon = weather[0].icon;              // 獲取圖示代碼
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`; // 圖示 URL
    
    // 根據天氣描述獲取背景圖片
    const description = weather[0].description;
    const backgroundImage = getWeatherBackground(description);

    // 設置 currentWeatherDiv 的背景圖片
    // currentWeatherDiv.style.backgroundImage = backgroundImage;

    // 獲取容器元素
    const container = document.querySelector('.container');

    // 設置背景圖片
    container.style.backgroundImage = backgroundImage;

    // 設置內容
    currentWeatherDiv.innerHTML = `
        <p class="temperature">${temp} °</p>
        <img src="${iconUrl}" alt="${description}" class="weather-icon">
        <p class="condition">${description}</p>
        <p class="max_min_temp">H: ${tempMax} ° L: ${tempMin} °</p>
    `;
     // 顯示 .today 容器
     currentWeatherDiv.style.display = 'block';
}

// 獲取五天天氣預報
async function getForecast(city) {
    showLoading();
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.cod === "200") {
            displayForecast(data);
        } else {
            forecastDiv.innerHTML = `<p>無法獲取預報資料</p>`;
        }
    } catch (error) {
        forecastDiv.innerHTML = `<p>無法獲取預報資料</p>`;
    }
    hideLoading();
}




// 顯示五天天氣預報
function displayForecast(data) {
    forecastDiv.innerHTML = ''; // 清空之前的內容
    const forecastList = data.list.filter((_, index) => index % 8 === 0); // 每隔 8 個時段（24 小時）獲取一次預測

    forecastList.forEach((item) => {
        

        const dateObj = new Date(item.dt * 1000);
    
        const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const day = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        
        const date = `${weekday} ${day}`; // 將星期放在日期前面


        const tempMax = Math.round(item.main.temp_max); // 四捨五入最高溫
        const tempMin = Math.round(item.main.temp_min); // 四捨五入最低溫
        const description = item.weather[0].description;
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // 圖示 URL

        // console.log(description); // 檢查 description 的內容

        // 取得背景圖片
        // const backgroundImage = getWeatherBackground(description);
        
        // 創建 forecastDay 元素
        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');
   
        
        // 設置背景圖片和透明度
        // forecastDay.style.backgroundImage = backgroundImage;
        
        

        // 添加內容到 forecastDay
        forecastDay.innerHTML = `
            <h3>${weekday}</h3>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <p>${description}</p>
            <span id=tempMax> ${tempMax} °</span> / 
            <span id=tempMin> ${tempMin} °</span>
            <p>${day}</p>
        `;
        forecastDiv.appendChild(forecastDay);

        forecastDay.style.display = 'block'; // 顯示 forecastDay
       
    });
    
}


// 根據天氣狀況設定背景圖片
function getWeatherBackground(description) {
    switch (description.toLowerCase()) {
        case 'clear sky':
            return 'url("img/clear_sky.jpg")'; 
        case 'few clouds':
            return 'url("img/few_clouds.jpg")'; 
        case 'overcast clouds':
            return 'url("img/overcast_clouds.jpg")'; 
        case 'light rain':
            return 'url("img/light_rain.jpg")'; 
        case 'moderate rain':
            return 'url("img/moderate_rain.jpg")';  
        case 'scattered clouds':
            return 'url("img/scattered_clouds.jpg")'; 
        case 'broken clouds':
            return 'url("img/broken_clouds.jpg")'; 
        case 'shower rain':
            return 'url("img/shower_rain.jpg")'; 
        case 'rain':
            return 'url("img/rain.jpg")'; 
        case 'thunderstorm':
            return 'url("img/thunderstorm.jpg")'; 
        case 'snow':
            return 'url("img/snow.jpg")'; 
        case 'light snow':
            return 'url("img/snow.jpg")'; 
        case 'mist':
            return 'url("img/mist.jpg")'; 
        default:
            return 'url("default-weather.jpg")'; // 預設背景圖片
    }
}


