/* 모든 페이지 공통: 모바일 목차, 읽음 표시, 좁은 화면용 표 변환 */
import { state } from './store.mjs';

const body = document.body;
const toggle = document.querySelector('.menu-toggle');

function setNav(open) {
  body.classList.toggle('nav-open', open);
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
}

toggle.addEventListener('click', () => setNav(!body.classList.contains('nav-open')));
document.getElementById('scrim').addEventListener('click', () => setNav(false));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && body.classList.contains('nav-open')) setNav(false);
});

/* 사이드바 읽음 표시 */
export function refreshReadMarks() {
  let count = 0;
  document.querySelectorAll('.sidebar a[data-chapter]').forEach((a) => {
    const read = !!state.read[a.dataset.chapter];
    if (read) count++;
    a.querySelector('.done').textContent = read ? '읽음' : '';
  });
  const meta = document.querySelector('[data-read-count]');
  if (meta) meta.textContent = `${count} / ${meta.dataset.total}장 읽음`;
}
refreshReadMarks();

/*
 * 좁은 화면에서 표를 줄 단위로 펼칠 수 있게 칸마다 머리글을 붙인다.
 * 행 병합 표, 분개 표, 숫자 위주의 세 칸 이하 표는 가로 스크롤로 둔다.
 */
function prepareTables(root) {
  root.querySelectorAll('table').forEach((t) => {
    const ths = t.querySelectorAll('thead th');
    if (ths.length < 3 || t.querySelector('[rowspan],[colspan]') || t.classList.contains('journal')) return;
    const numeric = [...ths].filter((th) => th.classList.contains('r')).length;
    if (numeric >= 2 && ths.length < 4) return;
    const labels = [...ths].map((th) => th.textContent.trim());
    t.querySelectorAll('tbody tr').forEach((tr) => {
      [...tr.children].forEach((td, i) => { if (labels[i]) td.setAttribute('data-label', labels[i]); });
    });
    t.classList.add('stack');
  });
}
prepareTables(document.getElementById('main'));
