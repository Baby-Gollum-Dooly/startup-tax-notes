/* 용어사전. 전체 목록을 정적으로 출력하고 검색과 분류 필터만 브라우저에서 처리 */
import { esc, chapterUrl } from '../../lib/html.mjs';
import { termAnchor } from '../../lib/terms.mjs';

export function glossary(site) {
  const byId = new Map(site.chapters.map((c) => [c.id, c]));
  const categories = [...new Set(site.glossary.map((g) => g.category))];
  const terms = [...site.glossary].sort((a, b) => a.term.localeCompare(b.term, 'ko'));

  const filters = ['전체', ...categories].map((c, i) =>
    `<button type="button" data-category="${esc(c)}"${i === 0 ? ' class="active" aria-pressed="true"' : ' aria-pressed="false"'}>${esc(c)}</button>`
  ).join('');

  const rows = terms.map((g) => {
    const ch = byId.get(g.chapter);
    const search = [g.term, g.alias, g.text].join(' ').toLowerCase();
    return `<div id="${termAnchor(g.term)}" data-category="${esc(g.category)}" data-search="${esc(search)}"><dt>${esc(g.term)}` +
      (g.alias ? `<small>${esc(g.alias)}</small>` : '') + `</dt><dd>${esc(g.text)}` +
      (ch ? ` <a href="${chapterUrl(ch.id)}">${ch.no}장에서 보기</a>` : '') +
      (g.source ? `<span class="gloss-src">근거 <a href="${esc(g.source[1])}" target="_blank" rel="noopener">${esc(g.source[0])}</a></span>` : '') + '</dd></div>';
  }).join('\n');

  return `<div class="page">
<h1>용어</h1>
<p class="lead">세무사와 대화하거나 홈택스 화면을 볼 때 자주 나오는 말을 모았습니다. 법령에 근거가 있는 용어는 해당 조문을 함께 달았습니다. 각 장 본문에서 점선 밑줄이 그어진 단어를 누르면 여기 설명이 바로 뜹니다.</p>
<input type="search" class="gloss-search" id="g-q" placeholder="용어나 설명으로 검색" aria-label="용어 검색">
<div class="gloss-filter" id="g-cat">${filters}</div>
<p class="muted" id="g-count">${terms.length}개</p>
<dl class="gloss" id="g-list">
${rows}
</dl>
<p class="muted" id="g-empty" hidden>검색 결과가 없습니다.</p>
</div>`;
}
