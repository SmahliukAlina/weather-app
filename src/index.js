//Set current Info about city and temp
let apiKey = "f7ab8c50642226d2981457d7445b4fa2";
let unitSys = "metric";

function getTemp(response) {
  console.log(response);
  let city = response.data.name;
  let temp = `${Math.round(response.data.main.temp)}°C`;
  let feelsLikeTemp = `${Math.round(response.data.main.feels_like)}°C`;

  let cityElement = document.querySelector("#city");
  let curTempElement = document.querySelector("#cur-temp-value");
  let curFeelsLikeTempElement = document.querySelector("#cur-feels-like-temp");

  cityElement.innerHTML = city;
  curTempElement.innerHTML = temp;
  curFeelsLikeTempElement.innerHTML = feelsLikeTemp;
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

function getTime(hour, min) {
  if (min < 10) {
    return `${hour}:0${min}`;
  } else {
    return `${hour}:${min}`;
  }
}

let now = new Date();
let currentWeekDay = weekDays[now.getDay()];
let currentDate = now.getDate();
let currentMonth = months[now.getMonth()];
let currentYear = now.getFullYear();
let currentHour = now.getHours();
let currentMin = now.getMinutes();

let curWeekDayElement = document.querySelector("#cur-weekday");
let fullCurDateElement = document.querySelector("#cur-date");
let currentTime = document.querySelector("#cur-time");

curWeekDayElement.innerHTML = `${currentWeekDay}`;
fullCurDateElement.innerHTML = `${currentMonth} ${currentDate}, ${currentYear}`;
currentTime.innerHTML = getTime(currentHour, currentMin);

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
