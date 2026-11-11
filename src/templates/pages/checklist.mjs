/* 설립 체크리스트. 체크 상태만 브라우저에 저장 */
import { esc, chapterUrl } from '../../lib/html.mjs';

export function checklist(site) {
  const byId = new Map(site.chapters.map((c) => [c.id, c]));
  const groups = site.checklist.map((g, gi) => {
    const items = g.items.map((it, ii) => {
      const key = `${gi}-${ii}`;
      const ch = byId.get(it.chapter);
      const sub = (it.note ? esc(it.note) + ' ' : '') + (ch ? `<a href="${chapterUrl(ch.id)}">${ch.no}장</a>` : '');
      return `<li><label><input type="checkbox" data-key="${key}">` +
        `<span><span class="t">${esc(it.text)}</span><span class="sub">${sub}</span></span></label></li>`;
    }).join('\n');
    return `<section class="check-group">
<h2>${esc(g.group)} <span data-count>0 / ${g.items.length}</span></h2>
<ul class="check-list">
${items}
</ul>
</section>`;
  }).join('\n');

  return `<div class="page">
<h1>설립 체크리스트</h1>
<p class="lead">법인 설립 전후와 투자, 해외 진출 때 세무와 관련해 챙길 일입니다. 체크한 내용은 이 브라우저에 저장됩니다.</p>
${groups}
<button type="button" class="btn text" id="check-reset">체크 모두 해제</button>
</div>`;
}
