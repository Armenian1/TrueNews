var mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

var articleSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: function() { return uuidv4() },
    },
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