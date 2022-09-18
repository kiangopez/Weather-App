const currentTimeEl = document.getElementById("current-time");
const city = document.querySelector("[data-city]");
const countryEl = document.querySelector(".country");
const amPm = document.querySelector("[data-am-pm]");
const currentTempEl = document.querySelector("[data-current-temp]");
const currentWeatherIconEl = document.querySelector(
  "[data-current-weather-icon]"
);
const weatherDescriptionEl = document.querySelector(
  "[data-weather-description]"
);
const bottomSectionEl = document.querySelector("[data-bottom-section]");
const futureForecastEl = document.querySelector("[data-future-forecast]");

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const months = [
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

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursin12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  currentTimeEl.innerHTML =
    days[day] +
    ", " +
    date +
    " " +
    months[month] +
    ", " +
    (hoursin12HrFormat < 10 ? "0" + hoursin12HrFormat : hoursin12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    ` <span class="am-pm">${ampm}</span>`;

  //   currentTimeEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=d63d4ce8040cc55ad7737baaf3cbdf73
        `
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

getWeatherData();

function showWeatherData(data) {
  let { country, name, sunrise, sunset } = data.city;
  let { temp, feels_like, humidity, pressure } = data.list[0].main;
  let { description, icon } = data.list[0].weather[0];
  let speed = data.list[0].wind.speed;

  countryEl.append(country);
  city.append(name);
  currentTempEl.append(Math.round(temp));
  currentTempEl.innerHTML = `${Math.round(temp)}&#176;`;
  currentWeatherIconEl.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@4x.png" alt="weather icon"/>`;
  weatherDescriptionEl.append(description);

  bottomSectionEl.innerHTML = `
    <div class="container">
        <div class="wrapper">
            <div>
            <span>SUNRISE</span>
            <p>${window.moment(sunrise * 1000).format("HH:mm a")}</p>
            </div>
            <div>
            <span>SUNSET</span>
            <p>${window.moment(sunset * 1000).format("HH:mm a")}</p>
            </div>
        </div>
        <div class="wrapper">
            <div>
            <span>Feels like</span>
            <p>${feels_like}&#176;</p>
            </div>
            <div>
            <span>HUMIDITY</span>
            <p>${humidity}%</p>
            </div>
        </div>
        <div class="wrapper">
            <div>
            <span>WIND</span>
            <p>${speed} km/h</p>
            </div>
            <div>
            <span>PRESSURE</span>
            <p>${pressure} hPa</p>
            </div>
        </div>
    </div>
    `;

  for (let i = 6; i < data.list.length; i += 8) {
    let icon = data.list[i].weather[0].icon;
    let temp = data.list[i].main.temp;
    // console.log(i);

    const future = document.createElement("div");
    future.className = "wrapper container";
    const mainWeather = document.createElement("div");
    mainWeather.className = "main-weather-info";
    mainImg = document.createElement("img");
    mainImg.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;

    mainWeather.appendChild(mainImg);

    const futForeTemp = document.createElement("div");
    futForeTemp.className = "future-forecast-temp";
    futForeTemp.innerHTML = `${Math.round(temp)}&#176;`;

    mainWeather.appendChild(futForeTemp);

    const otherWeather = document.createElement("div");
    otherWeather.className = "other-weather-info";

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const months = [
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

    otherWeather.innerHTML = `${
      months[parseFloat(data.list[i].dt_txt.slice(5, 7)) - 1]
    } ${data.list[i].dt_txt.slice(8, 10)}

    `;
    // data.list[i].dt_txt
    future.appendChild(mainWeather);
    future.appendChild(otherWeather);

    futureForecastEl.appendChild(future);
  }
}
