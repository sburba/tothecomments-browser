chrome.browserAction.onClicked.addListener(loadCommentsForTab);

const URL_SEARCH_PREFIX = 'https://www.reddit.com/search.json?sort=comments&q=url:';

/**
 *
 * @param {Tab} tab
 */
function loadCommentsForTab(tab) {
    doSearchForUrl(tab.url)
        .then(getTopLink)
        .then(makeTab)
        .catch(function() {
            console.log('no comments found or reddit search failed');
        });
}

function doSearchForUrl(url) {
    let search = URL_SEARCH_PREFIX + url;
    return window.fetch(search)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Unable to make request');
            }
        });
}

function getTopLink(searchJson) {
    return 'https://reddit.com' + searchJson.data.children[0].data.permalink;
}

function makeTab(url) {
    chrome.tabs.create({
        url: url,
        active: true
    });
}