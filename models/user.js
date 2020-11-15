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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Article"
        }
    ],
    articles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Article"
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);