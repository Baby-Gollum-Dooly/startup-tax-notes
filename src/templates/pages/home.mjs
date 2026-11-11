/* 학습 현황 (메인) */
import { esc, chapterUrl } from '../../lib/html.mjs';

export function home(site) {
  const first = site.chapters[0];
  const toc = site.chapters.map((c) =>
    `<li><a href="${chapterUrl(c.id)}" data-chapter="${c.id}"><span class="no">${c.no}</span>` +
    `<span class="t">${esc(c.title)}</span>` +
    `<span class="st" data-minutes="${c.minutes}">${c.minutes}분</span>` +
    `<span class="s">${esc(c.summary)}</span></a></li>`
  ).join('\n');

  return `<div class="page wide">
<p class="eyebrow">법인을 처음 세우는 대표를 위한 세무, 회계 기초</p>
<h1>학습 현황</h1>
<div class="progress-line">
  <div class="bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"><span style="width:0%"></span></div>
  <span data-progress-text>${site.chapters.length}장 중 0장 읽음</span>
  <a class="btn primary" href="${chapterUrl(first.id)}" data-next-link>처음부터 읽기: 1장</a>
</div>
<div class="home-grid">
  <div>
    <h2>목차</h2>
    <ol class="toc">
${toc}
    </ol>
  </div>
  <div class="side-panel">
    <section>
      <h2>다가오는 세무 일정</h2>
      <ul class="deadline-list" id="upcoming"></ul>
      <p class="muted" style="margin-top:8px">12월 결산 법인 기준. <a href="/calendar">전체 일정 보기</a></p>
    </section>
    <section>
      <h2>이 사이트 사용법</h2>
      <p class="muted">1장부터 순서대로 읽는 것을 권합니다. 각 장 끝에 확인 문제가 있고, 읽음 표시와 문제 결과는 이 브라우저에 저장됩니다. 설립을 앞두고 있다면 <a href="/checklist">설립 체크리스트</a>를 먼저 열어 두세요.</p>
    </section>
  </div>
</div>
</div>`;
}

/* 홈 화면 스크립트가 쓰는 데이터: 챕터 순서와 퀴즈 정답 */
export function homeData(site) {
  return JSON.stringify({
    chapters: site.chapters.map((c) => ({ id: c.id, no: c.no, answers: c.quiz.map((q) => q.answer) }))
  });
}
