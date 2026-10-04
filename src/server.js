const http = require('http');
const query = require('querystring');

const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// key:value object to look up URL routes to specific functions
const urlStruct = {
    '/': responseHandler.getIndex,
    '/style.css': responseHandler.getCSS,
    '/getBooks': responseHandler.respondGetBooks,
    '/getBookTitles': responseHandler.respondGetBookTitles,
    '/getBibliography': responseHandler.respondGetBibliography,
    '/getBookCount': responseHandler.respondGetBookTitles, //TODO
    '/addBook': responseHandler.respondAddBook,
    '/deleteBook': responseHandler.respondDeleteBook,
    notFound: responseHandler.respondQuery,
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
        console.log('Content-Type: ' + type);
        console.log('Request body (raw): ' + body);
        if (type === 'application/json') {
            request.body = JSON.parse(body);
            console.log('Request body (parsed): ' + JSON.stringify(request.body));
        }
        else if (type === 'application/x-www-form-urlencoded') {
            request.body = query.parse(body);
            console.log('Request body (parsed): ' + JSON.stringify(request.body));
        }
        else {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({ error: 'invalid data format' }));
            return response.end();
        }
        handler(request, response);
    });
}

// URL-based parsing and handler lookup implementation adopted
//  with no changes from the Accept-Header-Status-Code-Spring-2026 example
const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
    console.log('++++++++URL: ' + parsedUrl.href);

    if (urlStruct[parsedUrl.pathname]) {
        // A known API endpoint found
        if (request.method === 'POST') {
            // POST endpoint - parse the request body and invoke the appropriate handler
            console.log('POST request received for ' + parsedUrl.pathname);
            parseBody(request, response, urlStruct[parsedUrl.pathname]);
        }
        else if ((request.method === 'GET') || (request.method === 'HEAD')) {
            // GET or HEAD endpoint - activate the appropriate handler
            console.log(request.method + ' with query: ' + parsedUrl.pathname + parsedUrl.search);
            // Convert query parameters to a JSON object for the handler
            request.body = Object.fromEntries(parsedUrl.searchParams.entries()); 
            console.log('Request body: ' + JSON.stringify(request.body));
            return urlStruct[parsedUrl.pathname](request, response);
        }
        else {
            console.log('Unsupported method for endpoint: ' + parsedUrl.pathname + parsedUrl.search);
            return urlStruct.notFound(request, response);
        }
    } else {
        console.log('Unknown endpoint requested: ' + parsedUrl.pathname + parsedUrl.search);
        return urlStruct.notFound(request, response);
    }
    
 };

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});