export default {
  id: "loantypes",
  part: "대출과 정책자금",
  title: "기업 대출의 종류",
  summary: "정책자금, 보증서 대출, 지자체 이차보전, 은행 대출. 회사 규모와 업력에 따라 갈 곳이 나뉩니다.",
  minutes: 8,
  checked: "2026-11-11",
  sources: [
    { title: "중소벤처기업부 공고 제2025-649호, 2026년도 중소기업 정책자금 융자계획 공고 (원문 PDF)", url: "https://gwangyang.go.kr/boardDownload.es?bid=0001&list_no=196563&seq=6" },
    { title: "중소벤처기업진흥공단, 정책자금융자 사업개요", url: "https://www.kosmes.or.kr/nsh/SH/SBI/SHSBI001M0.do" },
    { title: "소상공인시장진흥공단, 정책자금 안내", url: "https://semas.or.kr/web/SUP01/SUP0103/SUP010301.kmdc" },
    { title: "중소벤처기업부 공고 제2025-656호, 2026년 소상공인 정책자금 융자사업 공고", url: "https://www.mss.go.kr/site/smba/ex/bbs/View.do?cbIdx=310&bcIdx=1064354&parentSeq=1064354" },
    { title: "신용보증기금, 대상기업", url: "https://www.kodit.or.kr/kodit/cm/cntnts/cntntsView.do?mi=2523&cntntsId=11065" },
    { title: "기술보증기금, 보증신청자격", url: "https://www.kibo.or.kr/main/work/work010102.do" },
    { title: "지역신용보증재단법 제2조", url: "https://www.law.go.kr/법령/지역신용보증재단법/제2조" },
    { title: "서울시 경제 누리집, 중소기업육성자금", url: "https://news.seoul.go.kr/economy/rearing-funds" },
    { title: "금융위원회 보도자료, 4.2일부터 공공기관 대출, 보증 시 연대보증 폐지", url: "https://fsc.go.kr/no010101/73054" },
    { title: "대한민국 정책브리핑, 중소벤처기업부 금융위원회 설명자료 (2021.9.23)", url: "https://korea.kr/news/actuallyView.do?newsId=148893437" },
    { title: "기업마당, 2026년 중소기업 정책자금 융자계획 변경 공고", url: "https://www.bizinfo.go.kr/sii/siia/selectSIIA200Detail.do?pblancId=PBLN_000000000124795" }
  ],
  quiz: [
    {
      q: "상시근로자 3명인 서비스업 회사는 정책자금을 주로 어디서 알아봐야 할까요?",
      options: ["중소벤처기업진흥공단", "소상공인시장진흥공단", "한국거래소", "국세청"],
      answer: 1,
      explain: "상시근로자 5명 미만(광업, 제조업, 건설업, 운수업은 10명 미만)이면 소상공인입니다. 중진공 정책자금은 소상공인을 원칙적으로 제외하고 제조업 등 일부만 예외로 둡니다."
    },
    {
      q: "2018년 4월부터 공공기관 대출과 보증에서 폐지된 것은?",
      options: ["보증료", "법인 대표자 연대보증", "담보 대출", "대출 이자"],
      answer: 1,
      explain: "신보, 기보, 중진공, 지역신보 등 공공기관의 중소기업 대출과 보증에서 법인 대표자 연대보증이 업력과 관계없이 폐지되었습니다."
    }
  ],
  body: `
<p class="lead">회사가 돈을 빌리는 길은 크게 네 가지입니다. 정부 기관이 직접 빌려주는 정책자금, 보증기관의 보증서를 받아 은행에서 빌리는 보증서 대출, 지자체가 이자 일부를 대신 내 주는 이차보전 자금, 그리고 은행의 일반 대출입니다. 투자와 달리 갚아야 하는 돈이지만 지분을 내주지 않습니다.</p>

<h2>한눈에 보기</h2>
<div class="table-wrap"><table>
<thead><tr><th>구분</th><th>운영 기관</th><th>대상</th></tr></thead>
<tbody>
<tr><td>중소기업 정책자금</td><td>중소벤처기업진흥공단</td><td>중소기업. 소상공인은 원칙적으로 제외하고 제조업 등은 예외 [[1]]</td></tr>
<tr><td>소상공인 정책자금</td><td>소상공인시장진흥공단</td><td>상시근로자 5명 미만, 광업 제조업 건설업 운수업은 10명 미만 [[3]]</td></tr>
<tr><td>보증서 대출 (일반)</td><td>신용보증기금</td><td>영리 목적의 개인기업, 법인기업 등. 도박, 사치, 향락, 부동산 투기 조장 업종은 제한 [[5]]</td></tr>
<tr><td>보증서 대출 (기술)</td><td>기술보증기금</td><td>신기술사업을 하는 중소기업 [[6]]</td></tr>
<tr><td>보증서 대출 (소규모)</td><td>지역신용보증재단</td><td>소기업, 소상공인 [[7]]</td></tr>
<tr><td>이차보전 자금</td><td>지자체, 중진공</td><td>은행 대출 이자 일부를 기관이 대신 부담. 서울시는 창업기업자금 등을 운영 [[8]]</td></tr>
</tbody></table></div>

<h2>중소기업 정책자금의 구성</h2>
<p>중진공 정책자금은 기업의 성장 단계에 맞춰 나뉩니다 [[2]].</p>
<div class="table-wrap"><table>
<thead><tr><th>단계</th><th>자금</th></tr></thead>
<tbody>
<tr><td>창업기</td><td>혁신창업사업화자금. 창업기반지원자금(청년전용창업자금 포함), 개발기술사업화자금</td></tr>
<tr><td>성장기</td><td>신시장진출지원자금, 신성장기반자금</td></tr>
<tr><td>재도약기</td><td>재도약지원자금 (재창업, 사업전환 등)</td></tr>
<tr><td>전 단계</td><td>긴급경영안정자금 등</td></tr>
</tbody></table></div>
<p>2026년 융자 규모는 당초 공고에서 4조 643억원, 이차보전 규모는 3,670억원이었고, 7월 변경 공고에서 융자 규모가 4조 6,143억원으로 늘었습니다 [[11]]. 신청은 2026년 1월 5일부터 예산이 소진될 때까지 중진공 누리집에서 받습니다 [[1]]. 자금별 조건은 <a href="/chapters/policyloan">정책자금</a> 장에서 다룹니다.</p>

<h2>직접대출과 대리대출</h2>
<div class="table-wrap"><table>
<thead><tr><th>방식</th><th>내용</th></tr></thead>
<tbody>
<tr><td>직접대출</td><td>중진공이 기업을 평가해 직접 빌려줌. 신용 또는 담보로 대출하며 보증서는 쓸 수 없음 [[1]]</td></tr>
<tr><td>대리대출</td><td>중진공이 추천하고 협약 은행이 대출. 보증서를 쓸 수 있음 [[1]]</td></tr>
</tbody></table></div>

<h2>대표 연대보증</h2>
<p>2018년 4월 2일부터 신용보증기금, 기술보증기금, 중진공, 지역신용보증재단 같은 공공기관이 중소기업에 대출이나 보증을 할 때 법인 대표자 연대보증을 업력과 관계없이 받지 않습니다 [[9]][[10]]. 기존 연대보증은 2022년까지 단계적으로 면제하기로 했습니다 [[10]]. 시중은행의 일반 대출은 이 정책과 별개이므로 약정서에서 연대보증 여부를 확인하세요.</p>

<h2>대출과 투자의 차이</h2>
<div class="table-wrap"><table>
<thead><tr><th></th><th>대출</th><th>투자</th></tr></thead>
<tbody>
<tr><td>갚을 의무</td><td>원금과 이자를 갚음</td><td>원칙적으로 없음</td></tr>
<tr><td>지분</td><td>그대로</td><td>신주 발행으로 희석</td></tr>
<tr><td>회계</td><td>부채</td><td>자본</td></tr>
<tr><td>심사에서 주로 보는 것</td><td>상환 능력, 신용, 세금 체납 여부</td><td>성장 가능성, 팀, 시장</td></tr>
</tbody></table></div>
<p>투자를 받은 회사가 대출을 받으려면 투자계약서의 사전 동의 사항에 차입이 들어 있는지 먼저 확인하세요. <a href="/chapters/term">투자계약서 주요 조항</a> 장을 참고하세요.</p>
`
};
