/**
 * server.js
 * -----------------------------------------------------
 * Lightweight static HTTP server for serving the College
 * Department Management System web app locally.
 * -----------------------------------------------------
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let safeUrl = req.url.split('?')[0];
    
    // Handle favicon.ico fallback request to favicon.svg
    if (safeUrl === '/favicon.ico') {
        safeUrl = '/favicon.svg';
    }

    let filePath = path.join(PUBLIC_DIR, safeUrl === '/' ? 'index.html' : safeUrl);

    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end('403 Forbidden');
        return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 Internal Server Error</h1>');
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n=============================================`);
    console.log(`College Management Web App running at:`);
    console.log(`http://localhost:${PORT}/`);
    console.log(`=============================================\n`);
});
