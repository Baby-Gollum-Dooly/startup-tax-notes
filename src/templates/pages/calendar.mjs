/* 세무 일정. 오늘 날짜 기준이라 목록은 브라우저에서 그린다 */
import { HOLIDAYS } from '../../content/schedule.mjs';

export function calendar() {
  const years = Object.keys(HOLIDAYS);
  const options = years.map((y) => `<option value="${y}">${y}</option>`).join('');
  return `<div class="page">
<p class="eyebrow">12월 결산 법인 기준</p>
<h1>세무 일정</h1>
<p class="lead">기한이 토요일, 일요일, 공휴일이면 다음 영업일로 옮겨 표시합니다. 공휴일은 ${years.join(', ')}년분만 들어 있고, 임시공휴일은 반영되지 않을 수 있으니 실제 기한은 홈택스에서 확인하세요.</p>
<form class="cal-controls" id="cal-form">
  <label>연도 <select id="cal-year">${options}</select></label>
  <label><input type="checkbox" id="cal-half"> 원천세 반기납부 승인 받음</label>
  <label><input type="checkbox" id="cal-free" checked> 프리랜서에게 매월 지급</label>
</form>
<div id="cal-months"><noscript><p>일정을 보려면 자바스크립트를 켜 주세요.</p></noscript></div>
</div>`;
}
