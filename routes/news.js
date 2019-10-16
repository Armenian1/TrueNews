const   express = require("express"),
        Article = require("../models/article.js"),
        isLoggedIn = require("../middleware/index"),
        getArticles = require("../utils/newsapi");
        

router = express.Router();

// NEWS ARTICLES
router.get("/", isLoggedIn, (req, res) => {
    User.findOne({username: req.user.username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        }
         getArticles(foundUser).then(() => {
            Article.find({}, (err, allArticles) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render("index", {articles: allArticles});     
                }
            });
         })
    })
    
});

// SOURCES - Choose your sources page
router.get("/sources", isLoggedIn, (req, res) => {
    res.render("sources");
});

// SOURCES - Post new sources
router.post("/sources", isLoggedIn, (req, res) => { 
    User.findOne({username: req.user.username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        }
        if (req.body.sources !== undefined) {
            if (!Array.isArray(req.body.sources)) {
                req.body.sources = [req.body.sources];
            }
            req.body.sources.forEach((source) => {
                if (foundUser.sources.indexOf(source) === -1) {
                    foundUser.sources.push(source);
                    console.log("Pushing " + source);
                }
            });
            foundUser.save((err, updatedUser) => {
                if (err) {
                    console.log(err);
                } 
            });
        } else {        // Else statement for testing purposes.
            console.log("Removed all sources from " + foundUser.name);
            foundUser.sources = [];
            foundUser.save();
        }
    });
    
    res.redirect("/news/sources");
});

module.exports = router;
