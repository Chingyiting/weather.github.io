const apiKey = "904a626f251b65d24e653d163eb782e7";


const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const currentWeatherDiv = document.getElementsByClassName("weatherInfo")[0];
const forecastDiv = document.getElementById("forecastContainer");
const loadingDiv = document.getElementById("loading");
const searchTitle = document.getElementById("searchTitle");
const cityTitle = document.getElementsByClassName("cityName")[0];
const todaysdateDiv = document.getElementsByClassName("todaysDate")[0];
const userProfileDiv = document.getElementsByClassName("userProfile")[0];

// search func
let search = () => {
    let city = cityInput.value.trim(); // Get and remove the leading and trailing spaces of the city name
    city = city.charAt(0).toUpperCase() + city.slice(1);
    if (city) {
        // Add blur effect to search process
        document.body.classList.add("blurred");
        getWeather(city);
        getForecast(city);

        searchTitle.style.display = "none";
        cityTitle.textContent = city;

        // show forecastContainer
        forecastDiv.style.display = "flex";
        forecastDiv.style.justifyContent = "space-around";
    } else {
        alert("Please enter a city name");
    }
};

// clicked button event
searchBtn.addEventListener("click", search);

// Trigger search when Enter key is pressed
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent line breaks
        search(); // Call the search function
    }
});

// show & hide loading animation
function showLoading() {
    loadingDiv.style.display = "block";
}

function hideLoading() {
    loadingDiv.style.display = "none";
}



// Get current weather data
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

// Show current weather
function displayCurrentWeather(data) {
    const { main, weather } = data;
    const temp = Math.round(main.temp);        // rounding
    const tempMax = Math.round(main.temp_max);
    const tempMin = Math.round(main.temp_min);

    const currentDate = new Date();
    const month = currentDate.toLocaleDateString("en-US", { month: "long" });
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();

    const formattedDate = `${month} ${date}, ${year}`; // format date
    todaysdateDiv.textContent = formattedDate; //show current weather

    // Get background image based on weather description
    const description = weather[0].description;
    const backgroundImage = getWeatherBackground(description);


    // Get container element
    const container = document.querySelector(".container");

    // set background img
    container.style.backgroundImage = backgroundImage;

    // Set content
    currentWeatherDiv.innerHTML = `
        <p class="temperature">${temp}°c</p>
        <p class="max_min_temp">L: ${tempMin}° H: ${tempMax}° </p>
        <p class="condition">${description}</p>
        
    `;

    currentWeatherDiv.style.display = 'block';

}

// Get a five-day weather forecast
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

// Show five-day weather forecast
function displayForecast(data) {
    forecastDiv.innerHTML = ''; // Clear previous content
    const forecastList = data.list.filter((_, index) => index % 8 === 0); //Get forecasts every 8 periods (24 hours)
    let lineCount = 0;

    forecastList.forEach((item, i) => {
        const dateObj = new Date(item.dt * 1000);

        const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

        const tempMax = Math.round(item.main.temp_max); // rounding
        const tempMin = Math.round(item.main.temp_min);
        const description = item.weather[0].description;
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;


        // create forecastDay element dynamically
        const forecastDay = document.createElement("div");
        forecastDay.classList.add("forecast-day");

        // Add content to forecastDay
        forecastDay.innerHTML = `
            <h3>${weekday}</h3>
            <img src="${iconUrl}" alt="${description}" >
            <p>${description}</p>
            <span id="tempMin"> ${tempMin}°</span> /
            <span id="tempMax"> ${tempMax}°</span>
        `;

        setTimeout(() => {
            forecastDay.style.display = 'block'; 
            forecastDiv.appendChild(forecastDay);

            // Insert lineDiv only the first four times
            if (lineCount < 4) {
                const lineDiv = document.createElement("div");
                lineDiv.classList.add("line");
                forecastDiv.appendChild(lineDiv);
                lineCount++; 
            }


        }, 100 * (i + 1));

    });

}

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
            return 'url("sky.jpg")'; 
    }
}


