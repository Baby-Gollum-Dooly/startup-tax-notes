/* 계산기 화면: 입력을 읽어 lib/calc.mjs 결과를 표로 그린다 */
import { insurance, corporateTax, vat, dilution } from '../../lib/calc.mjs';
import { esc, won } from '../../lib/html.mjs';

const $ = (id) => document.getElementById(id);
const num = (id) => Number(String($(id).value).replace(/[^0-9]/g, '')) || 0;

document.querySelectorAll('.tool form').forEach((f) => f.addEventListener('submit', (e) => e.preventDefault()));

/* 금액 입력칸은 천 단위 쉼표를 붙여 보여 준다 */
function bindMoney(id, fn) {
  const el = $(id);
  el.addEventListener('input', () => {
    const n = num(id);
    el.value = n ? n.toLocaleString('ko-KR') : '';
    fn();
  });
}

function table(head, rows, foot = '') {
  return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}${foot}</tbody></table></div>`;
}

function eok(n) {
  if (n >= 1e8) return (Math.round(n / 1e8 * 100) / 100).toLocaleString('ko-KR') + '억';
  return won(n / 1e4) + '만';
}

function pct(n) {
  return (Math.round(n * 1000) / 10).toFixed(1) + '%';
}

/* 4대보험 */
const NOTES = {
  ceo: '대표이사 가입 대상 아님',
  stable: '회사분에 고용안정 0.25% 포함',
  noRate: '요율 미입력'
};
function updInsurance() {
  const pay = num('ins-pay');
  const ceo = document.querySelector('input[name="ins-who"]:checked').value === 'ceo';
  const r = insurance(pay, ceo, parseFloat($('ins-sj').value) || 0);
  const rows = r.rows.map((x) => {
    const note = x.note === 'pensionBase' ? `기준소득월액 ${won(r.base)}원 적용` : (NOTES[x.note] || '');
    return `<tr><td>${x.name}</td><td class="r">${won(x.worker)}</td><td class="r">${won(x.company)}</td><td class="muted">${esc(note)}</td></tr>`;
  }).join('');
  $('ins-out').innerHTML =
    table('<th>항목</th><th class="r">근로자 부담</th><th class="r">회사 부담</th><th>비고</th>', rows,
      `<tr class="total"><td>합계</td><td class="r">${won(r.worker)}</td><td class="r">${won(r.company)}</td><td></td></tr>`) +
    `<p>회사가 매달 쓰는 인건비는 월 보수 ${won(pay)}원에 회사 부담 ${won(r.company)}원을 더한 <strong>${won(pay + r.company)}원</strong>입니다. 근로자가 받는 금액은 여기서 근로자 부담분과 소득세, 지방소득세를 뺀 금액입니다.</p>` +
    '<p class="muted">국민연금 기준소득월액 하한 41만원, 상한 659만원은 2026년 7월부터 2027년 6월까지 적용 기준입니다. 고용안정 0.25%는 150인 미만 기업 기준입니다.</p>';
}

/* 법인세 */
function updCorporateTax() {
  const r = corporateTax(num('cit-base'), $('cit-year').value);
  const rows = r.rows.map((x) =>
    `<tr><td>${x.from ? eok(x.from) + ' 초과 ' : ''}${eok(x.to)}원 이하</td><td class="r">${Math.round(x.rate * 100)}%</td><td class="r">${won(x.tax)}</td></tr>`
  ).join('');
  $('cit-out').innerHTML =
    table('<th>구간</th><th class="r">세율</th><th class="r">세액</th>', rows,
      `<tr class="total"><td>법인세 산출세액</td><td></td><td class="r">${won(r.total)}</td></tr>` +
      `<tr><td>법인지방소득세 (대략 10%)</td><td></td><td class="r">${won(Math.floor(r.total * 0.1))}</td></tr>`) +
    '<p class="muted">감면, 공제, 최저한세, 가산세는 반영하지 않은 금액입니다. 구간 표시는 과세표준 금액 기준입니다.</p>';
}

/* 부가세 */
function updVat() {
  const r = vat(num('vat-sales'), num('vat-buy'));
  $('vat-out').innerHTML =
    table('<th></th><th class="r">공급가액</th><th class="r">세액</th>',
      `<tr><td>매출</td><td class="r">${won(r.salesSupply)}</td><td class="r">${won(r.salesTax)}</td></tr>` +
      `<tr><td>매입 (공제분)</td><td class="r">${won(r.purchaseSupply)}</td><td class="r">${won(r.purchaseTax)}</td></tr>`,
      `<tr class="total"><td>${r.payable >= 0 ? '납부할 세액' : '환급받을 세액'}</td><td></td><td class="r">${won(Math.abs(r.payable))}</td></tr>`) +
    '<p class="muted">부가세 포함 금액의 11분의 1로 계산했습니다. 영세율, 면세 매출, 신용카드 발행세액공제 등은 반영하지 않았습니다.</p>';
}

/* 지분 희석 */
function updDilution() {
  const r = dilution({
    preMoney: num('dil-pre'),
    investment: num('dil-inv'),
    shares: num('dil-shares'),
    mine: num('dil-mine'),
    poolRate: (parseFloat($('dil-pool').value) || 0) / 100
  });
  if (!r) {
    $('dil-out').innerHTML = '<p class="muted">프리머니와 발행주식 수를 입력하세요. 스톡옵션 풀과 투자자 지분율의 합은 100%보다 작아야 합니다.</p>';
    return;
  }
  $('dil-out').innerHTML =
    table('<th>항목</th><th class="r">값</th>',
      `<tr><td>포스트머니</td><td class="r">${won(r.post)}원</td></tr>` +
      `<tr><td>주당 발행가</td><td class="r">${won(r.price)}원</td></tr>` +
      `<tr><td>투자자 신주</td><td class="r">${won(r.newShares)}주</td></tr>` +
      (r.poolShares ? `<tr><td>스톡옵션 풀</td><td class="r">${won(r.poolShares)}주</td></tr>` : '') +
      `<tr><td>투자 후 총 주식</td><td class="r">${won(r.after)}주</td></tr>` +
      `<tr><td>투자자 지분율</td><td class="r">${pct(r.investorRate)}</td></tr>` +
      `<tr><td>내 지분율</td><td class="r">${pct(r.mineBefore)} → ${pct(r.mineAfter)}</td></tr>`,
      `<tr class="total"><td>내 보유 주식 가치</td><td class="r">${won(r.mineValue)}원</td></tr>`) +
    '<p class="muted">신주 수는 1주 미만을 버렸습니다. 우선주 전환 비율, 리픽싱, 기존 스톡옵션은 반영하지 않았습니다.</p>';
}

bindMoney('ins-pay', updInsurance);
document.querySelectorAll('input[name="ins-who"]').forEach((el) => el.addEventListener('change', updInsurance));
$('ins-sj').addEventListener('input', updInsurance);

bindMoney('cit-base', updCorporateTax);
$('cit-year').addEventListener('change', updCorporateTax);

bindMoney('vat-sales', updVat);
bindMoney('vat-buy', updVat);

['dil-pre', 'dil-inv', 'dil-shares', 'dil-mine'].forEach((id) => bindMoney(id, updDilution));
$('dil-pool').addEventListener('input', updDilution);

updInsurance();
updCorporateTax();
updVat();
updDilution();
