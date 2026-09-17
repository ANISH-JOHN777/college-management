/**
 * server.js
 * -----------------------------------------------------
 * Dual-mode entrypoint for local execution and Vercel.
 * Serves index.html, style.css, favicon.ico, favicon.svg, and JS assets.
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
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
};

function handleRequest(req, res) {
    let safeUrl = (req.url || '/').split('?')[0];
    
    if (safeUrl === '/' || safeUrl === '') {
        safeUrl = '/index.html';
    }

    if (safeUrl === '/favicon.ico') {
        const icoPath = path.join(PUBLIC_DIR, 'favicon.ico');
        safeUrl = fs.existsSync(icoPath) ? '/favicon.ico' : '/favicon.svg';
    }

    const filePath = path.join(PUBLIC_DIR, safeUrl);

    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.statusCode = 403;
        res.end('403 Forbidden');
        return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            const indexPath = path.join(PUBLIC_DIR, 'index.html');
            fs.readFile(indexPath, (indexErr, indexContent) => {
                if (indexErr) {
                    res.statusCode = 404;
                    res.end('404 Not Found');
                } else {
                    res.setHeader('Content-Type', 'text/html');
                    res.statusCode = 200;
                    res.end(indexContent);
                }
            });
        } else {
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.statusCode = 200;
            res.end(content);
        }
    });
}

// Export for Vercel Serverless Function Entrypoint
module.exports = handleRequest;

// Run standalone server if started via command line (node server.js)
if (require.main === module) {
    const server = http.createServer(handleRequest);
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/`);
    });
}
