const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    sources:[String],
    favorites: [
        {
            type: String,
            ref: "Article"
        }
    ],
    articles: [
        {
            type: String,
            ref: "Article"
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);