const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    // need to add favorites linked to article
    sources:[String]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);