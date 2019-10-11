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

const   Article         = require("./models/article.js");
        User            = require("./models/user.js");

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
    useCreateIndex: true
})  .then(() => {
        console.log("Database connected!");
        //getArticles();
    })
    .catch(err => {
        console.log(err)
    })

// Router declarations
app.use("/", serverRoutes);
app.use("/news", newsRoutes);

const newsapi = new NewsAPI(process.env.API_KEY);   // Should not use environment variable in future version.

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

app.listen(process.env.PORT, () => {
    console.log("Running on port 3000...")
});