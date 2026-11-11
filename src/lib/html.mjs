/* 빌드와 브라우저 양쪽에서 쓰는 문자열 도구 */

export function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

export function won(n) {
  return Math.round(n).toLocaleString('ko-KR');
}

export const SITE_NAME = '창업 세무회계 노트';
export const SITE_URL = 'https://startup-tax-notes.vercel.app';

export const NAV = [
  { key: 'home', href: '/', label: '학습 현황' },
  { key: 'calendar', href: '/calendar', label: '세무 일정' },
  { key: 'tools', href: '/tools', label: '계산기' },
  { key: 'glossary', href: '/glossary', label: '용어' },
  { key: 'checklist', href: '/checklist', label: '설립 체크리스트' }
];

export function chapterUrl(id) {
  return '/chapters/' + id;
}
