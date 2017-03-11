(function () {

    function getActiveTab() {
        return new Promise(function(resolve, reject) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (chrome.runtime.lastError || !tabs || !tabs.length) {
                    reject();
                } else {
                    resolve(tabs[0]);
                }
            })
        })
    }

    window.getActiveTab = getActiveTab;
})();