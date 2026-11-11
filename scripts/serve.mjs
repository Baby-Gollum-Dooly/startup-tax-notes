/*
 * 로컬 미리보기 서버. Vercel의 cleanUrls와 같은 방식으로 /tools → tools.html을 찾는다.
 * 사용: npm run build && npm start
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT) || 3000;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

async function exists(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const safe = normalize(url).replace(/^(\.\.[/\\])+/, '');
  const candidates = url === '/' ? ['index.html'] : [safe, safe + '.html'];
  for (const c of candidates) {
    const file = join(DIST, c);
    if (file.startsWith(DIST) && await exists(file)) {
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
      res.end(await readFile(file));
      return;
    }
  }
  res.writeHead(404, { 'Content-Type': TYPES['.html'] });
  res.end(await readFile(join(DIST, '404.html')));
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
