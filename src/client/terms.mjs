/*
 * 본문 용어 설명 창
 * 밑줄 친 단어를 누르면 컴퓨터에서는 단어 아래에, 휴대폰에서는 화면 아래에 설명을 띄운다.
 */
import { esc, chapterUrl } from '../lib/html.mjs';
import { termAnchor } from '../lib/terms.mjs';

export function initTerms(terms, currentChapter) {
  const buttons = document.querySelectorAll('button.term');
  if (!buttons.length) return;

  const pop = document.createElement('div');
  pop.className = 'term-pop';
  pop.setAttribute('role', 'dialog');
  pop.setAttribute('aria-modal', 'false');
  pop.hidden = true;
  document.body.appendChild(pop);

  let current = null;
  const narrow = window.matchMedia('(max-width: 560px)');

  function close() {
    if (!current) return;
    current.setAttribute('aria-expanded', 'false');
    pop.hidden = true;
    const last = current;
    current = null;
    return last;
  }

  function place(btn) {
    if (narrow.matches) {
      pop.classList.add('sheet');
      pop.style.left = pop.style.top = '';
      return;
    }
    pop.classList.remove('sheet');
    const r = btn.getBoundingClientRect();
    const width = Math.min(360, window.innerWidth - 32);
    pop.style.width = width + 'px';
    let left = r.left + window.scrollX;
    left = Math.max(16 + window.scrollX, Math.min(left, window.scrollX + window.innerWidth - width - 16));
    pop.style.left = left + 'px';
    pop.style.top = (r.bottom + window.scrollY + 8) + 'px';
    /* 아래 공간이 부족하면 단어 위에 띄움 */
    const h = pop.offsetHeight;
    if (r.bottom + h + 16 > window.innerHeight && r.top - h - 8 > 0) {
      pop.style.top = (r.top + window.scrollY - h - 8) + 'px';
    }
  }

  function open(btn) {
    const t = terms[btn.dataset.term];
    if (!t) return;
    if (current === btn) { close(); return; }
    close();
    const links = [];
    if (t.chapter && t.chapter.id !== currentChapter) {
      links.push(`<a href="${chapterUrl(t.chapter.id)}">${t.chapter.no}장 ${esc(t.chapter.title)}</a>`);
    }
    links.push(`<a href="/glossary#${termAnchor(t.term)}">용어 전체 보기</a>`);
    pop.innerHTML =
      `<div class="term-pop-head"><strong id="term-pop-title">${esc(t.term)}</strong>` +
      (t.alias ? `<span>${esc(t.alias)}</span>` : '') +
      '<button type="button" class="term-pop-close" aria-label="설명 닫기">닫기</button></div>' +
      `<p>${esc(t.text)}</p>` +
      (t.source ? `<p class="term-pop-src">근거 <a href="${esc(t.source.url)}" target="_blank" rel="noopener">${esc(t.source.title)}</a></p>` : '') +
      `<p class="term-pop-links">${links.join('')}</p>`;
    pop.setAttribute('aria-labelledby', 'term-pop-title');
    pop.hidden = false;
    current = btn;
    btn.setAttribute('aria-expanded', 'true');
    place(btn);
    pop.querySelector('.term-pop-close').addEventListener('click', () => {
      const last = close();
      if (last) last.focus();
    });
  }

  buttons.forEach((btn) => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    open(btn);
  }));
  document.addEventListener('click', (e) => {
    if (current && !pop.contains(e.target)) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current) {
      const last = close();
      if (last) last.focus();
    }
  });
  window.addEventListener('resize', () => { if (current) place(current); });
}
