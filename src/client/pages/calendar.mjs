/* 세무 일정: 연도와 조건에 따라 월별 목록을 그린다 */
import { state, save, calendarOptions } from '../store.mjs';
import { buildDeadlines, today, fmtDate, pad, HOLIDAYS } from '../../lib/schedule.mjs';
import { esc, chapterUrl } from '../../lib/html.mjs';

const yearSel = document.getElementById('cal-year');
const half = document.getElementById('cal-half');
const free = document.getElementById('cal-free');
const target = document.getElementById('cal-months');

const t = today();
const years = Object.keys(HOLIDAYS).map(Number);
if (!years.includes(t.getFullYear())) {
  yearSel.insertAdjacentHTML('beforeend', `<option value="${t.getFullYear()}">${t.getFullYear()}</option>`);
}
yearSel.value = String(state.cal.year && years.includes(state.cal.year) ? state.cal.year : t.getFullYear());
half.checked = calendarOptions().halfYear;
free.checked = calendarOptions().freelancer;

function render() {
  const year = Number(yearSel.value);
  const list = buildDeadlines(year, calendarOptions());
  const byMonth = Array.from({ length: 12 }, () => []);
  list.forEach((x) => byMonth[x.base.getMonth()].push(x));

  target.innerHTML = byMonth.map((items, m) => {
    const isNow = year === t.getFullYear() && m === t.getMonth();
    const rows = items.map((x) => {
      const shift = x.shifted
        ? `<span class="shift">원래 ${x.base.getMonth() + 1}.${pad(x.base.getDate())}, 휴일로 연기</span>`
        : '';
      return `<li${x.date < t ? ' class="past"' : ''}><span class="d">${fmtDate(x.date)}${shift}</span>` +
        `<span><a href="${chapterUrl(x.item.chapter)}">${esc(x.item.title)}</a> <span class="muted">${esc(x.item.note)}</span></span></li>`;
    }).join('');
    return `<div class="month-block${isNow ? ' now' : ''}"><h3>${m + 1}월${isNow ? ' <span class="tag">이번 달</span>' : ''}</h3><ul>${rows}</ul></div>`;
  }).join('');
}

document.getElementById('cal-form').addEventListener('change', () => {
  state.cal.year = Number(yearSel.value);
  state.cal.halfYear = half.checked;
  state.cal.freelancer = free.checked;
  save();
  render();
});
render();
