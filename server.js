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
//Require setup handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("veiw-engine", "handlebars");

//Connect to MongoDB
//Connect Mongoose=====================
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/news-scraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }); 

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("Connected to Mongoose!")
});

var routes = require("./controller/controller.js");
app.use("/", routes);

//Connection===========================
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("Listening on PORT: " + PORT)
})
