"use strict";

var todayName = document.querySelector("#todayName");
var todayDate = document.querySelector("#todayDate");
var area = document.querySelector("#area");
var todayTemp = document.querySelector("#todayTemp");
var todayImg = document.querySelector("#todayImg");
var todayDesc = document.querySelector("#todayDesc");

var tomorrowName = document.querySelector("#tomorrowName");
var tomorrowImg = document.querySelector("#tomorrowImg");
var tomorrowTempH = document.querySelector("#tomorrowTempH");
var tomorrowTempL = document.querySelector("#tomorrowTempL");
var tomorrowDesc = document.querySelector("#tomorrowDesc");

var thirdName = document.querySelector("#thirdName");
var thirdImg = document.querySelector("#thirdImg");
var thirdTempH = document.querySelector("#thirdTempH");
var thirdTempL = document.querySelector("#thirdTempL");
var thirdDesc = document.querySelector("#thirdDesc");

var locationInput = document.querySelector("#locationInput");

var dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
];

var monthNames = [
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

var allHTML = [
  todayName,
  todayDate,
  area,
  todayTemp,
  todayImg,
  todayDesc,
  tomorrowName,
  tomorrowTempH,
  tomorrowTempL,
  tomorrowDesc,
  tomorrowImg,
  thirdName,
  thirdTempH,
  thirdTempL,
  thirdDesc,
  thirdImg,
];

var currentData = {
  area: "",
  todayName: "",
  tomorrowName: "",
  thirdName: "",
  todayTemp: "",
  tomorrowTempH: "",
  tomorrowTempL: "",
  thirdTempH: "",
  thirdTempL: "",
  todayImg: "",
  tomorrowImg: "",
  thirdImg: "",
  todayDesc: "",
  tomorrowDesc: "",
  thirdDesc: "",
};

function initializeSite() {
  currentData.todayName = dayNames[new Date().getDay()];
  currentData.tomorrowName = dayNames[new Date().getDay() + 1];
  currentData.thirdName = dayNames[new Date().getDay() + 2];
  currentData.todayDate =
    new Date().getDate() + " " + monthNames[new Date().getMonth()];

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (pos) {
      fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${pos.coords.latitude}%2C${pos.coords.longitude}&key=436f2e8208fc416aafcec14c39e7aa1c`
      )
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          apiCall(data.results[0].components.state);
        });
    });
  }
}

function apiCall(city) {
  fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=81b337caf7bc4e6fad2122643241906&q=${city}&days=3`
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      setData(data);
    });
}

function setData(data) {
  currentData.area = data.location.name;
  currentData.todayTemp = data.current.feelslike_c + "°C";
  currentData.tomorrowTempH =
    "Heighest temprature: " + data.forecast.forecastday[1].day.maxtemp_c + "°C";
  currentData.tomorrowTempL =
    "Lowest temprature: " + data.forecast.forecastday[1].day.mintemp_c + "°C";
  currentData.thirdTempH =
    "Heighest temprature: " + data.forecast.forecastday[2].day.maxtemp_c + "°C";
  currentData.thirdTempL =
    "Lowest temprature: " + data.forecast.forecastday[2].day.mintemp_c + "°C";
  currentData.todayImg = data.current.condition.icon;
  currentData.tomorrowImg = data.forecast.forecastday[1].day.condition.icon;
  currentData.thirdImg = data.forecast.forecastday[2].day.condition.icon;
  currentData.todayDesc = data.current.condition.text;
  currentData.tomorrowDesc = data.forecast.forecastday[1].day.condition.text;
  currentData.thirdDesc = data.forecast.forecastday[2].day.condition.text;
  render();
}

function render() {
  allHTML.forEach(function (ele) {
    var temp = ele.getAttribute("id");
    if (temp.search("Img") === -1) {
      ele.innerHTML = " " + currentData[temp];
    } else {
      ele.setAttribute("src", currentData[temp]);
    }
  });
}

initializeSite();

locationInput.addEventListener("input", function (e) {
  if (this.value.length > 2) {
    fetch(
      ` https://api.weatherapi.com/v1/search.json?key=81b337caf7bc4e6fad2122643241906&q=${this.value}`
    )
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        apiCall(data[0].name);
      });
  }
});
