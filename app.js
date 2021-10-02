const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
var u;
const app = express();
app.use(bodyparser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
let today = new Date();
let options = {
  weekday: "long",
  day: "numeric",
  month: "long"
};
let day = today.toLocaleDateString("en-US", options);
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");

});

app.post("/", function(req, res) {
  const query = req.body.cityName;
  const unit = req.body.unit;
  if (unit === "metric") {
    u = "°C";
  } else {
    u = "°F";
  }
  const url = " https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=6f4bfc147531b838bf5a5e08388874b7";

  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const des = weatherData.weather[0].description;
      const temp = weatherData.main.temp + u;
      const ciname = weatherData.name;
      const coname = weatherData.sys.country;
      const icon = weatherData.weather[0].icon;
      const imageurl = " http://openweathermap.org/img/wn/" + icon + "@2x.png";
      const minTemp = weatherData.main.temp_min + u;
      const maxTemp = weatherData.main.temp_max + u;
      res.render("search", {
        ciname: ciname,
        temp: temp,
        imageurl: imageurl,
        coname: coname,
        des: des,
        minTemp: minTemp,
        maxTemp: maxTemp,
        day: day,
      });
      res.sendFile(__dirname + "/views/search.ejs");
    })

  })

})









app.listen(process.env.PORT || 3000, function() {
  console.log("Server starter on port 3000");
})
