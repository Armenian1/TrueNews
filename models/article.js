var mongoose = require("mongoose");

var articleSchema = new mongoose.Schema({
    source: {
        id: String,
        name: String
    },
    author: String,
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: String,
    content: String,
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Article", articleSchema);