//Dependencies=======================

var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
//Express=============================
var express = require("express");
var app = express();


app.use(logger("dev"));
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
//Connect app to Public folder============
app.use(express.static(process.cwd() + "/public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("veiw-engine", "handlebars");

//Connect Mongoose=====================
mongoose.connect("mongodb://localhost/news-scraper");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("Connected to Mongoose!")
})

//Connection===========================
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("Listening on PORT: " + PORT)
})
