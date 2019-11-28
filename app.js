require('dotenv').config();

const   express         = require("express"),
        app             = express();
        sass            = require("sass"),
        NewsAPI         = require("newsapi"),
        mongoose        = require("mongoose"),
        bodyParser      = require("body-parser"),
        session         = require("express-session"),
        passport        = require("passport"),
        LocalStrategy   = require("passport-local");

const   User            = require("./models/user.js");

const   serverRoutes    = require("./routes/server"),
        newsRoutes      = require("./routes/news");

var result = sass.renderSync({
    file: "app/sass/app.scss",   //Implement fiber for performance gain,
    sourceMap: true,
    outFile: "public/css/style.css"
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//PASSPORT CONFIGURATION
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
    usernameField: "user[username]",
    passwordField: "user[password]"   
}, User.authenticate()));
passport.serializeUser(User.serializeUser( ));
passport.deserializeUser(User.deserializeUser( ));

//CONNECT TO MONGODB
mongoose.connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})  .then(() => {
        console.log("Database connected!");
    })
    .catch(err => {
        console.log(err)
    })

// Global variable definitions
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

// Router declarations
app.use("/", serverRoutes);
app.use("/news", newsRoutes);

app.listen(process.env.PORT, () => {
    console.log("Running on port 3000...")
});