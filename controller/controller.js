//Dependencies needed for the controller
var express = require("express");
var router = express.Router();
var path = require("path");
var axios = require("axios");
//Require request and cheerio for SCRAPING
var request = require("request");
var cheerio = require("cheerio");
//Connections to models
var Comment =  require("../models/comment.js");
var Article = require("../models/article.js");
//Routers----First router
router.get("/", function(req, res) {
    res.redirect("/articles");
});
//Next router get request to scrape website
router.get("/scrape", function(req, res) {
    request("https://www.theverge.com", function(err, response, html) {
        //Load info into cheerio and save into selector
        var $ = cheerio.load(html);
        var titlesArray = [];
        //create function to grab every article using a class tag from site
        $(".c-entry-box--compact__title").each(function(i, element) {
            var result = [];
            //add text and href for every link and save as a result
            result.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");
            //adding a condition to check for empties and duplicates and then pushes to results
            if(result.title !== "" && result.link !== "") {
                if(titlesArray.indexOf(result.title) == -1) {
                    titlesArray.push(result.title);
                    Article.count({title: result.title }, function(err, test) {
                        if(test === 0 ) {
                            var entry =  new Article(result);
                            entry.save(function(err, doc) {
                                if(err){
                                    console.log(err)
                                } else {
                                    console.log(doc)
                                }
                            })
                        }
                    })
                } else {
                    console.log("Artilce already exists.")
                }

            } else {
                console.log("Not saved to DB, missing DATA");
            }

        });
        res.redirect("/")        
    });
});
//Articles router
router.get("/articles", function(req, res) {
    Article.find().sort({__id: -1}).exec(function(err, doc) {
        if(err) {
            console.log(err);
        } else {
            var artcl = { article: doc };
            res.render("index", artcl);
        }
    });
});

//Scrape articles into JSON
router.get("/articles-json", function(req, res) {
    Article.find({}, function(err, doc) {
        if(err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});

module.exports = router;