//Global variables
let apiKey = "f7ab8c50642226d2981457d7445b4fa2";
let unitSys = "metric";
let exclude = "current,minutely,hourly,alerts";
let fahrenheitUnit = "°F";
let celsiusUnit = "°C";
let tempCelsiusValue = null;
let feelsLikeCelsiusValue = null;
let weekDays = [
  { short: "Sun", long: "Sunday" },
  { short: "Mon", long: "Monday" },
  { short: "Tue", long: "Tuesday" },
  { short: "Wed", long: "Wednesday" },
  { short: "Thu", long: "Thursday" },
  { short: "Fri", long: "Friday" },
  { short: "Sat", long: "Saturday" },
];
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let weatherIcons = {
  "01d": "☀️",
  "01n": "☀️",
  "02d": "🌤️",
  "02n": "🌤️",
  "03d": "⛅",
  "03n": "⛅",
  "04d": "☁️",
  "04n": "☁️",
  "09d": "🌧️",
  "09n": "🌧️",
  "10d": "🌦️",
  "10n": "🌦️",
  "11d": "⛈️",
  "11n": "⛈️",
  "13d": "🌨️",
  "13n": "🌨️",
  "50d": "🌫️",
  "50n": "🌫️",
};

//Functions formatting dates and time
function formatTime(hour, min) {
  let hours = hour;
  let minutes = min;
  if (hour < 10) {
    hours = `0${hour}`;
  }
  if (min < 10) {
    minutes = `0${min}`;
  }
  return `${hours}:${minutes}`;
}

function formateFullCurDate(timestamp) {
  let now = new Date(timestamp);
  return `${weekDays[now.getDay()].short}, 
  ${months[now.getMonth()]} ${now.getDate()}, 
  ${formatTime(now.getHours(), now.getMinutes())}`;
}

function formatForecastDate(timestamp) {
  let data = new Date(timestamp);
  return `${months[data.getMonth()]} ${data.getDate()}`;
}

function formatForecastDay(timestamp) {
  let data = new Date(timestamp);
  return `${weekDays[data.getDay()].long}`;
}

//Functions setting temperature units
function setCelsiusUnit(element) {
  element.innerHTML = celsiusUnit;
}

function setFahrenheitUnit(element) {
  element.innerHTML = fahrenheitUnit;
}

//Function counting Fahrenheit temp value from Celsius
function getFahrenheitValue(celsiusValue) {
  return Math.round((celsiusValue * 9) / 5 + 32);
}

//Function get by API current Weather and Display it
function displayCurrentWeather(response) {
  console.log(response);

  tempCelsiusValue = Math.round(response.data.main.temp);
  feelsLikeCelsiusValue = Math.round(response.data.main.feels_like);

  let cityElement = document.querySelector("#city");
  let curTempElement = document.querySelector("#cur-temp-value");
  let curUnitElement = document.querySelectorAll(".unit");
  let curFeelsLikeTempElement = document.querySelector("#cur-feels-like-temp");
  let weatherDescrElement = document.querySelector("#weather-description");
  let fullCurDateElement = document.querySelector("#cur-date");
  let curWeathEmojiElement = document.querySelector("#cur-weather-emoji");
  let windElement = document.querySelector("#wind");

  cityElement.innerHTML = response.data.name;
  curTempElement.innerHTML = Math.round(response.data.main.temp);
  curUnitElement.forEach(setCelsiusUnit);
  curFeelsLikeTempElement.innerHTML = Math.round(response.data.main.feels_like);
  weatherDescrElement.innerHTML = response.data.weather[0].description;
  fullCurDateElement.innerHTML = formateFullCurDate(response.data.dt * 1000);
  curWeathEmojiElement.innerHTML = weatherIcons[response.data.weather[0].icon];
  windElement.innerHTML = Math.round(response.data.wind.speed);

  searchForecast(response.data.coord.lat, response.data.coord.lon);
}

//Function return HTML for each day of forecast
function getDailyForecast(dayForecast) {
  return `<div class="row">
                  <div class="col-5 weekday" id="weekday">
                    <div class="day" id="day">${formatForecastDay(
                      dayForecast.dt * 1000
                    )}</div>
                    <div class="date" id="date">${formatForecastDate(
                      dayForecast.dt * 1000
                    )}</div>
                  </div>
                  <div class="col-4 temperature">
                    <span class="temp-value" id="max-temperature">${Math.round(
                      dayForecast.temp.max
                    )}</span><span class="unit">${celsiusUnit}</span>/
                    <span class="temp-value" id="min-temperature">${Math.round(
                      dayForecast.temp.min
                    )}</span><span class="unit">${celsiusUnit}</span>
                  </div>
                  <div class="col-3 weather-emoji" id="weather-emoji">${
                    weatherIcons[dayForecast.weather[0].icon]
                  }</div>
                </div>`;
}

//Function get by API Forecast Weather and Display it
function displayForecast(response) {
  console.log(response.data);

  let forecastElement = document.querySelector("#forecast");

  let forecastDays = response.data.daily;
  let forecastHTML = "";
  for (let i = 1; i < 6; i++) {
    forecastHTML = forecastHTML + getDailyForecast(forecastDays[i]);
  }

  forecastElement.innerHTML = forecastHTML;
}

//Functions with API requests with corresponding parameters
function searchByCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unitSys}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayCurrentWeather);
}

function searchByLocation(latitude, longitude) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unitSys}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayCurrentWeather);
}

function searchForecast(lat, lon) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${unitSys}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

//Search engine
function submitForm(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  if (cityInputElement.value !== "") {
    searchByCity(cityInputElement.value);
    cityInputElement.value = null;
  }
}

let searchFormElement = document.querySelector("#search");
searchFormElement.addEventListener("submit", submitForm);

//Button for searching current position
function currentLocation() {
  navigator.geolocation.getCurrentPosition(getLocation);
}

let currentLocButton = document.querySelector("#cur-loc-btn");
currentLocButton.addEventListener("click", currentLocation);

//Change temperature units
function changeUnit() {
  let changeUnitBtnElement = document.querySelector("#change-unit-btn");
  let curTempValueElement = document.querySelector("#cur-temp-value");
  let curUnitElement = document.querySelectorAll(".unit");
  let curFeelsLikeTempElement = document.querySelector("#cur-feels-like-temp");

  if (changeUnitBtnElement.value === fahrenheitUnit) {
    changeUnitBtnElement.innerHTML = celsiusUnit;
    curTempValueElement.innerHTML = getFahrenheitValue(tempCelsiusValue);
    curFeelsLikeTempElement.innerHTML = getFahrenheitValue(
      feelsLikeCelsiusValue
    );
    curUnitElement.forEach(setFahrenheitUnit);
    changeUnitBtnElement.value = celsiusUnit;
  } else {
    changeUnitBtnElement.innerHTML = fahrenheitUnit;
    curTempValueElement.innerHTML = tempCelsiusValue;
    curFeelsLikeTempElement.innerHTML = feelsLikeCelsiusValue;
    curUnitElement.forEach(setCelsiusUnit);
    changeUnitBtnElement.value = fahrenheitUnit;
  }
}

let changeUnitBtnElement = document.querySelector("#change-unit-btn");
changeUnitBtnElement.addEventListener("click", changeUnit);

//Setting data by current location
function getLocation(position) {
  searchByLocation(
    Math.round(position.coords.latitude),
    Math.round(position.coords.longitude)
  );
}

navigator.geolocation.getCurrentPosition(getLocation);
