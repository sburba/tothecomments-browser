var COMMENTS_TEMPLATE = `
{{#.}}
    <h1>{{name}}</h1>
    <ul>
    {{#comments}}
        <li><a href="{{link}}" target="_blank" rel="noopener noreferrer">{{title}}</a> </li>
    {{/comments}}
    </ul>
{{/.}}
{{^.}}
    <h1>No comments found :(</h1>
{{/.}}
`;

var ERROR_TEMPLATE = `
    <h1>Error :(</h1>
    
    <p>Something has gone horrendously wrong, and there's nothing you can do about it.</p>
    
    {{#.}}
        <p>You could try googling this I guess:</p>{{.}}
    {{/.}}
`;

function getActiveUrl() {
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

function renderComments(comments) {
    document.getElementById('content').innerHTML = Mustache.render(COMMENTS_TEMPLATE, comments);
}

function showError(err) {
     document.getElementById('content').innerHTML = Mustache.render(ERROR_TEMPLATE, err);
}

getActiveUrl()
    .then(getComments)
    .then(renderComments)
    .catch(showError);
