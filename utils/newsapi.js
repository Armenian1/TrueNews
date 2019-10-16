const newsapi = new NewsAPI(process.env.API_KEY);   // Should not use environment variable in future version.
const Article = require("../models/article");

function removeAllArticles() {
    return new Promise((resolve, reject) => {
        Article.remove({}, (err) => {
            if (err) {
                reject("Error in removing articles");
            }
            console.log("Removed all articles!")
            resolve();
        });
    });
}

function apiGetCall(user) {
    return new Promise((resolve, reject) => {
        newsapi.v2.topHeadlines({
            sources: user.sources,
            pageSize: 20
        }).then(response => {
            resolve(response.articles);
        }).catch(err => {
            reject("Error in api call for articles");
        })
    });
}

function createArticles(articles) {
    return new Promise((resolve, reject) => {
        let requests = articles.map(article => {
            return new Promise((resolve, reject) => {
                Article.create(article, (err, newArticle) => {
                    if (err) {
                        reject("Error creating article");
                    }
                    resolve();
                });
            });
        });
        Promise.all(requests).then(resolve);
    });
}

async function getArticles (user) {
    await removeAllArticles();
    let articles = await apiGetCall(user);
    await createArticles(articles);
    console.log("Created " + articles.length + " new articles");
}

module.exports = getArticles;