const apiService = require("../helpers/apiService");

async function findSources() {
    return new Promise((reject, resolve) => {
        apiService.getSources().then(sources => {
            resolve(sources);
        }).catch(err => {
            reject(err);
        });
    });  
}

module.exports = findSources
