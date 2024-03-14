let ChangeCity = document.querySelector(`.ChangeCity`);
let main = document.querySelector(`main`);
let api = "61346ce96bd2863eceb2f7a9d092c199"; //ключ с опенвеатвер
let test = document.querySelector(".city");

const success = function (data) {
  let lat = data.coords.latitude;
  let lon = data.coords.longitude;
  let tempResult = temp(lat, lon);
  tempResult.then((data) => dataToSite(data));
};

const error = function () {
  console.log(`ERROR`);
    fetch("https://api.ipify.org/?format=json")
    .then((response) => response.json())
    .then((data) => getIp(data))
    .catch(concole.log(`IP not found...`));
};
navigator.geolocation.getCurrentPosition(success, error);

async function temp(lat, lon) {
  const weather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${api}`
  );
  const data = await weather.json();
  return data;
}

async function city(cityName) {
  const geo = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=en&appid=${api}`
  );
  const data = await geo.json();
  if (data.cod === `404`) {
    someError();
  }
  // console.log(data);
  test.innerText = data.name;
  // console.log(data.name);
  // x = data.name;
  dataToSite(data);
}

ChangeCity.addEventListener("click", hideInfo);

function hideInfo(event) {
  main.innerHTML = `
  <input placeholder="Type your city here" type="text" name="city" class='input' />
  <hr />
<button class="find">Find</button>`;
  document.querySelector(".find").addEventListener("click", function () {
    let input = document.querySelector(".input").value;
    console.log(input);
    city(input);
  });
  // cityName == input.value;
}

function dataToSite(data) {
  main.innerHTML = `
  <img src="https://openweathermap.org/img/wn/${
    data.weather[0].icon
  }@2x.png" alt="иконка" />
      <p class="temperature">${Math.round(data.main.temp)}°C</p>
      <p class="wheatherType">
        <span class="type">${
          data.weather[0].main
        }</span> in <span class="city">${data.name}</span>
      </p>
      <button class="ChangeCity">Change city</button>
  `;
  document.querySelector(".ChangeCity").addEventListener("click", hideInfo);
}

function someError() {
  main.innerHTML = `   
<p class="wheatherType">Ooops something went wrong.</p>
<p class="error">Error info</p>
<button class="find">Try again</button>`;
  document.querySelector(".find").addEventListener("click", hideInfo);
}

main.addEventListener("keyup", function (event) {
  if (event.keyCode == 13) {
    let input = document.querySelector(".input").value;
    console.log(input);
    city(input);
  }
});

async function getIp(json) {
  console.log(json);
  let Ip = await fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=at_bu5ot5BJBvGjEB6yeJik6APEdNR08&ipAddress=${json.ip}`
  ).then((res) => res.json());
  let IpCity = Ip.location.region;
  console.log(IpCity);
  city(IpCity);
}
