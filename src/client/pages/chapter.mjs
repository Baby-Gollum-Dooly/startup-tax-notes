/* 챕터: 읽음 표시와 확인 문제 */
import { state, save, readPageData } from '../store.mjs';
import { refreshReadMarks } from '../common.mjs';
import { esc } from '../../lib/html.mjs';
import { initTerms } from '../terms.mjs';

const KEYS = ['가', '나', '다', '라', '마'];
const data = readPageData();
const id = data.id;

/* 읽음 표시 */
const markBtn = document.getElementById('mark-read');
function paintMark() {
  const read = !!state.read[id];
  markBtn.textContent = read ? '읽음 취소' : '읽음으로 표시';
  markBtn.classList.toggle('primary', !read);
}
markBtn.addEventListener('click', () => {
  if (state.read[id]) delete state.read[id];
  else state.read[id] = true;
  save();
  paintMark();
  refreshReadMarks();
});
paintMark();

/* 확인 문제 */
function paintQuestion(i) {
  const wrap = document.getElementById('q-' + i);
  const q = data.quiz[i];
  const chosen = state.quiz[id] ? state.quiz[id][i] : undefined;
  const answered = chosen !== undefined;
  wrap.querySelectorAll('button[data-o]').forEach((b) => {
    const j = Number(b.dataset.o);
    b.disabled = answered;
    b.classList.toggle('right', answered && j === q.answer);
    b.classList.toggle('wrong', answered && j === chosen && j !== q.answer);
  });
  const ex = wrap.querySelector('.q-explain');
  ex.hidden = !answered;
  ex.innerHTML = answered
    ? (chosen === q.answer ? '<b>정답</b> ' : `<b class="x">오답</b> 정답은 ${KEYS[q.answer]}. `) + esc(q.explain)
    : '';
}

const quiz = document.getElementById('quiz');
if (quiz) {
  data.quiz.forEach((_, i) => paintQuestion(i));
  quiz.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-q]');
    if (!b || b.disabled) return;
    const qi = Number(b.dataset.q);
    state.quiz[id] = state.quiz[id] || {};
    state.quiz[id][qi] = Number(b.dataset.o);
    save();
    paintQuestion(qi);
  });
  document.getElementById('quiz-reset').addEventListener('click', () => {
    delete state.quiz[id];
    save();
    data.quiz.forEach((_, i) => paintQuestion(i));
  });
}

/* 본문 용어 설명 */
initTerms(data.terms || {}, id);
