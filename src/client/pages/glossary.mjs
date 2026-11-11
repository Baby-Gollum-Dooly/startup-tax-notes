/* 용어: 검색어와 분류로 목록 걸러 보기 */
const input = document.getElementById('g-q');
const filter = document.getElementById('g-cat');
const rows = [...document.querySelectorAll('#g-list > div')];
const count = document.getElementById('g-count');
const empty = document.getElementById('g-empty');
let category = '전체';

function apply() {
  const q = input.value.trim().toLowerCase();
  let shown = 0;
  rows.forEach((row) => {
    const visible = (category === '전체' || row.dataset.category === category) && (!q || row.dataset.search.includes(q));
    row.hidden = !visible;
    if (visible) shown++;
  });
  count.textContent = shown + '개';
  empty.hidden = shown > 0;
}

input.addEventListener('input', apply);
filter.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  category = b.dataset.category;
  filter.querySelectorAll('button').forEach((x) => {
    x.classList.toggle('active', x === b);
    x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
  });
  apply();
});
