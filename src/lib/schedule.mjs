/* 세무 기한 계산. 홈과 세무 일정 페이지에서 공통으로 사용 */
import { DEADLINES, HOLIDAYS } from '../content/schedule.mjs';

export { HOLIDAYS };

const DOW = ['일', '월', '화', '수', '목', '금', '토'];

export function pad(n) {
  return (n < 10 ? '0' : '') + n;
}

function isHoliday(dt) {
  const dow = dt.getDay();
  if (dow === 0 || dow === 6) return true;
  const list = HOLIDAYS[dt.getFullYear()];
  return !!(list && list.includes(pad(dt.getMonth() + 1) + '-' + pad(dt.getDate())));
}

/* 기한이 휴일이면 다음 영업일로 */
function nextBusinessDay(dt) {
  const d = new Date(dt.getTime());
  while (isHoliday(d)) d.setDate(d.getDate() + 1);
  return d;
}

function isIncluded(item, opts) {
  if (opts.halfYear && item.repeat === 'monthly' && item.title === '원천세 신고납부') return false;
  if (!opts.halfYear && item.title === '원천세 반기납부') return false;
  if (!opts.freelancer && item.title.startsWith('사업소득 간이지급명세서')) return false;
  return true;
}

export function buildDeadlines(year, opts) {
  const out = [];
  DEADLINES.forEach((item) => {
    if (!isIncluded(item, opts)) return;
    const months = item.month === 0 ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : [item.month];
    months.forEach((m) => {
      const day = item.day === 'end' ? new Date(year, m, 0).getDate() : item.day;
      const ym = year + '-' + pad(m);
      if ((item.from && ym < item.from) || (item.until && ym > item.until)) return;
      const base = new Date(year, m - 1, day);
      const due = nextBusinessDay(base);
      out.push({ date: due, base, shifted: due.getTime() !== base.getTime(), item });
    });
  });
  return out.sort((a, b) => a.date - b.date);
}

export function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function upcoming(count, opts) {
  const t = today();
  const list = buildDeadlines(t.getFullYear(), opts).concat(buildDeadlines(t.getFullYear() + 1, opts));
  return list.filter((x) => x.date >= t).slice(0, count);
}

export function daysLeft(dt) {
  return Math.round((dt - today()) / 86400000);
}

export function fmtDate(dt) {
  return (dt.getMonth() + 1) + '.' + pad(dt.getDate()) + ' ' + DOW[dt.getDay()];
}
