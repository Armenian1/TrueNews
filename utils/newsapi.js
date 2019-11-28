const newsapi = new NewsAPI(process.env.API_KEY);   // Should not use environment variable in future version.
const Article = require("../models/article");
const User = require("../models/user");

/***
 * Converts passed in hours to epoch time.
 */
function hoursToEpoch(numHours) {
    return numHours * 60 * 60 * 1000; 
}

/***
 * Returns expired articles
 * Returns empty array if none
 */
function findExpiredArticles(user) {
    return new Promise((resolve, reject) => {
        User.findById(user._id).populate("articles").exec((err, populatedUser) => {         /* IS THERE A QUICKER WAY TO POPULATE ARTICLES WITHOUT FINDBYID()? */
            if (err) {
                console.log(err);   
                reject("Error in populating user articles");
            }
            let articles = populatedUser.articles;
            let expiredArticles = articles.filter((article) => {
                return (Date.now() - article.dateCreated > hoursToEpoch(1));        // Determine if article expired based on article age.
            }).map((article) => {
                return article._id;
            });
            console.log(`There are ${expiredArticles.length} expired articles`);
            resolve(expiredArticles);
        });
    });
}

/***
 * Deletes expired articles from Article collection.
 */
function removeExpiredArticles(expiredArticles) {
    return new Promise((resolve, reject) => {  
        Article.deleteMany({_id: expiredArticles}, (err, obj) => {
            if (err) {
                console.log(err);
                reject("Error removing expired articles");
            }
            console.log(`Deleted ${obj.n} articles.`);
            resolve();
        });
    });
}

/***
 * Removes expired articles from user account.
 */
function removeUserArticles(user, expiredArticles) {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate(
            {username: user.username},
            {$pull: {articles: { $in: expiredArticles}}},
            {multi: true},
            (err, obj) => {
                if (err) {
                    console.log(err);
                    reject("Error in removing articles from user account");
                }
                console.log(`Removed ${expiredArticles.length} from user account.`);
                resolve(expiredArticles.length);
            }   
        );
    });
}

/***
 * Makes function call to NewsAPI for articles
 */
function apiGetCall(user) {
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
 * Creates Article documents from article array parameter.
 * Adds created article to specific user account.
 */
function createArticles(articles, user) {
    return new Promise((resolve, reject) => {
        Article.create(articles, (err, newArticles) => {
            if (err) {
                console.log("Error in creating new articles");
                console.log(err);
            }
            newArticles.forEach((article) => {
                user.articles.push(article);
            });
            user.save((err, updatedUser) => {
                if (err) {
                    console.log("Error in saving articles to user");
                    console.log(err);
                }
                console.log("News articles successfully saved");
                resolve();
            });
        });
    });
}

/***
 * Removes all articles from Article collection
 * Also removes all articles from specified user object
 */
function removeAllUserArticles(user) {
    user.articles = [];
    user.save((err) => {
        if (!err) {
            console.log(`Successfully removed all articles from ${user.username}`);
        }
    });
    Article.remove({}, (err) => {
        if (!err) {
            console.log("Successfully removed all articles");
        }
    })
}

/***
 * Executes all functions to update Article list to be shown.
 */
async function getArticles (user) {   
    if (user.articles.length !== 0) {                                           // If user has saved articles
        let expiredArticles = await findExpiredArticles(user);                  // Find articles that have been stored too long.
        if (expiredArticles.length !== 0) {
            removeExpiredArticles(expiredArticles);
            removeUserArticles(user, expiredArticles);
            let newArticles = await apiGetCall(user);
            await createArticles(newArticles, user);
            console.log("Created " + newArticles.length + " new articles");
        }
    } else {
        let newArticles = await apiGetCall(user);
        await createArticles(newArticles, user);
        console.log("Created " + newArticles.length + " new articles");
    } 
}

module.exports = getArticles;