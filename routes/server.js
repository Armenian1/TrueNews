const   express     = require("express"),
        passport    = require("passport"),
        User        = require("../models/user.js");

const router = express.Router();

// LANDING PAGE
router.get("/", (req, res) => {
    res.render("landing");
});

/*=================*/
/*Authentication Routes */
/*=================*/

// REGISTER FORM
router.get("/register", (req, res) => {
    res.render("register");
});

// REGISTER POST
router.post("/register", (req, res) => {
    var newUser = new User({
        name: req.body.user["name"],
        email: req.body.user["email"],
        username: req.body.user["username"],
        sources: []
    });
    User.register(newUser, req.body.user["password"], (err, user) => {
        if (err) {
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/news");
        });
    });
});

// LOGIN FORM
router.get("/login", (req, res) => {  
    res.render("login");
});

// LOGIN POST
router.post("/login", 
    passport.authenticate("local", { 
        failureRedirect: "/login",
        successRedirect: "/news"
    }),
);

//LOGOUT
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;