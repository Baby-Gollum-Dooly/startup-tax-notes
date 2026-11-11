/* 챕터 본문 */
import { esc, chapterUrl } from '../../lib/html.mjs';
import { markTerms, termData } from '../../lib/terms.mjs';

const KEYS = ['가', '나', '다', '라', '마'];

function quiz(c) {
  if (!c.quiz.length) return '';
  const items = c.quiz.map((q, i) => {
    const options = q.options.map((o, j) =>
      `<li><button type="button" data-q="${i}" data-o="${j}" data-key="${KEYS[j]}">${esc(o)}</button></li>`
    ).join('');
    return `<div class="q" id="q-${i}"><p class="q-text">${i + 1}. ${esc(q.q)}</p><ul class="q-options">${options}</ul><p class="q-explain" hidden></p></div>`;
  }).join('\n');
  return `<section class="quiz" id="quiz">
<h2>확인 문제</h2>
${items}
<button type="button" class="btn text" id="quiz-reset">문제 다시 풀기</button>
</section>`;
}

/* 본문의 [[n]]을 출처 번호 링크로 바꾼다 */
function linkRefs(body) {
  return body.replace(/\[\[(\d+)\]\]/g, (_, n) => `<sup class="ref"><a href="#src-${n}" aria-label="출처 ${n}">${n}</a></sup>`);
}

function sources(c) {
  if (!c.sources.length) return '';
  const items = c.sources.map((s, i) =>
    `<li id="src-${i + 1}"><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>` +
    (s.note ? ` <span class="muted">${esc(s.note)}</span>` : '') + '</li>'
  ).join('');
  const checked = c.checked ? `<p class="muted">출처 확인일 ${esc(c.checked)}. 법령과 고시는 개정될 수 있으니 링크에서 현재 내용을 확인하세요.</p>` : '';
  return `<section class="sources"><h2>출처</h2><ol>${items}</ol>${checked}</section>`;
}

/* 본문 변환 결과는 데이터 생성에도 쓰므로 한 번만 계산 */
const cache = new Map();
function renderBody(site, c) {
  if (!cache.has(c.id)) cache.set(c.id, markTerms(linkRefs(c.body), site.glossary));
  return cache.get(c.id);
}

export function chapter(site, c) {
  const idx = site.chapters.indexOf(c);
  const prev = site.chapters[idx - 1];
  const next = site.chapters[idx + 1];
  const prevLink = prev
    ? `<a href="${chapterUrl(prev.id)}"><small>이전</small>${prev.no}. ${esc(prev.title)}</a>`
    : '<span></span>';
  const nextLink = next
    ? `<a class="next" href="${chapterUrl(next.id)}"><small>다음</small>${next.no}. ${esc(next.title)}</a>`
    : '<a class="next" href="/"><small>끝</small>학습 현황으로</a>';

  return `<article class="page" data-chapter-id="${c.id}">
<p class="eyebrow">${c.no}장 / ${esc(c.part)} / 읽는 시간 약 ${c.minutes}분</p>
<h1>${esc(c.title)}</h1>
${renderBody(site, c).html}
${sources(c)}
${quiz(c)}
<div class="chapter-foot">
${prevLink}
<button type="button" class="btn primary" id="mark-read">읽음으로 표시</button>
${nextLink}
</div>
</article>`;
}

export function chapterData(site, c) {
  return JSON.stringify({
    id: c.id,
    quiz: c.quiz.map((q) => ({ answer: q.answer, explain: q.explain })),
    terms: termData(site.glossary, renderBody(site, c).used, site.chapters)
  });
}
