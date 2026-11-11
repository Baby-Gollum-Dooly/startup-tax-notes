/* 챕터 본문 */
import { esc, chapterUrl } from '../../lib/html.mjs';

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

function sources(c) {
  if (!c.sources.length) return '';
  const items = c.sources.map((s) =>
    `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a></li>`
  ).join('');
  return `<section class="sources"><h2>확인할 곳</h2><ul>${items}</ul></section>`;
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
${c.body}
${sources(c)}
${quiz(c)}
<div class="chapter-foot">
${prevLink}
<button type="button" class="btn primary" id="mark-read">읽음으로 표시</button>
${nextLink}
</div>
</article>`;
}

export function chapterData(c) {
  return JSON.stringify({
    id: c.id,
    quiz: c.quiz.map((q) => ({ answer: q.answer, explain: q.explain }))
  });
}
