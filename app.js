const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");

const port = 3000;
const app = express();

app.set("view engine", "ejs");

app.use(urlencoded({ extended: true }));
app.use(express.static("public"));

//  ----------------------------------------------------------------------
// setup mongoose schema & create collections

mongoose.connect("mongodb://localhost:27017/wikiDB");
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

// TODO
//  ----------------------------------------------------------------------
// Create "/" Route

app.route("/").get((req, res) => {
  Article.find({}, (err, docs) => {
    res.render("home", { documents: docs });
  });
});

//  ----------------------------------------------------------------------
// Create "/articles" Route

app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        console.log(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

//  ----------------------------------------------------------------------
// Create "/articles/:articleTitle" Route

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found!");
      }
    });
  })
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) {
          res.send("Successfully update the selected article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) =>{
    Article.updateOne(
        { title: req.params.articleTitle },
        { $set: req.body },
        (err) => {
          if (!err) {
            res.send("Successfully updated the article");
          } else {
            res.send(err);
          }
        }
      );
  })
  .delete((req, res) =>{
    Article.deleteOne(
        { title: req.params.articleTitle }
    ).then(() => res.send("Successfully delete the selected article"))
    .catch(() => res.send(err))
  });

//  ----------------------------------------------------------------------
// PORT

app.listen(port, (req, res) => {
  console.log("app is running on port " + port);
});
