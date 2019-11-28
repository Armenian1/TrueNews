const   express = require("express"),
        isLoggedIn = require("../middleware/index"),
        getArticles = require("../utils/newsapi");
        
router = express.Router();

// NEWS ARTICLES
router.get("/", isLoggedIn, (req, res) => {
    getArticles(req.user).then(() => {
        User.findOne({_id: req.user._id}).populate("articles").exec((err, user) => {
            res.render("index", {articles: user.articles});
        });
    }); 
});

// SOURCES - Choose your sources page
router.get("/sources", isLoggedIn, (req, res) => {
    res.render("sources", {userSources: req.user.sources});
});

// SOURCES - Post new sources
router.post("/sources", isLoggedIn, (req, res) => { 
    if (req.body.sources !== undefined) {                   
        if (req.body.sources !== req.user.sources) {            // Need to fix. Check fails if users sources are the same as inputted sources.
            req.user.sources = req.body.sources;                // Update users sources
            req.user.save((err, updatedUser) => {
                if (err) {
                    console.log(err);
                }
                console.log(`Set ${updatedUser.name}'s sources to ${updatedUser.sources}`)
            });
        }
    } else {                                                                  
        console.log("Removed all sources from " + req.user.name);  // Remove all sources
        req.user.sources = [];
        req.user.save();
    }
    res.redirect("/news/sources");
});

module.exports = router;
