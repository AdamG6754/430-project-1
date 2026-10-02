const http = require('http');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// key:value object to look up URL routes to specific functions
const urlStruct = {
    '/': responseHandler.getIndex,
    '/style.css': responseHandler.getCSS,
    '/getUsers': responseHandler.respondJSON,
    '/notReal': responseHandler.respondJSON,
    notFound: responseHandler.respondJSON
};

const parseBody = (request, response, handler) => {
    let body = '';

    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        console.log(body + '+' + chunk);
        body += chunk;
    });

    request.on('end', () => {
        const type = request.headers['content-type'];
        if (type === 'application/json') {
            request.body = JSON.parse(body);
        }
        else {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({ error: 'invalid data format' }));
            return response.end();
        }
        responseHandler.addUser(request, response);
    });
}

// URL-based parsing and handler lookup implementation adopted
//  with no changes from the Accept-Header-Status-Code-Spring-2026 example
const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
    console.log('++++++++URL: ' + parsedUrl.href);

    if (request.method === 'POST') {
        if (parsedUrl.pathname === '/addUser') {
            parseBody(request, response, responseHandler.addUser);
        }
    } else {
        if (urlStruct[parsedUrl.pathname]) {
            return urlStruct[parsedUrl.pathname](request, response);
        } else {
            return urlStruct.notFound(request, response);
        }
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});