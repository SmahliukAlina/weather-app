//Set current Info about city and temp
let apiKey = "f7ab8c50642226d2981457d7445b4fa2";
let unitSys = "metric";

function formateDate(timestamp) {
  let now = new Date(timestamp);
  return `${weekDays[now.getDay()]}, 
  ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}, 
  ${getTime(now.getHours(), now.getMinutes())}`;
}

function getTemp(response) {
  console.log(response);

  let cityElement = document.querySelector("#city");
  let curTempElement = document.querySelector("#cur-temp-value");
  let curFeelsLikeTempElement = document.querySelector("#cur-feels-like-temp");
  let weatherDescrElement = document.querySelector("#weather-description");
  let fullCurDateElement = document.querySelector("#cur-date");
  let curWeath = document.querySelector("#cur-weather-emoji");

  cityElement.innerHTML = response.data.name;
  curTempElement.innerHTML = Math.round(response.data.main.temp);
  curFeelsLikeTempElement.innerHTML = Math.round(response.data.main.feels_like);
  weatherDescrElement.innerHTML = response.data.weather[0].description;
  fullCurDateElement.innerHTML = formateDate(response.data.dt * 1000);
  curWeath.innerHTML = weatherIcons[response.data.weather[0].icon];
}

function logPosition(position) {
  let latitude = Math.round(position.coords.latitude);
  let longitude = Math.round(position.coords.longitude);

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unitSys}&appid=${apiKey}`;

  axios.get(apiUrl).then(getTemp);
}

navigator.geolocation.getCurrentPosition(logPosition);

//Button for searching current position
function getCurPos() {
  navigator.geolocation.getCurrentPosition(logPosition);
}
let currentLocButton = document.querySelector("#cur-loc-btn");
currentLocButton.addEventListener("click", getCurPos);

//Set current date
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

function getTime(hour, min) {
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

//Search and Change current city
function changeCity(event) {
  event.preventDefault();

  let searchCityInputElem = document.querySelector("#search-city-input");

  if (searchCityInputElem.value !== "") {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCityInputElem.value}&units=${unitSys}&appid=${apiKey}`;
    axios.get(apiUrl).then(getTemp);

    searchCityInputElem.value = null;
  }
}

let searchFormElement = document.querySelector("#search-form");

searchFormElement.addEventListener("submit", changeCity);

//Change temperature units
let tempCelsiusValue = 22;
let tempFarenhValue = (tempCelsiusValue * 9) / 5 + 32;

function changeUnit() {
  let changeUnitBtnElement = document.querySelector("#change-unit-btn");
  let curTempValueElement = document.querySelector("#cur-temp-value");
  if (changeUnitBtnElement.value === "°F") {
    changeUnitBtnElement.innerHTML = "°C";
    curTempValueElement.innerHTML = `${tempFarenhValue}°F`;
    changeUnitBtnElement.value = "°C";
  } else {
    changeUnitBtnElement.innerHTML = "°F";
    curTempValueElement.innerHTML = `${tempCelsiusValue}°C`;
    changeUnitBtnElement.value = "°F";
  }
}

let changeUnitBtnElemen = document.querySelector("#change-unit-btn");
changeUnitBtnElemen.addEventListener("click", changeUnit);
