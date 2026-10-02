const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const users = {}; //User list

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

const respondJSON = (request, response) => {
    let content;
    let code;

    switch (request.url) {
        case '/getUsers':
            content = JSON.stringify(users)
            code = 200;
            break;

        case '/notReal':
        default:
            let contentJSON = {};

            contentJSON.message = 'The page you are looking for was not found.';
            contentJSON.id = 'notFound';
            content = JSON.stringify(contentJSON);
            code = 404;
            break;
    }

    respond(request, response, code, content, 'application/json');
}


module.exports = {
    getIndex,
    getCSS,
    respondJSON,
    addUser,
};