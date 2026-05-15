import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname, resolve } from 'path';

const PORT = 5000;
const DIST_DIR = 'dist';
const ABS_DIST = resolve(DIST_DIR);

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
};

const server = createServer((req, res) => {
  // Strip query string and decode URI safely
  let rawPath;
  try {
    rawPath = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }

  let filePath = join(DIST_DIR, rawPath === '/' ? 'index.html' : rawPath);

  // Prevent path traversal — resolved path must stay inside dist/
  const absPath = resolve(filePath);
  if (!absPath.startsWith(ABS_DIST + '/') && absPath !== ABS_DIST) {
    res.writeHead(403, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
    res.end('Forbidden');
    return;
  }

  // SPA fallback: no extension and no matching file → serve index.html
  if (!extname(filePath) && !existsSync(filePath)) {
    filePath = join(DIST_DIR, 'index.html');
  }

  const ext = extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    if (existsSync(filePath)) {
      const content = readFileSync(filePath);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        ...SECURITY_HEADERS,
      });
      res.end(content);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
      res.end('Not Found');
    }
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/`);
});
