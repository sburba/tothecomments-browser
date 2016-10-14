chrome.commands.onCommand.addListener(function(command) {
    switch (command) {
        case 'open-top-reddit-link':
            getActiveUrl().then(getComments).then(sections => topLink(sections, 'reddit')).then(makeTab);
            break;
        case 'open-top-hn-link':
            getActiveUrl().then(getComments).then(sections => topLink(sections, 'hn')).then(makeTab);
            break;
    }
});

function topLink(sections, sectionName) {
    return sections.filter(section => section.name === sectionName)[0].comments[0].link;
}

function makeTab(url) {
    chrome.tabs.create({url: url});
}