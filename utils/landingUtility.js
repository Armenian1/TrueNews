const apiService = require("../helpers/apiService");

const categories = ["business", "entertainment", "general", "health", "science", "sports", "technology"];

function createCategoryMapping(category, article) {
    return {
        categoryName: category.replace(category[0], category[0].toUpperCase()),
        categoryArticle: article
    };
}

function categoryApiCall(category) {
    return new Promise((resolve, reject) => {
        //apiService.getCategoryArticle(category).then((article) => resolve(article[0]));
        apiService.getCategoryArticle(category).then((article) => {
            resolve(createCategoryMapping(category, article[0]));
        });
    });
}

function getCategories () {
    return new Promise((resolve, reject) => {
        var categoryArticles = [];
        categories.map(category => {
            categoryArticles.push(categoryApiCall(category));
        });      
        Promise.all(categoryArticles).then((values) => {
            resolve(values);
        });
    });
}

module.exports = getCategories;



