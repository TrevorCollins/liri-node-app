require("dotenv").config();
var Spotify = require("node-spotify-api");
var moment = require("moment");
var axios = require("axios");
var fs = require("fs");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var query = process.argv.slice(3).join(" ");

// =====================================================================================


if (command === "spotify-this-song") {
    spotifyThis();
}else if (command === "concert-this") {
    concertThis();
}else if (command === "movie-this") {
    movieThis();
}else if (command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        command = dataArr[0];
        query = dataArr[1];

        if (command === "spotify-this-song") {
            spotifyThis();
        }else if (command === "concert-this") {
            concertThis();
        }else if (command === "movie-this") {
            movieThis();
        };

    });
}else {
    console.log("Invalid command! Tell me what to do.");
};

// =====================================================================================

function spotifyThis() {
    if (!query) {
        query = "The Sign";
    };
    spotify.search({ type: 'track', query: query, limit: 5 }).then(function (response) {
        var songItem = response.tracks.items;
        console.log("******************************************************");

        for (var i = 0; i < songItem.length; i++) {
            console.log("-----------------------------------------------------");
            
            console.log("\nArtist(s): " + songItem[i].album.artists[0].name);
            console.log("\nSong Name: " + songItem[i].name);
            console.log("\nAlbum:     " + songItem[i].album.name);
            console.log("\nPreview:   " + songItem[i].preview_url + "\n");
            
            console.log("-----------------------------------------------------");
        };

        console.log("******************************************************");

        fs.appendFile("log.txt", songItem, function(err) {
            if (err) {
              console.log(err);
            }else {
              console.log("Content Added!");
            };
          });
          
    }).catch(function (err) {
        console.log(err);
    });
};

// =====================================================================================

function concertThis() {
    axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp").then(
        function (response) {
            var data = response.data[0];
            var date = moment(data.datetime).format('MMM Do YYYY');
            console.log("******************************************************");
            console.log("\nVenue:    " + data.venue.name);
            console.log("\nLocation: " + data.venue.city + ", " + data.venue.region + ", " + data.venue.country);
            console.log("\nDate:     " + date + "\n");
            console.log("******************************************************");

            fs.appendFile("log.txt", data, function(err) {
                if (err) {
                  console.log(err);
                }else {
                  console.log("Content Added!");
                };
              });

        }, function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        }
    );
};

// =====================================================================================

function movieThis() {
    if (!query) {
        query = "Mr. Nobody";
    };
    axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + query).then(
        function (response) {
            var data = response.data;
            console.log("******************************************************");
            console.log("\nTitle:                  " + data.Title);
            console.log("\nYear:                   " + data.Year);
            console.log("\nIMDB Rating:            " + data.Ratings[0].Value);
            console.log("\nRotten Tomatoes Rating: " + data.Ratings[1].Value);
            console.log("\nCountry(s):             " + data.Country);
            console.log("\nLanguage(s):            " + data.Language);
            console.log("\nPlot:                   " + data.Plot);
            console.log("\nActors:                 " + data.Actors + "\n");
            console.log("******************************************************");

            fs.appendFile("log.txt", data, function(err) {
                if (err) {
                  console.log(err);
                }else {
                  console.log("Content Added!");
                };
              });

        }, function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        }
    );
};