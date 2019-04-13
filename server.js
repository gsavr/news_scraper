const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// scraping tools
const cheerio = require("cheerio");
const axios = require("axios");

//models
//const db = require("./models");

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/gizNews";

mongoose.connect(MONGODB_URI,{useNewUrlParser: true});

// Start the server
app.listen(PORT, () => console.log("App running on port " + PORT));

 // scraped data
 let results = [];
 
//routes
app.get("/scrape", function(req, res) {
  // Axios request
  axios.get("https://www.gizmodo.com").then(function(response) {

  // $ = cheerio commands
  const $ = cheerio.load(response.data);

  // select parts from each article
  $("article").each(function(i, element) {
    const title = $(element).find("h1").text();
    const time = $(element).find("time").attr("datetime");
    const link = $(element).find("a").attr("href");
    const summary = $(element).find("p").text();
    const pic = $(element).find("source").attr("data-srcset");

    results.push({
      title: title,
      time: time,
      link: link,
      summary: summary,
      pic: pic,
    });
    //create new article
    db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  res.send("Scrape Complete");
  /* console.log(results); */
  });
});
