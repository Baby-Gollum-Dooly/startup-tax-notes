/*
 * 정적 사이트 빌드
 * src/content의 데이터를 src/templates로 렌더링해 dist/에 페이지별 HTML을 만든다.
 * 외부 패키지 없이 Node 18 이상에서 동작한다.
 */
import { readdir, mkdir, writeFile, readFile, rm, cp } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import parts from '../src/content/parts.mjs';
import glossaryData from '../src/content/glossary.mjs';
import checklistData from '../src/content/checklist.mjs';
import { DEADLINES } from '../src/content/schedule.mjs';
import { layout } from '../src/templates/layout.mjs';
import { home, homeData } from '../src/templates/pages/home.mjs';
import { chapter, chapterData } from '../src/templates/pages/chapter.mjs';
import { calendar } from '../src/templates/pages/calendar.mjs';
import { tools } from '../src/templates/pages/tools.mjs';
import { glossary } from '../src/templates/pages/glossary.mjs';
import { checklist } from '../src/templates/pages/checklist.mjs';
import { notFound } from '../src/templates/pages/not-found.mjs';
import { SITE_URL } from '../src/lib/html.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

/* 스타일은 이 순서대로 합친다. 뒤에 오는 파일이 앞의 규칙을 덮는다 */
const STYLE_ORDER = ['tokens', 'base', 'layout', 'content', 'components', 'pages', 'responsive', 'print'];

/* 브라우저에서 쓰는 모듈. src 안의 상대 경로를 그대로 유지해 복사한다 */
const CLIENT_FILES = ['client', 'lib/html.mjs', 'lib/schedule.mjs', 'lib/calc.mjs', 'lib/terms.mjs', 'content/schedule.mjs'];

async function loadChapters() {
  const dir = join(SRC, 'content', 'chapters');
  const files = (await readdir(dir)).filter((f) => /^\d{2}-[a-z]+\.mjs$/.test(f)).sort();
  const chapters = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(join(dir, file)).href);
    const c = { ...mod.default, no: chapters.length + 1, body: mod.default.body.trim() };
    if (file !== `${String(c.no).padStart(2, '0')}-${c.id}.mjs`) {
      throw new Error(`${file}: 파일 이름과 id 또는 순번이 맞지 않습니다`);
    }
    chapters.push(c);
  }
  return chapters;
}

/* 잘못된 참조는 빌드 단계에서 막는다 */
function validate(site) {
  const ids = new Set(site.chapters.map((c) => c.id));
  const errors = [];
  site.chapters.forEach((c) => {
    if (!parts.includes(c.part)) errors.push(`${c.id}: 목차 묶음 "${c.part}"이 parts.mjs에 없음`);
    c.quiz.forEach((q, i) => {
      if (q.answer < 0 || q.answer >= q.options.length) errors.push(`${c.id}: ${i + 1}번 문제 정답 범위 오류`);
    });
    for (const m of c.body.matchAll(/href="\/chapters\/([a-z]+)"/g)) {
      if (!ids.has(m[1])) errors.push(`${c.id}: 없는 챕터 링크 ${m[1]}`);
    }
    /* 출처 번호 [[n]]은 sources 목록 안에 있어야 하고, 출처는 모두 https 링크여야 한다 */
    for (const m of c.body.matchAll(/\[\[(\d+)\]\]/g)) {
      if (Number(m[1]) < 1 || Number(m[1]) > c.sources.length) errors.push(`${c.id}: 없는 출처 번호 [[${m[1]}]]`);
    }
    c.sources.forEach((s, i) => {
      if (!/^https:\/\//.test(s.url)) errors.push(`${c.id}: ${i + 1}번 출처 주소 형식 오류`);
    });
    const MIDDLE_DOT = String.fromCharCode(0xb7);
    if (c.body.includes(MIDDLE_DOT) || c.title.includes(MIDDLE_DOT)) errors.push(`${c.id}: 가운뎃점 사용`);
  });
  site.glossary.forEach((g) => { if (!ids.has(g.chapter)) errors.push(`용어 ${g.term}: 없는 챕터 ${g.chapter}`); });
  DEADLINES.forEach((d) => { if (!ids.has(d.chapter)) errors.push(`일정 ${d.title}: 없는 챕터 ${d.chapter}`); });
  site.checklist.forEach((g) => g.items.forEach((it) => {
    if (!ids.has(it.chapter)) errors.push(`체크리스트 ${it.text}: 없는 챕터 ${it.chapter}`);
  }));
  if (errors.length) throw new Error('콘텐츠 검사 실패\n' + errors.join('\n'));
}

async function writePage(path, html) {
  const file = join(DIST, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

async function build() {
  const started = Date.now();
  const site = { chapters: await loadChapters(), parts, glossary: glossaryData, checklist: checklistData };
  validate(site);

  await rm(DIST, { recursive: true, force: true });

  const pages = [
    {
      file: 'index.html', path: '/', nav: 'home', title: '',
      description: `법인을 세우고 운영하는 대표가 알아야 할 세무, 회계, 대출, 지분, 투자 관련 내용을 ${site.chapters.length}개 장으로 정리했습니다. 내용마다 공식 출처를 달았습니다.`,
      content: home(site), script: 'home', data: homeData(site)
    },
    { file: 'calendar.html', path: '/calendar', nav: 'calendar', title: '세무 일정', description: '12월 결산 법인 기준 연간 세무 신고 납부 일정', content: calendar(), script: 'calendar' },
    { file: 'tools.html', path: '/tools', nav: 'tools', title: '계산기', description: '4대보험료, 법인세, 부가세, 투자 후 지분율 계산기', content: tools(), script: 'tools' },
    { file: 'glossary.html', path: '/glossary', nav: 'glossary', title: '용어', description: '창업 세무회계 용어 정리', content: glossary(site), script: 'glossary' },
    { file: 'checklist.html', path: '/checklist', nav: 'checklist', title: '설립 체크리스트', description: '법인 설립 전후, 투자 유치, 해외 진출 때 챙길 세무 항목', content: checklist(site), script: 'checklist' },
    { file: '404.html', path: '/404', title: '페이지를 찾을 수 없음', description: '없는 페이지', content: notFound() },
    ...site.chapters.map((c) => ({
      file: `chapters/${c.id}.html`, path: `/chapters/${c.id}`, chapter: c.id,
      title: `${c.no}. ${c.title}`, description: c.summary,
      content: chapter(site, c), script: 'chapter', data: chapterData(site, c)
    }))
  ];

  for (const p of pages) {
    await writePage(p.file, layout({ ...p, site }));
  }

  const css = [];
  for (const name of STYLE_ORDER) {
    css.push(`/* ${name}.css */\n` + await readFile(join(SRC, 'styles', `${name}.css`), 'utf8'));
  }
  await writePage('assets/css/site.css', css.join('\n'));

  for (const rel of CLIENT_FILES) {
    await cp(join(SRC, rel), join(DIST, 'assets', 'js', rel), { recursive: true });
  }

  const sitemap = pages.filter((p) => p.file !== '404.html').map((p) => `  <url><loc>${SITE_URL}${p.path === '/' ? '' : p.path}</loc></url>`).join('\n');
  await writePage('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`);

  console.log(`페이지 ${pages.length}개 생성 (${Date.now() - started}ms) → dist/`);
}

build().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
