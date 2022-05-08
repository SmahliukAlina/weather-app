//Set current Info about city and temp
let apiKey = "f7ab8c50642226d2981457d7445b4fa2";
let unitSys = "metric";
let farenhUnit = "°F";
let celsiusUnit = "°C";

function formateDate(timestamp) {
  let now = new Date(timestamp);
  return `${weekDays[now.getDay()]}, 
  ${months[now.getMonth()]} ${now.getDate()}, 
  ${getTime(now.getHours(), now.getMinutes())}`;
}

function setCelsiusUnit(element) {
  element.innerHTML = celsiusUnit;
}

function setFarenhUnit(element) {
  element.innerHTML = farenhUnit;
}

function getFahrenheitValue(celsiusValue) {
  return Math.round((celsiusValue * 9) / 5 + 32);
}
function getCurrentInfo(response) {
  console.log(response);

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
  fullCurDateElement.innerHTML = formateDate(response.data.dt * 1000);
  curWeathEmojiElement.innerHTML = weatherIcons[response.data.weather[0].icon];
  windElement.innerHTML = Math.round(response.data.wind.speed);

  tempCelsiusValue = Math.round(response.data.main.temp);
  feelsLikeCelsiusValue = Math.round(response.data.main.feels_like);
}

function searchByCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unitSys}&appid=${apiKey}`;
  axios.get(apiUrl).then(getCurrentInfo);
}

function searchByLocation(latitude, longitude) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unitSys}&appid=${apiKey}`;
  axios.get(apiUrl).then(getCurrentInfo);
}

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

function getLocation(position) {
  searchByLocation(
    Math.round(position.coords.latitude),
    Math.round(position.coords.longitude)
  );
}

//Button for searching current position
function currentLocation() {
  navigator.geolocation.getCurrentPosition(getLocation);
}
let currentLocButton = document.querySelector("#cur-loc-btn");
currentLocButton.addEventListener("click", currentLocation);

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

//Change temperature units
let tempCelsiusValue = null;
let feelsLikeCelsiusValue = null;
function changeUnit() {
  let changeUnitBtnElement = document.querySelector("#change-unit-btn");
  let curTempValueElement = document.querySelector("#cur-temp-value");
  let curUnitElement = document.querySelectorAll(".unit");
  let curFeelsLikeTempElement = document.querySelector("#cur-feels-like-temp");

  if (changeUnitBtnElement.value === farenhUnit) {
    changeUnitBtnElement.innerHTML = celsiusUnit;
    curTempValueElement.innerHTML = getFahrenheitValue(tempCelsiusValue);
    curFeelsLikeTempElement.innerHTML = getFahrenheitValue(
      feelsLikeCelsiusValue
    );
    curUnitElement.forEach(setFarenhUnit);
    changeUnitBtnElement.value = celsiusUnit;
  } else {
    changeUnitBtnElement.innerHTML = farenhUnit;
    curTempValueElement.innerHTML = tempCelsiusValue;
    curFeelsLikeTempElement.innerHTML = feelsLikeCelsiusValue;
    curUnitElement.forEach(setCelsiusUnit);
    changeUnitBtnElement.value = farenhUnit;
  }
}

let changeUnitBtnElemen = document.querySelector("#change-unit-btn");
changeUnitBtnElemen.addEventListener("click", changeUnit);

navigator.geolocation.getCurrentPosition(getLocation);
