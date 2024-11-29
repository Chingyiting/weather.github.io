const apiKey = '904a626f251b65d24e653d163eb782e7';

// 元素選擇
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentWeatherDiv = document.getElementsByClassName('weatherInfo')[0];
const forecastDiv = document.getElementById('forecastContainer');
const forecastDay = document.getElementsByClassName('forecast-day')[0];
const loadingDiv = document.getElementById('loading');
const searchTitle = document.getElementById('searchTitle');
const lineDiv = document.getElementsByClassName('line')[0];
const cityTitle = document.getElementsByClassName('cityName')[0];
const todaysdateDiv = document.getElementsByClassName('todaysDate')[0];
// 搜尋函數
let search = () => {
    let city = cityInput.value.trim(); // 取得並去除前後空白的城市名稱
    city = city.charAt(0).toUpperCase() + city.slice(1);
    if (city) {
        // 在搜尋過程中加上模糊效果
        document.body.classList.add('blurred');
        getWeather(city);
        getForecast(city);
        // 將標題更新為使用者輸入的城市名稱
        // searchTitle.textContent = city;
        // searchTitle.style.color = 'white'
        searchTitle.style.display = "none";
        cityTitle.textContent = city;
         // 顯示 forecast-container
        forecastDiv.style.display = 'flex'; // 顯示並設定為 Flex 排版
        forecastDiv.style.justifyContent = 'flex-start';
        //lineDiv.style.display = 'block';
        
    } else {
        alert('Please enter a city name');
    }
};

// 點擊查詢按鈕後觸發事件
searchBtn.addEventListener('click', search);
    
// 當按下 Enter 鍵時觸發搜尋
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // 防止換行
        search(); // 調用搜尋函數
    }
});

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
    const { main, weather } = data;
    const temp = Math.round(main.temp);        // 四捨五入
    const tempMax = Math.round(main.temp_max); // 四捨五入
    const tempMin = Math.round(main.temp_min); // 四捨五入
    // const icon = weather[0].icon;              // 獲取圖示代碼
    //const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`; // 圖示 URL
    
    const currentDate = new Date();
    //const day = currentDate.toLocaleDateString('en-US', { weekday: 'long' }); // 星期
    const month = currentDate.toLocaleDateString('en-US', { month: 'long' }); // 月份
    const date = currentDate.getDate(); // 日期
    const year = currentDate.getFullYear(); // 年份

    const formattedDate = `${month} ${date}, ${year}`; // 格式化日期
    todaysdateDiv.textContent = formattedDate; //顯示當天天氣

    // 根據天氣描述獲取背景圖片
    const description = weather[0].description;
    const backgroundImage = getWeatherBackground(description);


    // 獲取容器元素
    const container = document.querySelector('.container');

    // 設置背景圖片
    container.style.backgroundImage = backgroundImage;

    // 設置內容
    currentWeatherDiv.innerHTML = `
        <p class="temperature">${temp}°c</p>
        <p class="max_min_temp">H: ${tempMax}° L: ${tempMin}°</p>
        <p class="condition">${description}</p>
        
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
        forecastDiv.innerHTML = `<p>無法獲取預報資料${error}</p>`;
    }
    hideLoading();
}




// 顯示五天天氣預報
function displayForecast(data) {
    forecastDiv.innerHTML = ''; // 清空之前的內容
    const forecastList = data.list.filter((_, index) => index % 8 === 0); // 每隔 8 個時段（24 小時）獲取一次預測
    let lineCount = 0; // 用來計算已插入的 lineDiv 次數

    forecastList.forEach((item, i) => {
        const dateObj = new Date(item.dt * 1000);
    
        const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const day = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        
        const date = `${weekday} ${day}`; // 將星期放在日期前面

        const tempMax = Math.round(item.main.temp_max); // 四捨五入最高溫
        const tempMin = Math.round(item.main.temp_min); // 四捨五入最低溫
        const description = item.weather[0].description;
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // 圖示 URL

        
        // 創建 forecastDay 元素
        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');

        // 添加內容到 forecastDay
        forecastDay.innerHTML = `
            <h3>${weekday}</h3>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <p>${description}</p>
            <span id="tempMax"> ${tempMax}°</span> / 
            <span id="tempMin"> ${tempMin}°</span>
        `;

        setTimeout(() => {
            forecastDay.style.display = 'block'; // 顯示 forecastDay
            forecastDiv.appendChild(forecastDay);
        
            // 只在前四次插入 lineDiv
            if (lineCount < 4) {
                const lineDiv = document.createElement('div');
                lineDiv.classList.add('line');
                forecastDiv.appendChild(lineDiv);
                lineCount++; // 增加計數器
            }


        }, 100*(i+1));
   
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


