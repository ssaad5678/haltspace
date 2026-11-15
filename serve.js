// Local preview for halt.ae Workspace.
//   node serve.js   ->  http://localhost:5178
// Serves the app straight from src/ (no build needed), plus the web-app files in public/.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname, PORT = 5178;
const TYPES = { '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };
http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url !== '/' && url !== '/index.html') {
    const f = path.join(ROOT, 'public', path.basename(url));
    if (fs.existsSync(f)) { res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); return res.end(fs.readFileSync(f)); }
    res.writeHead(404); return res.end('Not found');
  }
  const body = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><link rel="icon" href="icon.svg"></head><body>' + fs.readFileSync(path.join(ROOT, 'src', 'halt-workspace.html'), 'utf8') + '</body></html>';
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
  res.end(body);
}).listen(PORT, () => console.log('halt.ae running at http://localhost:' + PORT));
