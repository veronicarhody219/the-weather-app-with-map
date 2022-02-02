const myMap = L.map("map").setView([0, 0], 2);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, {attribution});
tiles.addTo(myMap);
getData();

async function getData() {
  const map_response = await fetch("/api");
  const map_data = await map_response.json();

  for (item of map_data) {
    marker = L.marker([item.lat, item.lon]).addTo(myMap);
    let txt = `The weather at ${item.lat}°,
      ${item.lon}° is ${item.weather.weather[0].description} with a
      temperature of ${item.weather.temp}°C.`;
    if (item.air.value == -1) {
      txt += " No air quality data available.";
    } else {
      txt += `The concentration of particulate matter (${item.air.parameter})
      is ${item.air.value}  ${item.air.unit} last read on
      ${item.air.lastUpdated}`;
    }
    marker.bindPopup(txt);

}
console.log(map_data);
}
