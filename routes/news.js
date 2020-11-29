const   express = require("express"),
        isLoggedIn = require("../middleware/index"),
        getArticles = require("../utils/indexUtility"),
        findSources = require("../utils/sourcesUtility"),
        User = require("../models/user");

        
router = express.Router();

// NEWS ARTICLES
router.get("/", (req, res) => {    


    /* HERE YOU SHOULD RESEARCH HOW TO ADD AN EVENT HANDLER FOR THE ICON */
    // WHY CANT I PASS ARTICLE INTO THE SCRIPT FILE
    User.findOne({username: "armen"}).then(user => {
        User.findOne({_id: user._id}).populate("articles").exec((err, user) => {
            // res.render("index", { articles: user.articles, saveFavorite: (article) => { console.log("hope") }});
            // res.render("index", { articles: user.articles, saveFavorite: () => { console.log("hope") }});
             res.render("index", { articles: user.articles});

                // User.findOneAndUpdate({_id: user.id}, {"favorites": [...user.favorites, article]}, (err, updatedUser) => {
                //     if (err) {
                //         console.log(err);
                //     }
                //     console.log(`Added ${article.title} to ${updatedUser.name}'s favorties`);
                // });
            });
        });
    // });

    // User.findOne({username: "armen"}).then(user => {
    //     User.findOneAndUpdate({_id: user._id}, {name: "armen"}, (err, foundUser) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         console.log("Update works! for" + foundUser.name)
    //     });
    // })

    // User.findOne({username: "armen"}).then(user => {
    //     User.findOne({_id: user._id}).populate("articles").exec((err, user) => {
    //         res.render("index", { articles: user.articles, saveFavorite: (article) => {
               
    //             req.user.updateOne({"favorites": [...req.user.favorites, article]}, (err, updatedUser) => {
    //                 if (err) {
    //                     console.log(err);
    //                 }
    //                 console.log(`Added ${article.title} to ${updatedUser.name}'s favorties`);
    //             })
    //         }});         
    //     });
    // });
        



    // User.findOne({username: "armen"}).then(user => {
    //     getArticles(user).then(() => {
    //         User.findOne({_id: user._id}).populate("articles").exec((err, user) => {
    //             res.render("index", {articles: user.articles});
    //         }); 
    //     });
    // })
    
    
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
router.get("/favorites", isLoggedIn, (req, res) => {
    /* hardcoding user */
    // User.findOne({username: "armen"}).then(foundUser => {
    //     res.render("favorites", {userFavorites: foundUser.favorites});

    // })

    /* actual code */
    User.findOne({_id: req.user._id}).populate("favorites").exec((err, user) => {
        res.render("favorites", {articles: user.favorites});
    });
})

router.post("/favorites", isLoggedIn, (req, res) => {
    req.user.favorites.push(req.body.favorite);
    req.user.save((err, updatedUser) => {
        if (err) {
            console.log(err);
        }
        console.log(`Added ${req.body.favorite.title} to ${updatedUser.name}'s favorties`);
    });
    res.redirect("/news");
})

module.exports = router;
