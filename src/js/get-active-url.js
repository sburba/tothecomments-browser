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
        return getActiveTab().then(tab => tab.url);
    }

    window.getActiveUrl = getActiveUrl;
})();
