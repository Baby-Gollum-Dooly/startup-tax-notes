/* 계산기 공식. 요율과 세율은 개정되면 여기만 수정 */

/* 2026년 4대보험 요율. 국민연금 상하한은 2026.7 ~ 2027.6 기준 (국민연금공단)
   장기요양은 소득 대비 0.9448%, 건강보험료에 0.9448 / 7.19를 곱해 계산 (국민건강보험공단) */
export const INSURANCE_2026 = {
  pension: 0.095,
  pensionMin: 410000,
  pensionMax: 6590000,
  health: 0.0719,
  ltc: 0.009448,
  empWorker: 0.009,
  empCompany: 0.009,
  empStable: 0.0025
};

/* 법인세 누진 구간 [상한, 세율] */
export const CORPORATE_TAX = {
  2025: [[2e8, 0.09], [200e8, 0.19], [3000e8, 0.21], [Infinity, 0.24]],
  2026: [[2e8, 0.10], [200e8, 0.20], [3000e8, 0.22], [Infinity, 0.25]]
};

function floor10(n) {
  return Math.floor(Math.round(n) / 10) * 10;
}

export function insurance(pay, isCeo, sanjaePercent) {
  const r = INSURANCE_2026;
  const base = Math.min(Math.max(Math.floor(pay / 1000) * 1000, r.pensionMin), r.pensionMax);
  const pension = floor10(base * r.pension / 2);
  const health = floor10(pay * r.health / 2);
  const ltc = floor10(health * r.ltc / r.health);
  const empW = isCeo ? 0 : floor10(pay * r.empWorker);
  const empC = isCeo ? 0 : floor10(pay * (r.empCompany + r.empStable));
  const sanjae = isCeo ? 0 : floor10(pay * (sanjaePercent || 0) / 100);
  return {
    base,
    rows: [
      { name: '국민연금', worker: pension, company: pension, note: base !== pay ? 'pensionBase' : '' },
      { name: '건강보험', worker: health, company: health, note: '' },
      { name: '장기요양보험', worker: ltc, company: ltc, note: '' },
      { name: '고용보험', worker: empW, company: empC, note: isCeo ? 'ceo' : 'stable' },
      { name: '산재보험', worker: 0, company: sanjae, note: isCeo ? 'ceo' : (sanjaePercent ? '' : 'noRate') }
    ],
    worker: pension + health + ltc + empW,
    company: pension + health + ltc + empC + sanjae
  };
}

export function corporateTax(base, year) {
  const brackets = CORPORATE_TAX[year];
  const rows = [];
  let prev = 0;
  let total = 0;
  for (let i = 0; i < brackets.length && base > prev; i++) {
    const [top, rate] = brackets[i];
    const amount = Math.min(base, top) - prev;
    const tax = amount * rate;
    rows.push({ from: prev, to: Math.min(base, top), rate, tax });
    total += tax;
    prev = top;
  }
  return { rows, total };
}

/* 부가세 포함 금액 기준 */
export function vat(salesTotal, purchaseTotal) {
  const salesTax = Math.round(salesTotal / 11);
  const purchaseTax = Math.round(purchaseTotal / 11);
  return {
    salesSupply: salesTotal - salesTax,
    salesTax,
    purchaseSupply: purchaseTotal - purchaseTax,
    purchaseTax,
    payable: salesTax - purchaseTax
  };
}

/* 스톡옵션 풀은 투자 후 지분율 기준, 프리머니에 포함 */
export function dilution({ preMoney, investment, shares, mine, poolRate }) {
  const post = preMoney + investment;
  if (!preMoney || !shares || post <= 0 || poolRate + investment / post >= 1) return null;
  const total = shares / (1 - poolRate - investment / post);
  const price = post / total;
  const newShares = Math.floor(investment / price);
  const poolShares = Math.round(total * poolRate);
  const after = shares + poolShares + newShares;
  return {
    post,
    price,
    newShares,
    poolShares,
    after,
    investorRate: newShares / after,
    mineBefore: mine / shares,
    mineAfter: mine / after,
    mineValue: mine * price
  };
}
