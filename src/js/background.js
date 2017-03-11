chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case 'open-top-reddit-link':
            getActiveTab().then(tab => showTopLink(tab, 'reddit'));
            break;
        case 'open-top-hn-link':
            getActiveTab().then(tab => showTopLink(tab, 'Hacker News'));
            break;
    }
});

function showTopLink(tab, commentProvider) {
    const fetchTopLink = getComments(tab.url).then(sections => topLink(sections, commentProvider));
    const injectInfoBar = Promise.all([injectScript(tab, 'info-bar'), injectCss(tab, 'info-bar')])
        .then(() => chrome.tabs.sendMessage(tab.id, 'Loading...'));

    Promise.all([fetchTopLink, injectInfoBar])
        .then(args => args[0])
        .then(thru(topLink => sendMessage(tab.id, `Opened ${commentProvider} comments in a background tab`)))
        .then(topLink => chrome.tabs.create({index: tab.index + 1, active: false, url: topLink}))
        .catch(() => sendMessage(tab.id, `No ${commentProvider} comments found`));
}

function injectCss(tab, styleName) {
    return new Promise((resolve, reject) => {
        chrome.tabs.insertCSS(tab.id, {file: `src/css/${styleName}.css`}, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        })
    });
}

function injectScript(tab, scriptName) {
    return new Promise((resolve, reject) => {
        chrome.tabs.executeScript(tab.id, {file: `src/js/${scriptName}.js`}, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}

function sendMessage(tabId, message) {
    chrome.tabs.sendMessage(tabId, message);
}

function topLink(sections, sectionName) {
    return sections.filter(section => section.name === sectionName)[0].comments[0].link;
}
