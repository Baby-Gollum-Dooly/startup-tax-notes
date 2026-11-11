/* 모든 페이지 공통 틀: 상단 바, 목차 사이드바, 푸터 */
import { esc, NAV, SITE_NAME, SITE_URL, chapterUrl } from '../lib/html.mjs';

const FONT_URL = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700&display=swap';

function topbar(active) {
  const links = NAV.map((n) =>
    `<a href="${n.href}"${n.key === active ? ' class="active" aria-current="page"' : ''}>${n.label}</a>`
  ).join('\n    ');
  return `<header class="topbar">
  <button class="menu-toggle" type="button" aria-label="목차 열기" aria-expanded="false" aria-controls="sidebar">목차</button>
  <a class="brand" href="/">${SITE_NAME}</a>
  <nav class="topnav" aria-label="주요 메뉴">
    ${links}
  </nav>
</header>`;
}

function sidebar(site, activeChapter) {
  const menu = NAV.map((n) => `<li><a href="${n.href}"><span class="no"></span><span>${n.label}</span></a></li>`).join('');
  const groups = site.parts.map((part) => {
    const items = site.chapters.filter((c) => c.part === part).map((c) => {
      const active = c.id === activeChapter;
      return `<li><a href="${chapterUrl(c.id)}" data-chapter="${c.id}"${active ? ' class="active" aria-current="page"' : ''}>` +
        `<span class="no">${c.no}</span><span>${esc(c.title)}</span><span class="done"></span></a></li>`;
    }).join('\n');
    return `<h2>${esc(part)}</h2>\n<ol>\n${items}\n</ol>`;
  }).join('\n');
  return `<aside class="sidebar" id="sidebar" aria-label="목차">
<div class="mobile-nav"><h2>메뉴</h2><ol>${menu}</ol></div>
${groups}
<p class="meta" data-read-count data-total="${site.chapters.length}">${site.chapters.length}장</p>
</aside>`;
}

/**
 * @param {object} p
 * @param {object} p.site       chapters, parts
 * @param {string} p.title      페이지 제목 (사이트 이름 제외)
 * @param {string} p.description
 * @param {string} p.path       정규 주소
 * @param {string} [p.nav]      상단 메뉴 활성 키
 * @param {string} [p.chapter]  활성 챕터 id
 * @param {string} p.content    본문 HTML
 * @param {string} [p.script]   페이지 전용 모듈 이름 (src/client/pages/*.mjs)
 * @param {string} [p.data]     페이지에 넘길 JSON
 */
export function layout(p) {
  const fullTitle = p.title ? `${p.title} | ${SITE_NAME}` : SITE_NAME;
  const pageScript = p.script ? `\n<script type="module" src="/assets/js/client/pages/${p.script}.mjs"></script>` : '';
  const data = p.data ? `\n<script type="application/json" id="page-data">${p.data.replace(/</g, '\\u003c')}</script>` : '';
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${SITE_URL}${p.path === '/' ? '' : p.path}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#f6f5f0" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#171816" media="(prefers-color-scheme: dark)">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONT_URL}">
<link rel="stylesheet" href="/assets/css/site.css">
</head>
<body>
${topbar(p.nav)}

<div class="layout">
${sidebar(p.site, p.chapter)}
<main class="main" id="main" tabindex="-1">
${p.content}
</main>
</div>
<div class="scrim" id="scrim"></div>

<footer class="footer">
  <p>이 사이트의 내용은 일반적인 학습용 정리입니다. 세율과 요건은 매년 바뀌므로 실제 신고 전에는 국세청 홈택스, 국가법령정보센터, 담당 세무사를 통해 확인하세요.</p>
  <p>내용 기준일 2026년 11월. 학습 기록은 이 브라우저에만 저장됩니다.</p>
</footer>
${data}
<script type="module" src="/assets/js/client/common.mjs"></script>${pageScript}
</body>
</html>
`;
}
