var mongoose = require("mongoose");

/*NEED TO MAKE IT SO THAT EACH USER HAS ITS OWN ARTICLES */

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