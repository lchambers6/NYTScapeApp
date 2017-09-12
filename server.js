var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

var exphbs = require('express-handlebars');
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get('/', function (req, res) {
  Article.find({}, function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      res.render('index', { Article: data });
    }
  });
});

mongoose.connect("mongodb://localhost/week18day3mongoose");
var db = mongoose.connection;

db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function () {
  console.log("Mongoose connection successful.");
});


app.get("/scrape", function (req, res) {
  request("https://www.nytimes.com/", function (error, response, html) {
    var $ = cheerio.load(html);
    Article.remove({ saved: false }, function (err, row) {
      if (err) {
        console.log("Collection couldn't be removed" + err);
        return;
      }
      console.log("collection removed");
    })

    $("h2.story-heading").each(function (i, element) {
      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.saved = false;

      var entry = new Article(result);

      entry.save(function (err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });
    });
    res.redirect("/");
  });
});

app.get("/clear", function (req, res) {
  Article.remove({}, function (err, row) {
    if (err) {
      console.log("Collection couldn't be removed" + err);
      return;
    }
    console.log("collection removed");
  })
  res.redirect("/");
});

app.get("/articles", function (req, res) {
  Article.find({}, function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(data);
    }
  });
});

app.get('/saved', function (req, res) {
  Article.find({ saved: true }, function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      res.render('saved', { Article: data });
    }
  });
});

app.post("/saved/:id", function (req, res) {
  Article.update({ _id: req.params.id }, { $set: { saved: true } }, function (err, row) {
    if (err) {
      console.log("Article couldn't be saved" + err);
      return;
    }
    console.log("Article saved");
  })
});

app.post("/saved/:id/delete", function (req, res) {
  Article.update({ _id: req.params.id }, { $set: { saved: false } }, function (err, row) {
    if (err) {
      console.log("Article couldn't be saved" + err);
      return;
    }
    console.log("Article saved");
  })
});

app.get("/articles/:id", function (req, res) {
  Article.find({ _id: req.params.id })
    .populate("notes")
    .exec(function (error, doc) {
      if (error) {
        res.send(error);
      }
      else {
        res.render('saved', { Article: doc });
      }
    });
});

app.post("/articles/:id", function (req, res) {
  var newNote = new Note(req.body);
  newNote.save(function (error, doc) {
    console.log(doc);
    if (error) {
      res.send(error);
    }
    else {
      Article.findOneAndUpdate({ _id: req.params.id }, { $push: { "notes": doc._id } }, { new: true }, function (err, newdoc) {
        if (err) {
          console.log("Note couldn't be added" + err);
          return;
        }
        console.log("Note saved");
        res.redirect("/");
      });
    }
  });
});

app.listen(3000, function () {
  console.log("App running on port 3000!");
});
