/* 계산기 입력 폼. 결과는 브라우저에서 계산 */

function field(id, label, value, hint, attrs = 'type="text" inputmode="numeric"') {
  return `<div class="field"><label for="${id}">${label}</label><input ${attrs} id="${id}" value="${value}">` +
    (hint ? `<span class="hint">${hint}</span>` : '') + '</div>';
}

export function tools() {
  return `<div class="page wide">
<h1>계산기</h1>
<p class="lead">대략적인 금액을 확인하는 용도입니다. 실제 고지액이나 신고 세액과는 단수 처리, 비과세 항목, 감면 등의 이유로 차이가 날 수 있습니다.</p>

<section class="tool" id="insurance">
<h2>4대보험료 (2026년 요율)</h2>
<div class="tool-body">
<form>
  ${field('ins-pay', '월 보수', '3,000,000', '식대 등 비과세 금액을 뺀 금액')}
  <div class="field"><span>대상</span><div class="radio-row">
    <label><input type="radio" name="ins-who" value="emp" checked> 직원</label>
    <label><input type="radio" name="ins-who" value="ceo"> 대표이사</label>
  </div></div>
  ${field('ins-sj', '산재보험 요율 (%)', '', '업종별 요율은 근로복지공단 고시를 확인하세요', 'type="number" step="0.01" min="0" placeholder="예: 0.6"')}
</form>
<div id="ins-out" aria-live="polite"></div>
</div>
</section>

<section class="tool" id="corporate-tax">
<h2>법인세 산출세액</h2>
<div class="tool-body">
<form>
  ${field('cit-base', '과세표준', '300,000,000', '이월결손금을 뺀 뒤의 금액')}
  <div class="field"><label for="cit-year">사업연도</label><select id="cit-year"><option value="2026" selected>2026년 이후 개시</option><option value="2025">2023 ~ 2025년 개시</option></select></div>
</form>
<div id="cit-out" aria-live="polite"></div>
</div>
</section>

<section class="tool" id="vat">
<h2>부가세</h2>
<div class="tool-body">
<form>
  ${field('vat-sales', '과세기간 매출 합계 (부가세 포함)', '55,000,000')}
  ${field('vat-buy', '공제 가능한 매입 합계 (부가세 포함)', '22,000,000', '세금계산서, 사업용 카드 등으로 받은 것 중 불공제 항목 제외')}
</form>
<div id="vat-out" aria-live="polite"></div>
</div>
</section>

<section class="tool" id="dilution">
<h2>투자 후 지분율</h2>
<div class="tool-body">
<form>
  ${field('dil-pre', '프리머니 (투자 전 기업가치)', '4,000,000,000')}
  ${field('dil-inv', '투자금', '1,000,000,000')}
  ${field('dil-shares', '투자 전 발행주식 총수', '100,000')}
  ${field('dil-mine', '내 보유 주식 수', '50,000')}
  ${field('dil-pool', '스톡옵션 풀 (투자 후 지분율 %)', '0', '투자 전에 새로 떼어 두는 물량. 프리머니에 포함하는 방식으로 계산', 'type="number" step="0.5" min="0" max="50"')}
</form>
<div id="dil-out" aria-live="polite"></div>
</div>
</section>
</div>`;
}
