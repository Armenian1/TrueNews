const   express = require("express"),
        isLoggedIn = require("../middleware/index"),
        getArticles = require("../utils/indexUtility"),
        findSources = require("../utils/sourcesUtility"),
        User = require("../models/user");
        
router = express.Router();

// NEWS ARTICLES
router.get("/", (req, res) => {

    /* Hardcode user to bypass login */
    User.findOne({username: "armen"}, (err, foundUser) => {
        getArticles(foundUser).then(() => {
            User.findOne({_id: foundUser._id}).populate("articles").exec((err, user) => {
                console.log(`There are ${user.articles.length} articles`);
                res.render("index", {articles: user.articles});
            });
        });       
    })

    /* Actual code */
    // getArticles(req.user).then(() => {
    //     User.findOne({_id: req.user._id}).populate("articles").exec((err, user) => {
    //         res.render("index", {articles: user.articles});
    //     });
    // }); 
});

// SOURCES - Choose your sources page
router.get("/sources", (req, res) => {

    /* Hard code login */
    User.findOne({username: "armen"}, (err, foundUser) => {
        findSources().then((response) => {
            let allSources = [];
            response.sources.forEach((source) => {
                allSources.push({id: source.id, name: source.name});
            });
            console.log("Sources");
            console.log(foundUser.sources);
            res.render("sources", {userSources: foundUser.sources, allSources: allSources });
        });
    })
    

    /* Actual code */
    // findSources().then((response) => {
    //     let allSources = [];
    //     response.sources.forEach((source) => {
    //         allSources.push({id: source.id, name: source.name});
    //     });
    //     console.log(allSources);
    //     res.render("sources", {userSources: req.user.sources, allSources: allSources });
    // })


    
    
});

// SOURCES - Post new sources
router.post("/sources", (req, res) => { 

    /* Hard code login */
    User.findOne({username: "armen"}, (err, foundUser) => {
        foundUser.sources = req.body.sources;
        foundUser.save((err, updatedUser) => {
            if (err) {
                console.log(err);
            }
            console.log(`Set ${updatedUser.name}'s sources to ${updatedUser.sources}`)
        });

    });
    res.redirect("/news");





    /* Actual code */
    // if (req.body.sources !== undefined) {                   
    //     if (req.body.sources !== req.user.sources) {            // Need to fix. Check fails if users sources are the same as inputted sources.
    //         req.user.sources = req.body.sources;                // Update users sources
    //         req.user.save((err, updatedUser) => {
    //             if (err) {
    //                 console.log(err);
    //             }
    //             console.log(`Set ${updatedUser.name}'s sources to ${updatedUser.sources}`)
    //         });
    //     }
    // } else {
    //     alert("Please input a source.");
    //     res.redirect("/news/sources"); 

    //     // console.log("Removed all sources from " + req.user.name);  // Remove all sources
    //     // req.user.sources = [];
    //     // req.user.save();
    // }
    // res.redirect("/news");
});

module.exports = router;
