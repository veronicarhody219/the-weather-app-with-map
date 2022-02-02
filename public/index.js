require("dotenv").config();
let lat, lon;
if ("geolocation" in navigator) {
  console.log("geolocation available");
  navigator.geolocation.getCurrentPosition(async (position) => {
    let lat, long, weather, air;
    try {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      // document.getElementById("latitude").textContent = lat.toFixed(2);
      // document.getElementById("longitude").textContent = lon.toFixed(2);

      const apiKey = process.env.API_KEY;
      const weather_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=${apiKey}`;

      const aq_url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}`;

      const weather_response = await fetch(weather_url);
      const weather_json = await weather_response.json();

      const aq_response = await fetch(aq_url);
      const aq_json = await aq_response.json();

      const data = {
        weather: weather_json,
        air_quality: aq_json,
      };
      weather = weather_json.current;
      document.getElementById("summary").textContent =
        weather.weather[0].description;
      document.getElementById("temperature").textContent =
        weather.temp.toFixed(2);
      document.getElementById("latitude").textContent = lat.toFixed(2);
      document.getElementById("longitude").textContent = lon.toFixed(2);
      console.log(data);

      air = aq_json.results[0].measurements[0];
      document.getElementById("aq_parameter").textContent = air.parameter;
      document.getElementById("aq_value").textContent = air.value;
      document.getElementById("aq_units").textContent = air.unit;
      document.getElementById("aq_date").textContent = air.lastUpdated;
    } catch (error) {
      console.error(error);
      air = {value: -1};
      const show = document.getElementById("show");

      if (error) {
        show.textContent = "No air quality data available";
      }
    }

    const dataFinal = {lat, lon, weather, air};
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataFinal),
    };
    const response = await fetch("/api", options);
    const json = await response.json();
    console.log(json);
  });
} else {
  console.log("geolocation not available");
}
// // Handle button presses, submit data to the database
// const button = document.getElementById("checkin");
// button.addEventListener("click", async (e) => {
//   const data = {lat, lon};
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   };
//   const response = await fetch("/api", options);
//   const json = await response.json();
//   console.log(json);
// });
