/*
 * 본문 용어 표시
 * 챕터 본문에서 용어사전 단어가 처음 나오는 곳을 찾아 설명 버튼으로 감싼다.
 * 링크, 제목, 표 머리글, 출처 번호 안은 건드리지 않는다.
 */
const SKIP_TAGS = new Set(['a', 'h1', 'h2', 'h3', 'th', 'caption', 'sup', 'button', 'b']);

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function markTerms(body, glossary) {
  const labels = [];
  glossary.forEach((g, i) => {
    [g.term, g.alias].filter((x) => x && x.length >= 2).forEach((label) => labels.push({ label, i }));
  });
  labels.sort((a, b) => b.label.length - a.label.length);
  const byLabel = new Map(labels.map((l) => [l.label, l.i]));

  const used = new Set();
  const tokens = body.split(/(<[^>]+>)/);
  let skipDepth = 0;

  const out = tokens.map((tok) => {
    if (tok.startsWith('<')) {
      const m = tok.match(/^<\/?([a-zA-Z0-9]+)/);
      if (m && SKIP_TAGS.has(m[1].toLowerCase()) && !tok.endsWith('/>')) {
        skipDepth += tok.startsWith('</') ? -1 : 1;
      }
      return tok;
    }
    if (skipDepth > 0 || !tok.trim()) return tok;

    const remaining = labels.filter((l) => !used.has(l.i)).map((l) => escapeRegExp(l.label));
    if (!remaining.length) return tok;
    /* 앞 글자가 한글이나 영문이면 다른 단어의 일부이므로 건너뜀 (예: 최대주주 안의 대주주) */
    const re = new RegExp(`(?<![가-힣A-Za-z])(${remaining.join('|')})`, 'g');
    return tok.replace(re, (match) => {
      const i = byLabel.get(match);
      if (used.has(i)) return match;
      used.add(i);
      return `<button type="button" class="term" data-term="${i}" aria-haspopup="dialog" aria-expanded="false">${match}</button>`;
    });
  });

  return { html: out.join(''), used: [...used] };
}

/* 설명 창에 넘길 데이터 */
export function termData(glossary, used, chapters) {
  const byId = new Map(chapters.map((c) => [c.id, c]));
  const data = {};
  used.forEach((i) => {
    const g = glossary[i];
    const ch = byId.get(g.chapter);
    data[i] = {
      term: g.term,
      alias: g.alias || '',
      text: g.text,
      chapter: ch ? { id: ch.id, no: ch.no, title: ch.title } : null,
      source: g.source ? { title: g.source[0], url: g.source[1] } : null
    };
  });
  return data;
}

export function termAnchor(term) {
  return 'term-' + encodeURIComponent(term).replace(/%/g, '');
}

