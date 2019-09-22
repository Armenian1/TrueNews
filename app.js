const express = require("express");
const sass = require("sass");

var result = sass.renderSync({file: "public/stylesheets/style.scss"})   //Implement fiber for performance gain
console.log(result.css.toString());


const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/news", (req, res) => {
    res.render("show");
});

app.listen(3000, () => {
    console.log("Running on port 3000...")
})