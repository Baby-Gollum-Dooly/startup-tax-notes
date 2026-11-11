export default {
  id: "guarantee",
  part: "대출과 정책자금",
  title: "보증기관 보증서 대출",
  summary: "신용보증기금, 기술보증기금, 지역신용보증재단의 대상과 청년 창업 보증 상품, 보증료와 보증비율.",
  minutes: 10,
  checked: "2026-11-11",
  sources: [
    { title: "신용보증기금, 대상기업", url: "https://www.kodit.or.kr/kodit/cm/cntnts/cntntsView.do?mi=2523&cntntsId=11065" },
    { title: "신용보증기금, 성장단계별 지원 프로그램", url: "https://www.kodit.or.kr/kodit/cm/cntnts/cntntsView.do?mi=2531&cntntsId=11071" },
    { title: "기술보증기금, 보증신청자격", url: "https://www.kibo.or.kr/main/work/work010102.do" },
    { title: "기술보증기금, 보증료", url: "https://www.kibo.or.kr/main/work/work010301.do" },
    { title: "기술보증기금, 보증비율", url: "https://www.kibo.or.kr/main/work/work010302.do" },
    { title: "기술보증기금, 청년창업기업 우대 프로그램", url: "https://www.kibo.or.kr/main/work/work010602.do" },
    { title: "기술보증기금, 맞춤형 창업성장 프로그램", url: "https://www.kibo.or.kr/main/work/work010603.do" },
    { title: "지역신용보증재단법 제2조", url: "https://www.law.go.kr/법령/지역신용보증재단법/제2조" },
    { title: "경기신용보증재단, 보증 시 알아두어야 할 사항", url: "https://www.gcgf.or.kr/gcgf/cm/conts/contsView.do?mi=1058&contsId=1027" },
    { title: "경기신용보증재단, 특례보증", url: "https://www.gcgf.or.kr/gcgf/cm/conts/contsView.do?mi=1561&contsId=1323" },
    { title: "신용보증기금 공지, 국가전략산업 지원 강화를 위한 정책금융 지원 안내", url: "https://www.kodit.or.kr/kodit/na/ntt/selectNttInfo.do?mi=2638&bbsId=148&nttSn=779364" },
    { title: "신용보증기금, 신용보증의 종류", url: "https://www.kodit.or.kr/kodit/cm/cntnts/cntntsView.do?mi=2522&cntntsId=11184" }
  ],
  quiz: [
    {
      q: "기술보증기금 청년창업기업 우대 프로그램의 대상은?",
      options: ["창업 10년 이내, 나이 무관", "창업 5년 이내, 경영주 만 17 ~ 39세 기술창업기업", "상장 준비 기업", "소상공인만"],
      answer: 1,
      explain: "창업 5년 이내이고 경영주가 만 17 ~ 39세인 기술창업기업이 대상입니다. 기업당 3억원까지입니다."
    },
    {
      q: "보증비율 85%의 의미는?",
      options: ["대출 금리가 85% 할인된다", "은행 대출금의 85%를 보증기관이 책임진다", "보증료가 대출금의 85%다", "85%만 갚으면 된다"],
      answer: 1,
      explain: "보증비율은 은행 대출금 중 보증기관이 보증하는 비율입니다. 기술보증기금 신규보증의 기본 비율이 85%입니다."
    }
  ],
  body: `
<p class="lead">보증서 대출은 보증기관이 회사의 기술이나 신용을 평가해 보증서를 발급하고, 회사가 그 보증서로 은행에서 돈을 빌리는 방식입니다. 담보가 부족한 초기 기업이 많이 씁니다. 회사는 은행 이자와 별도로 보증기관에 보증료를 냅니다.</p>

<h2>기관별 대상</h2>
<div class="table-wrap"><table>
<thead><tr><th>기관</th><th>대상</th></tr></thead>
<tbody>
<tr><td>신용보증기금</td><td>영리 목적의 개인기업, 법인기업, 중소기업협동조합. 업종 제한은 없고 도박, 사치, 향락, 부동산 투기를 조장하는 업종은 제한 [[1]]</td></tr>
<tr><td>기술보증기금</td><td>신기술사업을 하는 중소기업 등. 휴업 기업, 신용관리정보 대상자, 신보나 재단에서 보증사고가 난 기업 등은 신규보증 제한 [[3]]</td></tr>
<tr><td>지역신용보증재단</td><td>소기업, 소상공인 [[8]]</td></tr>
</tbody></table></div>

<h2>창업 기업과 청년을 위한 상품</h2>
<div class="table-wrap"><table>
<thead><tr><th>상품</th><th>대상</th><th>한도와 보증비율</th><th>보증료</th></tr></thead>
<tbody>
<tr><td>신보 청년희망드림보증</td><td>창업 7년 이내, 대표 만 17 ~ 39세(제조업, 유망창업 등)</td><td>3억원, 95%</td><td>고정 0.3% [[2]]</td></tr>
<tr><td>신보 유망성장초기 보증</td><td>창업 3년 이내</td><td>20억원, 90%</td><td>0.3%p 차감 [[2]]</td></tr>
<tr><td>신보 예비창업가 육성보증</td><td>창업 전 6개월</td><td>10억원, 90 ~ 100%</td><td>0.3 ~ 0.7%p 차감 [[2]]</td></tr>
<tr><td>기보 청년창업기업 우대 프로그램</td><td>창업 5년 이내, 경영주 만 17 ~ 39세 기술창업기업</td><td>3억원, 95%. 창업 1년 이내 또는 1억원 이하는 100%</td><td>연 0.3% 고정 [[6]]</td></tr>
<tr><td>기보 맞춤형 창업성장 프로그램</td><td>창업 7년 이내</td><td>90%. 1년 이내 100%, 5년 이내 95%</td><td>3년 이내 0.4%p, 7년 이내 0.3%p 감면 [[7]]</td></tr>
<tr><td>경기신보 청년 창업 특례보증 (지역 예시)</td><td>대표 만 39세 이하, 업력 7년 이내</td><td>8억원(소상공인 1억원), 90 ~ 95%</td><td>연 0.9% [[10]]</td></tr>
</tbody></table></div>
<p>상품 이름과 조건은 기관이 수시로 바꿉니다. 신청 전에 각 기관 누리집에서 현재 조건을 확인하세요.</p>

<h2>보증료와 보증비율</h2>
<div class="table-wrap"><table>
<thead><tr><th>기관</th><th>보증료</th><th>보증비율</th></tr></thead>
<tbody>
<tr><td>기술보증기금</td><td>평가등급별 기준 0.8 ~ 2.2%, 감면과 가산 후 최종 0.5 ~ 3.0%. 기술창업보증 최대 0.7%p, 벤처와 이노비즈 0.2%p 감면 [[4]]</td><td>신규보증 85%, 핵심분야와 수출 관련 90% [[5]]</td></tr>
<tr><td>경기신용보증재단 (지역 예시)</td><td>연 0.5 ~ 2.0%, 신용도별로 선납 [[9]]</td><td>상품별로 다름</td></tr>
<tr><td>신용보증기금</td><td>보증 종류와 등급에 따라 다름. 누리집에서 일반 요율 범위를 확인하지 못함 [[12]]</td><td>상품별로 다름 [[2]]</td></tr>
</tbody></table></div>
<p>보증비율이 85%라면 은행 대출금의 85%를 보증기관이 책임지고 나머지 15%는 은행이 위험을 집니다. 그래서 같은 보증서라도 은행 심사가 따로 있습니다.</p>

<h2>신보와 기보를 함께 쓸 수 있나</h2>
<p>신용보증기금은 기술보증기금을 이용하는 기업에 대해 중복보증 감축 정책에 따라 보증 지원에 제한이 있을 수 있다고 안내하고 있습니다 [[11]]. 이것을 금지하는 법령 조항은 확인하지 못했습니다. 실무에서는 한 기관을 주거래로 정하는 경우가 많으니 신청 전에 두 기관에 문의하세요.</p>

<h2>연대보증</h2>
<p>공공 보증기관은 법인 대표자 연대보증을 받지 않습니다. 근거는 <a href="/chapters/loantypes">기업 대출의 종류</a> 장에 있습니다. 경기신용보증재단은 신규보증에 연대보증인이 없고 법인은 책임경영약정을 맺는다고 안내합니다 [[9]].</p>
`
};
