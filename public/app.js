    // implementing NPM "Expres" into the server
const express = require("express");

    // represents the "Express" module
const app = express();

    // implementing NNM "HTTPS" into the server
const https = require("https");

    // allows the server to look thorught the body of POST REQUEST and fetch its data (the city name)
const bodyParser = require("body-parser");

    // allows Express to use Body Parser
app.use(bodyParser.urlencoded({extended: true}));

    // assigning port value to "3000"
const port = 3000;

app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});

/** 
 * assigning the index.html to the main directory of the server naszego serwera (so, when localhost'll be opened, it'll display the *right weather app, where the user can enter the locality)
 */
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.use(express.static(__dirname + '/public'));

/**
 * allows Node to use static files (np. our CSS or imgs), that are in "static" folder - files that are located in the local host's server
 * dynamic files are such as Bootstrap CSS CDN oraz imgs located as URLs - the files that are possilbe to obtain without having access to to the local host's server
 */
app.use(express.static("public"));

    // captures POST REQUEST of the locality entered by the user
app.post("/", function(req, res) {
        // captures the city name entered by the user (here: req = POST REQIEST sent to the OpenWeatherMap server)
    let query = req.body.cityName;

        // contains the API autenthication key
    const apiAutKey = "9d2d6cd0e7ae05a3d7c95991fadb2385";

        // contains metric system selected by the user
    let unit = "metric";
 
        // conatins call for OpenStreetMap's API
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${unit}&appid=${apiAutKey}`;
 

        // we're forming a our server's GET request to dwnld whole API using "https" NNM; perfoming a GET REQUEST across the internet using the https protocol
    https.get(apiUrl, function(response) {
            // isolates the status code of the get request's response from dwnld API
        console.log(`Status code: ${res.statusCode}`);

            // this anon function contains the locality entered by the user
        response.on("data", function(data) {
                // converting/parsing API's JSON data into a JS obj
            let wholeWeatherData = JSON.parse(data);
 
                // name of the chosen city
            let locationName = wholeWeatherData.name;
 
                // temp. of chosen city
            let temp = wholeWeatherData.main.temp;
 
                // description of the current weather status
            let weatherStatusDescription = wholeWeatherData.weather[0].description;
 
                // grab name of chosen city from API's data
            let iconName = wholeWeatherData.weather[0].icon;
 
                // icon's img of chosen city
            const iconUrl = `http://openweathermap.org/img/wn/${iconName}@2x.png`;
 
                // this will be displayed on the site after the user'll enter the locality name
            res.write(`<p class='redd'>The temperature in ${locationName} equals ${temp}C degrees<p>`);
            res.write(`<h1>The condition of weather is: ${weatherStatusDescription}</h1>`);
            res.write(`<img src=${iconUrl}>`);
            res.end();

            console.log(`The temperature in ${query} is ${temp} degrees and the weather conditions are ${weatherStatusDescription}`);
        })
    })
})