const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// scraping tools
const cheerio = require("cheerio");
const axios = require("axios");

//models
const db = require("./models");

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
app.delete("/",function(req,res){
  //delete old articles
  db.Article.deleteMany({"saved": false})
  .then(function(){
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  })
});

app.get("/scrape", function(req, res) {
  // Axios request
  axios.get("https://www.gizmodo.com").then(function(response){
  // $ = cheerio commands
  const $ = cheerio.load(response.data);
  // select parts from each article
  $("article").each(function(i, element) {
    const title = $(element).find("h1").text();
    const time = $(element).find("time").attr("datetime");
    const link = $(element).find("h1").find("a").attr("href");
    const summary = $(element).find("p").text();
    const pic = $(element).find("source").attr("data-srcset")||"assets/images/blog.gif";
    
    results.push({
      title: title,
      time: time,
      link: link,
      summary: summary,
      pic: pic,
    });
    //create new article
    db.Article.create(results)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
    db.Article.find({}).sort({time:'desc'})
    .then(function(dbArticle){
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  /* console.log(results); */
  });
});

// Route for saving/updating an Article
app.post("/saved/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Article.update({"_id":req.params.id}, {$set: {"saved": true}})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/saved", function(req,res){
  db.Article.find({"saved":true}).sort({time:'asc'})
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});

//update article to read and remove
app.post("/read/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Article.update({"_id":req.params.id }, {$set: {"saved": false}})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/article/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then((dbNote) => db.Article.update({"_id":req.params.id },{$set:{ note: dbNote._id}}))
    .then((dbArticle) => {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/article/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
    db.Article.find({"_id":req.params.id}).populate("note")
    .then((dbArticle) => {
      res.json(dbArticle);
      //console.log(dbArticle[0].note.body)
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    }); 
});

app.delete("/deletenote/:id", function(req, res) {
  // Remove Note the req.body to the entry
  db.Note.findByIdAndRemove(req.params.id)
    .then(function(dbNote) {
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for Delete an Article -- not implemented
app.delete("/delete/:id", function(req, res) {
  // Remove Article the req.body to the entry
  db.Article.findByIdAndRemove(req.params.id)
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
