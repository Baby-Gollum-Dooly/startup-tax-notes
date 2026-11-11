/* 학습 현황: 진행률, 장별 상태, 다가오는 세무 일정 */
import { state, readPageData, calendarOptions } from '../store.mjs';
import { upcoming, daysLeft, fmtDate } from '../../lib/schedule.mjs';
import { esc, chapterUrl } from '../../lib/html.mjs';

/* 예전 주소(#ch-vat, #calendar 같은 해시)로 들어온 경우 새 주소로 이동 */
const legacyHash = location.hash.replace(/^#\/?/, '');
const legacyChapter = legacyHash.match(/^ch[-/]([a-z]+)$/);
if (legacyChapter) location.replace(chapterUrl(legacyChapter[1]));
else if (['calendar', 'tools', 'glossary', 'checklist'].includes(legacyHash)) location.replace('/' + legacyHash);

const { chapters } = readPageData();
const total = chapters.length;
const done = chapters.filter((c) => state.read[c.id]).length;
const pct = Math.round(done / total * 100);

const bar = document.querySelector('.progress-line .bar');
bar.setAttribute('aria-valuenow', String(pct));
bar.firstElementChild.style.width = pct + '%';
document.querySelector('[data-progress-text]').textContent = `${total}장 중 ${done}장 읽음`;

const nextLink = document.querySelector('[data-next-link]');
const next = chapters.find((c) => !state.read[c.id]);
if (next) {
  nextLink.href = chapterUrl(next.id);
  nextLink.textContent = `${done ? '이어서 읽기' : '처음부터 읽기'}: ${next.no}장`;
} else {
  nextLink.replaceWith(Object.assign(document.createElement('span'), { textContent: '모두 읽었습니다.' }));
}

function quizScore(c) {
  const ans = state.quiz[c.id];
  if (!ans) return null;
  let right = 0;
  for (let i = 0; i < c.answers.length; i++) {
    if (ans[i] === undefined) return null;
    if (ans[i] === c.answers[i]) right++;
  }
  return { right, total: c.answers.length };
}

const byId = new Map(chapters.map((c) => [c.id, c]));
document.querySelectorAll('.toc a[data-chapter]').forEach((a) => {
  const c = byId.get(a.dataset.chapter);
  if (!state.read[c.id]) return;
  const q = quizScore(c);
  const st = a.querySelector('.st');
  st.textContent = '읽음' + (q ? `, 퀴즈 ${q.right}/${q.total}` : '');
  st.classList.add('ok');
});

document.getElementById('upcoming').innerHTML = upcoming(6, calendarOptions()).map((x) => {
  const left = daysLeft(x.date);
  return `<li><span class="d">${fmtDate(x.date)}` +
    `<span class="left${left <= 7 ? ' soon' : ''}">${left === 0 ? '오늘' : left + '일 남음'}</span></span>` +
    `<span><a href="${chapterUrl(x.item.chapter)}">${esc(x.item.title)}</a><br><span class="muted">${esc(x.item.note)}</span></span></li>`;
}).join('');
