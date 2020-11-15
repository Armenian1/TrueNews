const   express = require("express"),
        isLoggedIn = require("../middleware/index"),
        getArticles = require("../utils/indexUtility"),
        findSources = require("../utils/sourcesUtility"),
        User = require("../models/user");
        
router = express.Router();

// NEWS ARTICLES
router.get("/", (req, res) => {    
    User.findOne({username: "armen"}).then(user => {
        User.findOne({_id: user._id}).populate("articles").exec((err, user) => {
            res.render("index", {articles: user.articles});
        }); 
    });
    
    
    /* Correct way */
    // getArticles(req.user).then(() => {
    //     User.findOne({_id: req.user._id}).populate("articles").exec((err, user) => {
    //         res.render("index", {articles: user.articles});
    //     }); 
    // });
});

// SOURCES - Choose your sources page
router.get("/sources", isLoggedIn, (req, res) => {
    findSources().then((response) => {
        let allSources = [];
        response.sources.forEach((source) => {
            allSources.push({id: source.id, name: source.name});
        });
        res.render("sources", {userSources: req.user.sources, allSources: allSources });
    })
});

// SOURCES - Post new sources
router.post("/sources", isLoggedIn, (req, res) => { 
    if (req.body.sources !== undefined) {                   
        req.user.sources = req.body.sources;                // Update users sources
        req.user.save((err, updatedUser) => {
            if (err) {
                console.log(err);
            }
            console.log(`Set ${updatedUser.name}'s sources to ${updatedUser.sources}`)
        });
    } else {
        alert("Please input a source.");
        res.redirect("/news/sources"); 
    }
    res.redirect("/news");
});

// FAVORITES - Display user favorites
router.get("/favorites", (req, res) => {
    /* hardcoding user */
    User.findOne({username: "armen"}).then(foundUser => {
        res.render("favorites", {userFavorites: foundUser.favorites});

    })

    /* actual code */
    res.render("favorites");
})

module.exports = router;
