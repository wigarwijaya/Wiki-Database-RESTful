const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');

const port = 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(urlencoded({extended: true}))
app.use(express.static('public'));

//  ----------------------------------------------------------------------
// setup mongoose schema & create collections

mongoose.connect('mongodb://localhost:27017/wikiDB');
const { Schema } = mongoose;

const articleSchema = new Schema ({
    title: String,
    content: String
})

const Article = mongoose.model("Article", articleSchema);

// const article1 = new Article ({
//     title:
//     content:
// })

//  ----------------------------------------------------------------------
// TODO

app.get('/', (req, res) => {
    Article.find({}, (err, docs) => {
        res.render('home', { documents: docs });
    })
})

app.get('/articles', (req, res) => {
    Article.find({}, (err, docs) => {
        if(!err){
            res.send(docs)
        } else {
            res.send(err)
        }
    })
})

app.listen(port, (req, res) => {
    console.log("app is running on port " + port);
})


