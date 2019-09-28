const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    // need to add favorites linked to article
    sources:[String]
});

module.exports = mongoose.model("User", userSchema);