var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
// var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var port = process.env.PORT || 3000;
// var $ = cheerio.load(html);
var app = express();

var exphbs = require("express-handlebars");

// mongoose.connect("mongodb://localhost/week18Populater", { useNewUrlParser: true }); change the week18populater

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var db = require("./models")

app.get('/', function(req, res, next){
    res.redirect('/articles');
});

// app.get('/contact', function(req, res, next){
//     db.Article.find({})
//       .then(function(dbArticle) {
//         // If we were able to successfully find Articles, send them back to the client
//         // res.json(dbArticle);
//         res.render('index', {articles: dbArticle});
//         // res.render('index');
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
    
// });

app.get('/scrape', function (req, res, next) {
    console.log("\n***********************************\n" +
        "Grabbing every thread name and link\n" +
        "from reddit's webdev board:" +
        "\n***********************************\n");
    request("https://old.reddit.com/r/webdev/", function (error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // An empty array to save the data that we'll scrape
        

        // With cheerio, find each p-tag with the "title" class
        // (i: iterator. element: the current element)
        $("p.title").each(function (i, element) {
            var results = {};
            // Save the text of the element in a "title" variable
            results.title = $(element).text();

            // In the currently selected element, look at its child elements (i.e., its a-tags),
            // then save the values for any "href" attributes that the child elements may have
            results.link = $(element).children().attr("href");

            // Save these results in an object that we'll push into the results array we defined earlier
            db.Article.create(results)
            .then(function(dbArticle) {
              // View the added result in the console
              console.log(dbArticle);
            })
            .catch(function(err) {
              // If an error occurred, send it to the client
              return res.json(err);
              
            });
            console.log(results);
        });
        

        // Log the results once you've looped through each of the elements found with cheerio
        
        res.send('scrape complete');
    });
});

// db.Article.create(result)
//         .then(function(dbArticle) {
//           // View the added result in the console
//           console.log(dbArticle);
//         })
//         .catch(function(err) {
//           // If an error occurred, send it to the client
//           return res.json(err);
//         });
var mongoURL = process.env.MONGODB_URI || "mongodb://localhost/scrape"
mongoose.connect(mongoURL, { useNewUrlParser: true }, function(){
    console.log("Connection Successful")
});


app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        // res.json(dbArticle);
        console.log(dbArticle[0].title)
        res.render('articles', {articles: dbArticle});
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
        
      });
  });


app.get('/contact', function(req, res, next){
    res.render('contact');
});

app.listen(port, function() {
    console.log('app listening on port 3000')
})