const express = require("express");
// import fetch from "node-fetch";
const Datastore = require("nedb");
const nodemon = require("nodemon");
const dotenv = require("dotenv").config();

const apiKey = process.env.API_KEY;

const app = express();
const port = 4000;

const database = new Datastore("database.db");
database.loadDatabase();

app.listen(port, () => console.log(`Listening on port ${port}!`));
app.use(express.static("public"));
app.use(express.json({limit: "1mb"}));

app.get("/api", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});
app.post("/api", (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});

// app.get("/weather/:latlon", async (request, response) => {
//   console.log(request.params);
//   const latlon = request.params.latlon.split(",");
//   console.log(latlon);
//   const lat = latlon[0];
//   const lon = latlon[1];
//   console.log(lat, lon);
//   const apiKey = "7db4b276ae57df67954d1fa913759050";
//     const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}`;

//   const fetch_response = await fetch(url);
//   const json = await fetch_response.json();
//   response.json(json);
// });
