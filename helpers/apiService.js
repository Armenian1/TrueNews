const newsapi = new NewsAPI(process.env.API_KEY);   // Should not use environment variable in future version.

/***
 * Makes function call to NewsAPI for articles
 */
function getArticles(user) {
    return new Promise((resolve, reject) => {
        newsapi.v2.topHeadlines({
            sources: user.sources,
            pageSize: 20
        }).then(response => {
            console.log("Found " + response.articles.length + " new articles");
            resolve(response.articles);
        }).catch(err => {
            reject("Error in api call for articles");
        });
    });
}

/***
 * Makes function call to NewsAPI
 * to grab one article for each category
 */
function getCategoryArticle(category) {
    return new Promise((resolve, reject) => {
        newsapi.v2.topHeadlines({
            country: 'us',
            category: category,
            pageSize: 1
        }).then(response => {
            console.log("Found new article categories");
            resolve(response.articles);
        }).catch(err => {
            reject("Error in api call for category");
        });
    });
}

module.exports = {getArticles, getCategoryArticle};

