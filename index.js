/**
 * index.js
 * -----------------------------------------------------
 * Vercel Serverless & Static Asset Entrypoint
 * -----------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

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

module.exports = (req, res) => {
    let safeUrl = (req.url || '/').split('?')[0];

    // Map root to index.html
    if (safeUrl === '/' || safeUrl === '') {
        safeUrl = '/index.html';
    }

    // Map favicon.ico request
    if (safeUrl === '/favicon.ico') {
        const icoPath = path.join(__dirname, 'favicon.ico');
        if (fs.existsSync(icoPath)) {
            safeUrl = '/favicon.ico';
        } else {
            safeUrl = '/favicon.svg';
        }
    }

    const filePath = path.join(__dirname, safeUrl);

    // Prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.statusCode = 403;
        res.end('403 Forbidden');
        return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            // Fallback for SPA routing to index.html if file not found
            const indexPath = path.join(__dirname, 'index.html');
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
};
