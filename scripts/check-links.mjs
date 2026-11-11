/*
 * 챕터 출처 링크 점검
 * 모든 출처 주소에 실제로 접속해 응답 코드를 확인한다.
 * 사용: npm run check-links
 */
import { readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFile } from 'node:child_process';
import { devNull } from 'node:os';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'chapters');

/* 쿠키 확인이나 인증서 체인 문제로 Node fetch가 실패하는 기관 사이트는 curl로 한 번 더 확인 */
function curlStatus(url) {
  return new Promise((resolve) => {
    execFile('curl', ['-s', '-L', '-b', '', '-A', 'Mozilla/5.0', '-o', devNull, '-w', '%{http_code}', '--max-time', '30', url],
      (err, stdout) => resolve(err ? 'ERR curl' : Number(stdout)));
  });
}

async function check(url) {
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 link-check' } });
    if (res.status === 200) return 200;
  } catch (err) {
    /* 아래 curl로 재확인 */
  }
  return curlStatus(url);
}

const files = (await readdir(DIR)).filter((f) => f.endsWith('.mjs')).sort();
const targets = new Map();
for (const f of files) {
  const { default: c } = await import(pathToFileURL(join(DIR, f)).href);
  c.sources.forEach((s) => {
    if (!targets.has(s.url)) targets.set(s.url, []);
    targets.get(s.url).push(c.id);
  });
}

let failed = 0;
const urls = [...targets.keys()];
for (let i = 0; i < urls.length; i += 6) {
  const batch = urls.slice(i, i + 6);
  const results = await Promise.all(batch.map(check));
  batch.forEach((url, j) => {
    const ok = results[j] === 200;
    if (!ok) failed++;
    console.log(`${ok ? 'OK ' : 'NG '} ${results[j]}  ${url}  (${targets.get(url).join(', ')})`);
  });
}
console.log(`\n링크 ${urls.length}개 중 실패 ${failed}개`);
process.exit(failed ? 1 : 0);
