/*
 * 학습 기록 저장소 (localStorage)
 * 사생활 보호 모드처럼 저장이 막힌 환경에서도 화면은 그대로 동작하도록 예외를 삼킨다.
 */
const KEY = 'tax-notes-v1';

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null') || {};
    return { read: saved.read || {}, quiz: saved.quiz || {}, check: saved.check || {}, cal: saved.cal || {} };
  } catch (e) {
    return { read: {}, quiz: {}, check: {}, cal: {} };
  }
}

export const state = load();

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    /* 저장 불가 환경 */
  }
}

export function readPageData() {
  const el = document.getElementById('page-data');
  return el ? JSON.parse(el.textContent) : null;
}

export function calendarOptions() {
  return { halfYear: !!state.cal.halfYear, freelancer: state.cal.freelancer !== false };
}
