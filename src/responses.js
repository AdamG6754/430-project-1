const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// const books = JSON.parse(fs.readFileSync(`${__dirname}/../books.json`));

const respond = (request, response, status, content, type) => {
    console.log('status: ' + status);
    console.log('type: ' + type);
    console.log('content: ' + content);
    console.log('content length: ' + Buffer.byteLength(content, 'utf8'));

    response.writeHead(status, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });

    if (request.method !== 'HEAD') {
        response.write(content);
    }
    response.end();
};

const getIndex = (request, response) => {
    respond(request, response, 200, index, 'text/html');
};

const getCSS = (request, response) => {
    respond(request, response, 200, css, 'text/css');
};

/*
const addUser = (request, response) => {
    const { name, age } = request.body;

    const responseJSON = { message: 'Name and age must both be present.' };

    if (!name || !age) {
        responseJSON.id = 'missingParams';
        return respond(request, response, 400, responseJSON, 'application/json');
    }

    let responseCode = 204;

    if (!users[name]) {
        responseCode = 201;
        users[name] = { name: name, };
    }

    users[name].age = age;

    if (responseCode === 201) {
        responseJSON.message = 'Created successfully';
        return respond(request, response, responseCode, JSON.stringify(responseJSON), 'application/json');
    }

    return respond(request, response, responseCode, "", 'application/json');
}
*/

const respondGetBibliography = (request, response) => {
    let content;
    let code;
    let id = '';

    console.log('Request URL: ' + request.url);

    code = 200;
    content = 'getBibliography('+JSON.stringify(request.body)+')';``

    if (request.body.Author === undefined){
        console.log('Missing required parameter: Author');
        content = 'Missing required parameter: Author';
        id = 'missingParameter';
        code = 400;
    }

    let contentJSON = {};

    contentJSON.message = content;
    if (id) {
        contentJSON.id = id;
    }
    
    respond(request, response, code, JSON.stringify(contentJSON), 'application/json');
}

const RespondGetBookTitles = (request, response) => {
    let content;
    let code;
    let id = '';

    console.log('Request URL: ' + request.url);

    code = 200;
    content = 'getBookTitles('+JSON.stringify(request.body)+')';
    for (const [key, value] of Object.entries(request.body)) {
        console.log(key + ': ' + value);
        switch (key) {
            case 'Author':
            case 'Language':
            case  'Genre':
            case 'Earliest Year':
            case 'Latest Year':
                    break;
            default:
                console.log('Get Book Titles - Invalid parameter: ' + key);
                content = 'Invalid parameter: ' + key;
                code = 400;
                id = 'invalidParameter';
                break;
        }
    }

    let contentJSON = {};

    contentJSON.message = content;
    if (id) {
        contentJSON.id = id;
    }
    
    respond(request, response, code, JSON.stringify(contentJSON), 'application/json');
}

const respondGetBooks = (request, response) => {
    let content;
    let code;
    let id = '';

    console.log('Request URL: ' + request.url);

    code = 200;
    content = 'getBooks('+JSON.stringify(request.body)+')';
    for (const [key, value] of Object.entries(request.body)) {
        console.log(key + ': ' + value);
        switch (key) {
            case 'Author':
            case 'Language':
            case  'Genre':
            case 'Earliest Year':
            case 'Latest Year':
                    break;
            default:
                console.log('Get Books - Invalid parameter: ' + key);
                content = 'Invalid parameter: ' + key;
                code = 400;
                id = 'invalidParameter';
                break;
        }
    }

    let contentJSON = {};

    contentJSON.message = content;
    if (id) {
        contentJSON.id = id;
    }
    
    respond(request, response, code, JSON.stringify(contentJSON), 'application/json');
}

const respondAddBook = (request, response) => {
    let content;
    let code;
    let id = '';

    console.log('Request URL: ' + request.url);

    code = 200;
    content = 'addBook('+JSON.stringify(request.body)+')';
    console.log('Request body: ' + JSON.stringify(request.body));
    
    if (request.body.Author === undefined) {
        content = 'Missing required parameter: Author';
        code = 400;
        id = 'missingParameter';
    }
    if (request.body.Language === undefined) {
        content = 'Missing required parameter: Language';
        code = 400;
        id = 'missingParameter';
    }
    if (request.body.Genre === undefined) {
        content = 'Missing required parameter: Genre';
        code = 400;
        id = 'missingParameter';
    }
    if (request.body.Year === undefined) {
        content = 'Missing required parameter: Year';
        code = 400;
        id = 'missingParameter';
    }
    if (request.body.PageCount === undefined) {
        content = 'Missing required parameter: PageCount';
        code = 400;
        id = 'missingParameter';
    }
    if (request.body.Title === undefined) {
        content = 'Missing required parameter: Title';
        code = 400;
        id = 'missingParameter';
    }
    
    let contentJSON = {};

    contentJSON.message = content;
    if (id) {
        contentJSON.id = id;
    }
    
    respond(request, response, code, JSON.stringify(contentJSON), 'application/json');
}

const respondDeleteBook = (request, response) => {
    let content;
    let code;
    let id = '';

    console.log('Request URL: ' + request.url);

    code = 200;
    content = 'deleteBook('+JSON.stringify(request.body)+')';

    if (request.body.Title === undefined){
        console.log('Missing required parameter: Title');
        content = 'Missing required parameter: Title';
        id = 'missingParameter';
        code = 400;
    }

    let contentJSON = {};

    contentJSON.message = content;
    if (id) {
        contentJSON.id = id;
    }
    
    respond(request, response, code, JSON.stringify(contentJSON), 'application/json');
}

module.exports = {
    getIndex,
    getCSS,
    RespondGetBookTitles,
    respondGetBooks,
    respondGetBibliography,
    respondAddBook,
    respondDeleteBook,
};