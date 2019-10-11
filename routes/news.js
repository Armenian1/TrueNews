const   express = require("express"),
        mongoose = require("mongoose"),
        Article = require("../models/article.js");

router = express.Router();

/*=================*/
/* Middleware */
/*=================*/
var isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send("Access denied. You must be logged in");
    }
}


// NEWS ARTICLES
router.get("/", isLoggedIn, (req, res) => {
    Article.find({}, (err, allArticles) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {articles: allArticles});     
        }
    });
});

// SOURCES - Choose your sources page
router.get("/sources", (req, res) => {
    res.render("sources");
});

// SOURCES - Post new sources
router.post("/sources", (req, res) => {   // NEED TO ADD SOME AUTHENTICATION TO MOVE ON TO SOURCES
    User.findOne({username: req.user.username}, (err, foundUser) => {
        console.log(foundUser);
        if (err) {
            console.log(err);
        }
        console.log(foundUser.sources)
        if (foundUser.sources === undefined) {
            foundUser.sources = req.body.sources;
            console.log("Assigning sources to " + req.body.sources);
            foundUser.save((err, updatedUser) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(updatedUser);
                }
            });
        } else {
            for (const source of req.body.sources) {
                if (!foundUser.sources.includes(source)) {
                    foundUser.sources.push(source);
                    console.log("Pushing " + source);
                }
            }
            foundUser.save((err, updatedUser) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(updatedUser);
                }
            });
            console.log(foundUser.sources);
        }
    });
    res.redirect("/news/sources");
});

module.exports = router;
