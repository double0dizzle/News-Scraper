var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var $ = cheerio.load(html);
var app = express();

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get('/', function(req, res, next){
    res.render('index');
});

app.get('/contact', function(req, res, next){
    res.render('contact');
});

app.listen(3000, function() {
    console.log('app listening on port 3000')
})