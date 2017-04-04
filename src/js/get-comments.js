(function() {
    const REDDIT_URL_SEARCH_PREFIX = 'https://www.reddit.com/search.json?sort=comments&limit=5show=all&q=url:';
    const HACKER_NEWS_URL_SEARCH_PREFIX = 'https://hn.algolia.com/api/v1/search?restrictSearchableAttributes=url&hitsPerPage=5&query=';

    const COMMENT_PROVIDERS = [reddit, hn];
    const EXTENSION_VERSION = chrome.runtime.getManifest().version;

    const REQ_CONFIG = {
        headers: {
            'User-Agent': `webextension:io.burba.tothecomments:${EXTENSION_VERSION} (by /u/thisnameistoolon)`
        }
    };

    /**
     * Get the top five comments from hn and reddit
     * @param {String} url
     * @return {Promise.<{name: String, comments: Array.<{title: String, link: String}>}>}
     */
    function getComments(url) {
        return Promise.all(COMMENT_PROVIDERS.map(provider => provider(url)))
            .then(sections => sections.filter(hasComments));
    }

    function hasComments(section) {
        return section && section.comments && section.comments.length;
    }

    function reddit(url) {
        let search = REDDIT_URL_SEARCH_PREFIX + url;
        return fetch(search, REQ_CONFIG)
            .then(getJson)
            .then(redditTopFive)
            .then(topFive => ({name: 'reddit', comments: topFive}))
            .catch(() => null);
    }

    function hn(url) {
        let search = HACKER_NEWS_URL_SEARCH_PREFIX + url;
        return fetch(search, REQ_CONFIG)
            .then(getJson)
            .then(hnTopFive)
            .then(topFive => ({name: 'Hacker News', comments: topFive}))
            .catch(() => null);
    }

    function redditTopFive(searchJson) {
        return searchJson.data.children.map((child) => {
            return {
                title: child.data.title,
                link: 'https://reddit.com' + child.data.permalink,
                subreddit: child.data.subreddit
            }
        }).slice(0, 5);
    }

    function hnTopFive(searchJson) {
        return searchJson.hits.map(hit => {
            return {
                title: hit.title,
                link: 'https://news.ycombinator.com/item?id=' + hit.objectID
            }
        }).slice(0, 5);
    }

    function getJson(response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Unable to make request');
        }
    }

    window.getComments = getComments;
})();
