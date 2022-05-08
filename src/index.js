//Set current Info about city and temp
let apiKey = "f7ab8c50642226d2981457d7445b4fa2";
let unitSys = "metric";

function getTemp(response) {
  let temp = `${Math.round(response.data.main.temp)}°C`;
  let city = response.data.name;
  let currentCity = document.querySelector("#current-city");
  let currentTemp = document.querySelector("#cur-temp-value");
  currentCity.innerHTML = city;
  currentTemp.innerHTML = temp;
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
let currentLocButton = document.querySelector("#current-location-button");
currentLocButton.addEventListener("click", getCurPos);

//Set current date
let now = new Date();

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

let currentWeekDay = weekDays[now.getDay()];
let currentDate = now.getDate();
let currentMonth = months[now.getMonth()];
let currentYear = now.getFullYear();

let curWeekDay = document.querySelector("#current-weekday");
curWeekDay.innerHTML = `${currentWeekDay}`;
let fullCurrentDate = document.querySelector("#current-date");
fullCurrentDate.innerHTML = `${currentMonth} ${currentDate}, ${currentYear}`;

let currentHour = now.getHours();
let currentMin = now.getMinutes();
let currentTime = document.querySelector("#current-time");

function getTime(hour, min) {
  if (min < 10) {
    return `${hour}:0${min}`;
  } else {
    return `${hour}:${min}`;
  }
}

currentTime.innerHTML = getTime(currentHour, currentMin);

//Search and Change current city
function changeCity(event) {
  event.preventDefault();
  let searchCityInput = document.querySelector("#search-city-input");
  if (searchCityInput.value !== "") {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCityInput.value}&units=${unitSys}&appid=${apiKey}`;
    axios.get(apiUrl).then(getTemp);
    searchCityInput.value = null;
  }
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", changeCity);

//Change temperature units
let tempCelsiusValue = 22;
let tempFarenhValue = (tempCelsiusValue * 9) / 5 + 32;

function changeUnit() {
  let changeUnitButton = document.querySelector("#change-unit-button");
  let currentTempValue = document.querySelector("#cur-temp-value");
  if (changeUnitButton.value === "°F") {
    changeUnitButton.innerHTML = "°C";
    currentTempValue.innerHTML = `${tempFarenhValue}°F`;
    changeUnitButton.value = "°C";
  } else {
    changeUnitButton.innerHTML = "°F";
    currentTempValue.innerHTML = `${tempCelsiusValue}°C`;
    changeUnitButton.value = "°F";
  }
}

let changeUnitButton = document.querySelector("#change-unit-button");
changeUnitButton.addEventListener("click", changeUnit);
