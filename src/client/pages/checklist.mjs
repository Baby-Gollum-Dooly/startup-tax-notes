/* 설립 체크리스트: 체크 상태 저장과 묶음별 개수 */
import { state, save } from '../store.mjs';

const boxes = [...document.querySelectorAll('.check-list input[data-key]')];

function paintCounts() {
  document.querySelectorAll('.check-group').forEach((sec) => {
    const all = sec.querySelectorAll('input[data-key]');
    const on = sec.querySelectorAll('input[data-key]:checked');
    sec.querySelector('[data-count]').textContent = `${on.length} / ${all.length}`;
  });
}

boxes.forEach((el) => {
  el.checked = !!state.check[el.dataset.key];
  el.addEventListener('change', () => {
    if (el.checked) state.check[el.dataset.key] = true;
    else delete state.check[el.dataset.key];
    save();
    paintCounts();
  });
});

document.getElementById('check-reset').addEventListener('click', () => {
  state.check = {};
  save();
  boxes.forEach((el) => { el.checked = false; });
  paintCounts();
});

paintCounts();
