const COMMENTS_TEMPLATE = `
{{#.}}
    <h1>{{name}}</h1>
    <ul>
    {{#comments}}
        <li>{{#subreddit}}<div>/r/{{subreddit}}</div>{{/subreddit}}<a href="{{link}}" target="_blank" rel="noopener noreferrer">{{title}}</a></li>
    {{/comments}}
    </ul>
{{/.}}
{{^.}}
    <h1>No comments found :(</h1>
{{/.}}
`;

const ERROR_TEMPLATE = `
    <h1>Error :(</h1>
    
    <p>Something has gone horrendously wrong, and there's nothing you can do about it.</p>
    
    {{#.}}
        <p>You could try googling this I guess:</p>{{.}}
    {{/.}}
`;

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
