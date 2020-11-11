const newsapi = new NewsAPI(process.env.API_KEY);
function getSources(user) {
    return new Promise((reject, resolve) => {
        newsapi.v2.sources({
            language: 'en',
            country: 'us'
        }).then(response => {
            resolve(response);
        }).catch(err => {
            reject(err);
        });
    });    
}

/***
 * Makes function call to NewsAPI for articles
 */
function getArticles(user) {
    return new Promise((resolve, reject) => {
        newsapi.v2.topHeadlines({
            sources: user.sources
        }).then(response => {
             console.log("Found " + response.totalResults + " new articles");
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
            resolve(response.articles);
        }).catch(err => {
            reject("Error in api call for category");
        });
    });
}

module.exports = {getArticles, getCategoryArticle, getSources};