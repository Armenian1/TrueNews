require('dotenv').config();

const express = require("express");
const sass = require("sass");
const NewsAPI = require("newsapi");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Article = require("./models/article.js");
const User = require("./models/user.js");

var result = sass.renderSync({
    file: "app/sass/app.scss",   //Implement fiber for performance gain,
    sourceMap: true,
    outFile: "public/css/style.css"
});

mongoose.connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})  .then(() => {
        console.log("Database connected!");
        //getArticles();
    })
    .catch(err => {
        console.log(err)
    })

const app = express();
const newsapi = new NewsAPI(process.env.API_KEY);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");



function getArticles() {
    newsapi.v2.everything({
            q: "Trump"
        }).then(response => {
            console.log(response);
            let articles = response.articles;
            for (let i=0; i<20; i++) {
                Article.create({
                    source: articles[i].source,
                    author: articles[i].author,
                    title: articles[i].title,
                    description: articles[i].description,
                    url: articles[i].url,
                    urlToImage: articles[i].urlToImage,
                    publishedAt: articles[i].publishedAt,
                    content: articles[i].content
                }, (err, article) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            console.log("Articles successfully saved to database");
        }).catch(err => {
            console.log(err);
        })
}

// LANDING PAGE
app.get("/", (req, res) => {
    res.render("landing");
});

// NEWS ARTICLES
app.get("/news", (req, res) => {
    Article.find({}, (err, allArticles) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {articles: allArticles});     
        }
    });
});

// SOURCES - Choose your sources page
app.get("/news/sources", (req, res) => {
    res.render("sources");
})

// SOURCES - Post new sources
app.post("/news/sources", (req, res) => {
    console.log(req.body.sources[0]);
    User.find({name: "armen"}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            //foundUser.sources.push(req.body.sources[0]);
            console.log(foundUser.sources);
        }
    })
    res.redirect("/news/sources");
})

/*=================*/
/*Login Routes */
/*=================*/

// REGISTER FORM
app.get("/register", (req, res) => {
    res.render("register");
});

// REGISTER POST
app.post("/register", (req, res) => {
    User.create(req.body.user, (err, newUser) => {
        if (err) {
            console.log(err);
        } else {
            console.log("New user added!")
            res.redirect("/news")
        }
    });    
});

app.listen(process.env.PORT, () => {
    console.log("Running on port 3000...")
});