(function() {
    function getActiveUrl() {
        // Probably a better way to detect that we're running in our own tab, but this works right now
        if (window.location.href.includes('url=')) {
            return getUrlFromPage();
        } else {
            return getUrlFromPopup();
        }
    }

    function getUrlFromPage() {
        return new Promise(resolve => {
            resolve(/url=(.*)&?/.exec(window.location.href)[1]);
        });
    }

    function getUrlFromPopup() {
        return new Promise(function(resolve, reject) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (chrome.runtime.lastError || !tabs || !tabs.length) {
                    reject();
                } else {
                    resolve(tabs[0].url);
                }
            })
        })
    }

    window.getActiveUrl = getActiveUrl;
})();
