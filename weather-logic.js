const toggleBtn = document.getElementById("toggle-button");
const body = document.body;

// theme toggle function
toggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-theme");

    // Change icon dynamically
    if (body.classList.contains("light-theme")) {
        toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>'; // Moon for light mode
    } else {
        toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>'; // Sun for dark mode
    }
});

let weatherData = null;
let weatherData2 = null;

// unit toggle
let currentUnit = "C"; // Default Celsius

// Modern weather icons using Meteocons (animated SVG)
const AnimatedweatherIcons = {

  200: "thunderstorms-rain.svg",
  201: "thunderstorms-overcast-rain.svg",
  202: "thunderstorms-overcast-rain.svg",
  210: "thunderstorms.svg",
  211: "thunderstorms.svg",
  212: "thunderstorms-extreme.svg",
  221: "thunderstorms.svg",
  230: "thunderstorms.svg",
  231: "thunderstorms-day-extreme.svg",
  232: "thunderstorms-extreme.svg",

  300: "drizzle.svg",
  301: "drizzle.svg",
  302: "overcast-rain.svg",
  310: "drizzle.svg",
  311: "drizzle.svg",
  312: "extreme-drizzle.svg",
  313: "overcast-rain.svg",
  314: "extreme-drizzle.svg",
  321: "overcast-rain.svg",

  500: "rain.svg",           // changed from rainy.svg
  501: "overcast-rain.svg",
  502: "partly-cloudy-day-rain.svg",
  503: "rain-heavy.svg",     // heavier rain
  504: "rain-heavy.svg",
  511: "sleet.svg",      // changed from snowy-rain.svg
  520: "partly-cloudy-day-rain.svg",
  521: "partly-cloudy-day-rain.svg",
  522: "rain-heavy.svg",
  531: "partly-cloudy-day-rain.svg",

  600: "snow.svg",
  601: "snow.svg",
  602: "snow-heavy.svg",
  611: "overcast-day-sleet.svg",
  612: "overcast-day-sleet.svg",
  613: "snow.svg",
  615: "sleet.svg",
  616: "sleet.svg",
  620: "overcast-sleet.svg",
  621: "extreme-day-snow.svg",
  622: "extreme-snow.svg",

  701: "mist.svg",
  711: "smoke.svg",
  721: "haze.svg",
  731: "dust.svg",
  741: "fog.svg",
  751: "dust.svg",
  761: "dust.svg",
  762: "hurricane.svg",
  771: "wind.svg",
  781: "tornado.svg",

  800: "clear-day.svg",

  801: "partly-cloudy-day.svg",
  802: "cloudy.svg",
  803: "overcast.svg",
  804: "extreme.svg",
};


// access elements
const temperature = document.querySelector(".temperature");
const searchIcon = document.querySelector(".searchIcon");
const mainWeather = document.querySelector(".mainWeather");
const loader = document.querySelector(".loader");
const content1 = document.querySelector(".content1");
const content2 = document.querySelector(".content2");
const content3 = document.querySelector(".content3");
const content4 = document.querySelector(".content4");
const smallLoader1 = document.querySelector(".smallLoader1");
const smallLoader2 = document.querySelector(".smallLoader2");
const smallLoader3 = document.querySelector(".smallLoader3");
const smallLoader4 = document.querySelector(".smallLoader4");

const description = document.getElementById("Wdescription"),
    cityName = document.getElementById("cityName"),
    feelsLike = document.getElementById("feelsLike"),
    maxTemp = document.getElementById("maxTemp"),
    minTemp = document.getElementById("minTemp"),
    countryCode = document.getElementById("countryCode"),
    precipitation = document.getElementById("precipitation"),
    visibility = document.getElementById("visibility"),
    humidity = document.getElementById("humidity"),
    windSpeed = document.getElementById("windSpeed"),
    gusts = document.getElementById("gusts"),
    SRValue = document.getElementById("SRValue"),
    SSValue = document.getElementById("SSValue");

// for default loading action
window.addEventListener("load", () => {
    document.getElementById("cityInput").value = "Kolkata"; // Set default city
    getWeather(); // Fetch weather for Kolkata
    document.getElementById("cityInput").value = "";
});


// search Icon
searchIcon.addEventListener("click", () => {
    getWeather();
});

// Listen for Enter key on input
document.getElementById("cityInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {  // check if Enter was pressed
        getWeather(); // call the function
    }
});

// Function to fetch weather from OpenWeatherMap API
async function getWeather() {
    const city = document.getElementById("cityInput").value;
    const apiKey = "2695e2329926772d89057c9808a3bcb9"; // API key

    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    // Show loader
    mainWeather.classList.add("hidden");
    loader.classList.remove("hidden");
    content1.classList.add("hidden");
    smallLoader1.classList.remove("hidden");
    content2.classList.add("hidden");
    smallLoader2.classList.remove("hidden");
    content3.classList.add("hidden");
    smallLoader3.classList.remove("hidden");
    content4.classList.add("hidden");
    smallLoader4.classList.remove("hidden");

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const OpenMetro = `https://api.open-meteo.com/v1/forecast?`;
    const OpenMetroParamet = `&daily=temperature_2m_max,temperature_2m_min,weather_code,visibility_mean,uv_index_max,precipitation_sum&hourly=rain,temperature_2m,weather_code&current=cloud_cover,temperature_2m,wind_gusts_10m,wind_speed_10m&timezone=auto&forecast_days=14`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found!");
        const data = await response.json();

        weatherData = data;

        //Update city name,country-code temperature, weather icon, description, feels-like
        cityName.innerText = `${data.name},`;
        countryCode.innerText = `${data.sys.country}`;
        // countryCode.innerText = `${data.sys.country}`;

        document.getElementById("weatherIcon").src =`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        //anumated icon id update
        // const iconFile = AnimatedweatherIcons[data.weather[0].id] || "clear-day.svg";
        // animated icon update
        // document.getElementById("weatherIcon").src =`https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/${iconFile}`;

        description.innerText = ` ${data.weather[0].description}`;
        humidity.innerText = `${data.main.humidity}%`;
        windSpeed.innerText = `${Math.round((data.wind.speed) * 10) / 10}`;
        gusts.innerText = `${Math.round((data.wind.gust) * 10) / 10}`;
        SRValue.innerText = convertUnixTo12Hour(data.sys.sunrise, data.timezone);
        SSValue.innerText = convertUnixTo12Hour(data.sys.sunset, data.timezone);


        // fetch 2nd API
        const response2 = await fetch(OpenMetro + `latitude=${data.coord.lat}&longitude=${data.coord.lon}` + OpenMetroParamet);
        if (!response2.ok) throw new Error("City not found!");
        const data2 = await response2.json();

        weatherData2 = data2;

        precipitation.innerText = `${data2.daily.precipitation_sum[0]}mm`;
        visibility.innerText = `${Math.round((data2.daily.visibility_mean[0]) / 1000)}km`;

        tempUpdation();

    } catch (error) {
        alert(error.message);
    } finally {
        // Hide loader after fetching
        mainWeather.classList.remove("hidden");
        loader.classList.add("hidden");
        content1.classList.remove("hidden");
        smallLoader1.classList.add("hidden");
        content2.classList.remove("hidden");
        smallLoader2.classList.add("hidden");
        content3.classList.remove("hidden");
        smallLoader3.classList.add("hidden");
        content4.classList.remove("hidden");
        smallLoader4.classList.add("hidden");
    }
}

function tempUpdation() {
    temperature.innerText = `${Math.round(convertTemp(weatherData.main.temp, currentUnit))}°${currentUnit}`; //math.round for round figure
    feelsLike.innerText = `${Math.round(convertTemp(weatherData.main.feels_like, currentUnit))}°${currentUnit}`;
    // max-min temp update
    maxTemp.innerText = `${Math.round(convertTemp(weatherData2.daily.temperature_2m_max[0], currentUnit)*100)/100}°${currentUnit}`;
    minTemp.innerText = `${Math.round(convertTemp(weatherData2.daily.temperature_2m_min[0], currentUnit)*100)/100}°${currentUnit}`;
    
    updateHourlyForecast(weatherData2.hourly);
    updateDailyForecast(weatherData2.daily);
}

// Function to update clock
function updateClock() {
    const now = new Date(); //Creates a new Date object. This contains the current time and date (based on your computer clock).
    let hours = now.getHours();    // gives 0–23
    let minutes = now.getMinutes(); // gives 0–59
    let ampm = hours >= 12 ? "PM" : "AM";   //If the hour is 12 or more → it's PM, otherwise AM.
    hours = hours % 12; //20 % 12 = 8 → so 20:00 becomes 8 PM.
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;  //If minutes = 7, it changes to "07"
    document.getElementById("time").innerText = `${hours}:${minutes} ${ampm}`; //Create the final time string:

    // Date: "Friday, 4 October 2025"
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const weekday = weekdays[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    document.getElementById("date").innerText = `${weekday}, ${day} ${month} ${year}`;

}

// Update clock every second
setInterval(updateClock, 1000); //1000ms = 1 second
updateClock(); // shows the clock immediately when the page loads

// update time for Sunrise and Sunset
function convertUnixTo12Hour(unixTimestamp, timezoneOffset) {
    // Convert to milliseconds
    let date = new Date((unixTimestamp + timezoneOffset) * 1000);

    // Get hours and minutes
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();

    // Format to 12-hour with AM/PM
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
}

// hourly and daily forecast update

// Simple WMO Weather Code → Icon Map
const weatherIcons = {
    0: "☀️",   // Clear sky
    1: "🌤️",   // Mainly clear
    2: "⛅",    // Partly cloudy
    3: "☁️",    // Overcast

    45: "🌫️",  // Fog
    48: "🌫️",  // Depositing rime fog

    51: "🌦️",  // Drizzle: Light
    53: "🌧️",  // Drizzle: Moderate
    55: "🌧️",  // Drizzle: Dense

    56: "🌧️",  // Freezing drizzle: Light
    57: "🌧️",  // Freezing drizzle: Dense

    61: "🌦️",  // Rain: Slight
    63: "🌧️",  // Rain: Moderate
    65: "🌧️",  // Rain: Heavy

    66: "🌧️",  // Freezing rain: Light
    67: "🌧️",  // Freezing rain: Heavy

    71: "🌨️",  // Snow fall: Slight
    73: "🌨️",  // Snow fall: Moderate
    75: "🌨️",  // Snow fall: Heavy

    77: "❄️",  // Snow grains

    80: "🌦️",  // Rain showers: Slight
    81: "🌧️",  // Rain showers: Moderate
    82: "⛈️",  // Rain showers: Violent

    85: "🌨️",  // Snow showers: Slight
    86: "❄️",  // Snow showers: Heavy

    95: "⛈️",  // Thunderstorm
    96: "⛈️",  // Thunderstorm with slight hail
    99: "⛈️"   // Thunderstorm with heavy hail
};

// Format time to 12h with AM/PM
function formatTime(timeStr) {
    const date = new Date(timeStr);
    let hours = date.getHours();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:00 ${ampm}`;
}

// Format date (dd/mm)
function formatDate(timeStr) {
    const date = new Date(timeStr);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    return `${day}/${month}`;
}

// Day name (Mon, Tue…)
function getDayName(timeStr) {
    const date = new Date(timeStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
}

// Update Hourly Forecast
function updateHourlyForecast(hourly) {
    const container = document.querySelectorAll(".card .scroll-container")[0];
    container.innerHTML = ""; // Clear old


    const now = new Date(); //Creates a new Date object. This contains the current time and date (based on your computer clock).
    let hours = now.getHours();    // gives 0–23
    const hoursToShow = 12; // Show next 12 hours
    // const hoursToShow = (23-hours); // Show next remaining hours today
    for (let i = hours; i <= (hours + hoursToShow); i++) {
        const time = formatTime(hourly.time[i]);
        // console.log(time);
        const temp = Math.round(convertTemp(hourly.temperature_2m[i], currentUnit));
        const icon = weatherIcons[hourly.weather_code[i]] || "❓";

        const div = document.createElement("div");
        div.className = "forecast-item";
        div.innerHTML = `
      <span>${i === hours ? "Now" : time}</span>
      <span class="temp">${temp}°${currentUnit}</span>
      <span>${icon}</span>
    `;
        container.appendChild(div);
    }
}

// Update Daily Forecast (10 days)
function updateDailyForecast(daily) {
    const container = document.querySelectorAll(".card .scroll-container")[1];
    container.innerHTML = ""; // Clear old

    for (let i = 0; i < 10; i++) {
        const day = i === 0 ? "Today" : getDayName(daily.time[i]);
        const date = formatDate(daily.time[i]);
        const temp = `${Math.round(convertTemp((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2, currentUnit))}°${currentUnit}`;
        const icon = weatherIcons[daily.weather_code[i]] || "❓";

        const div = document.createElement("div");
        div.className = "forecast-item";
        div.innerHTML = `
      <span class="day">${day}</span>
      <span class="date">${date}</span>
      <span class="temp">${temp}</span>
      <span>${icon}</span>
    `;
        container.appendChild(div);
    }
}

// Convert Celsius ⇆ Fahrenheit
function convertTemp(temp, unit) {
    return unit === "C" ? temp : (temp * 9) / 5 + 32;
    // if(unit === "C"){
    //     return temp;
    // }
    // else{
    //     calculatedTemp = (temp*9)/5+32;
    //     return (calculatedTemp*10)/10;
    // }
}

// Toggle Button Event
document.getElementById("unitToggle").addEventListener("click", () => {
    currentUnit = currentUnit === "C" ? "F" : "C";
    // document.getElementById("unit-toggle").textContent =
    //   currentUnit === "C" ? "Switch to °F" : "Switch to °C";
    tempUpdation();
});
