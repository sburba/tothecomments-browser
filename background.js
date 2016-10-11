chrome.browserAction.onClicked.addListener(loadCommentsForTab);

const REDDIT_URL_SEARCH_PREFIX = 'https://www.reddit.com/search.json?sort=comments&q=url:';
const HACKER_NEWS_URL_SEARCH_PREFIX = 'https://hn.algolia.com/api/v1/search?restrictSearchableAttributes=url&query=';

var COMMENT_PROVIDERS = [reddit, hn];

function loadCommentsForTab(tab) {
    Promise.all(COMMENT_PROVIDERS.map(provider => provider(tab.url)))
        .then(urls => urls.forEach(makeTab))
        .catch(() => console.log('Something really bad has happened'));
}

function reddit(url) {
    let search = REDDIT_URL_SEARCH_PREFIX + url;
    return fetch(search)
        .then(getJson)
        .then(getTopRedditLink)
        .catch(() => null);
}

function hn(url) {
    let search = HACKER_NEWS_URL_SEARCH_PREFIX + url;
    return fetch(search)
        .then(getJson)
        .then(getTopHackerNewsLink)
        .catch(() => null);
}

function getTopRedditLink(searchJson) {
    return 'https://reddit.com' + searchJson.data.children[0].data.permalink;
}

function getTopHackerNewsLink(searchJson) {
    return 'https://news.ycombinator.com/item?id=' + searchJson.hits[0].objectID;
}

function makeTab(url) {
    if (url) {
        chrome.tabs.create({
            url: url,
            active: true
        });
    }
}

function getJson(response) {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Unable to make request');
    }
}
