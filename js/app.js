(function () {
  'use strict';

  var CH = window.CHAPTERS;
  var main = document.getElementById('main');
  var sidebar = document.getElementById('sidebar');
  var STORE_KEY = 'tax-notes-v1';

  /* 저장소: 사생활 보호 모드 등에서 실패해도 화면은 동작하도록 */
  var state = { read: {}, quiz: {}, check: {}, cal: {} };
  try {
    var saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (saved) {
      state.read = saved.read || {};
      state.quiz = saved.quiz || {};
      state.check = saved.check || {};
      state.cal = saved.cal || {};
    }
  } catch (e) { /* 저장 불가 환경 */ }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* 무시 */ }
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function won(n) { return Math.round(n).toLocaleString('ko-KR'); }
  function chapterById(id) {
    for (var i = 0; i < CH.length; i++) if (CH[i].id === id) return CH[i];
    return null;
  }
  function readCount() {
    return CH.filter(function (c) { return state.read[c.id]; }).length;
  }

  /* ---------- 세무 일정 계산 ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function isHoliday(dt) {
    var dow = dt.getDay();
    if (dow === 0 || dow === 6) return true;
    var list = window.HOLIDAYS[dt.getFullYear()];
    return !!(list && list.indexOf(pad(dt.getMonth() + 1) + '-' + pad(dt.getDate())) >= 0);
  }
  function nextBusinessDay(dt) {
    var d = new Date(dt.getTime());
    while (isHoliday(d)) d.setDate(d.getDate() + 1);
    return d;
  }
  function buildDeadlines(year, opts) {
    var out = [];
    window.DEADLINES.forEach(function (it) {
      var months = it.m === 0 ? [1,2,3,4,5,6,7,8,9,10,11,12] : [it.m];
      months.forEach(function (m) {
        if (opts && opts.halfYear && it.type === 'monthly' && it.title === '원천세 신고납부') return;
        if (opts && !opts.halfYear && it.title === '원천세 반기납부') return;
        if (opts && !opts.freelancer && it.title.indexOf('사업소득 간이지급명세서') === 0) return;
        var day = it.d === 'end' ? new Date(year, m, 0).getDate() : it.d;
        var base = new Date(year, m - 1, day);
        var due = nextBusinessDay(base);
        out.push({ date: due, base: base, shifted: due.getTime() !== base.getTime(), item: it });
      });
    });
    out.sort(function (a, b) { return a.date - b.date; });
    return out;
  }
  function upcoming(n) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var opts = { halfYear: !!state.cal.halfYear, freelancer: state.cal.freelancer !== false };
    var list = buildDeadlines(today.getFullYear(), opts).concat(buildDeadlines(today.getFullYear() + 1, opts));
    return list.filter(function (x) { return x.date >= today; }).slice(0, n);
  }
  function daysLeft(dt) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.round((dt - today) / 86400000);
  }
  var DOW = ['일', '월', '화', '수', '목', '금', '토'];
  function fmtDate(dt) { return (dt.getMonth() + 1) + '.' + pad(dt.getDate()) + ' ' + DOW[dt.getDay()]; }

  /* ---------- 사이드바 ---------- */
  function renderSidebar(route) {
    var parts = [];
    var html = '<div class="mobile-nav"><h2>메뉴</h2><ol>' +
      [['#home', '학습 현황'], ['#calendar', '세무 일정'], ['#tools', '계산기'], ['#glossary', '용어'], ['#checklist', '설립 체크리스트']]
        .map(function (l) { return '<li><a href="' + l[0] + '"><span class="no"></span><span>' + l[1] + '</span></a></li>'; }).join('') +
      '</ol></div>';
    CH.forEach(function (c) { if (parts.indexOf(c.part) < 0) parts.push(c.part); });
    parts.forEach(function (p) {
      html += '<h2>' + esc(p) + '</h2><ol>';
      CH.filter(function (c) { return c.part === p; }).forEach(function (c) {
        var active = route.name === 'chapter' && route.id === c.id;
        html += '<li><a href="#ch-' + c.id + '"' + (active ? ' class="active" aria-current="page"' : '') + '>' +
          '<span class="no">' + c.no + '</span><span>' + esc(c.title) + '</span>' +
          '<span class="done">' + (state.read[c.id] ? '읽음' : '') + '</span></a></li>';
      });
      html += '</ol>';
    });
    html += '<p class="meta">' + readCount() + ' / ' + CH.length + '장 읽음</p>';
    sidebar.innerHTML = html;

    document.querySelectorAll('.topnav a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-nav') === route.name);
    });
  }

  /* ---------- 학습 현황 ---------- */
  function renderHome() {
    var done = readCount();
    var pct = Math.round(done / CH.length * 100);
    var next = CH.filter(function (c) { return !state.read[c.id]; })[0];

    var toc = CH.map(function (c) {
      var q = quizScore(c);
      var st = state.read[c.id] ? '읽음' + (q ? ', 퀴즈 ' + q.right + '/' + q.total : '') : c.minutes + '분';
      return '<li><a href="#ch-' + c.id + '"><span class="no">' + c.no + '</span>' +
        '<span class="t">' + esc(c.title) + '</span>' +
        '<span class="st' + (state.read[c.id] ? ' ok' : '') + '">' + st + '</span>' +
        '<span class="s">' + esc(c.summary) + '</span></a></li>';
    }).join('');

    var dl = upcoming(6).map(function (x) {
      var left = daysLeft(x.date);
      return '<li><span class="d">' + fmtDate(x.date) +
        '<span class="left' + (left <= 7 ? ' soon' : '') + '">' + (left === 0 ? '오늘' : left + '일 남음') + '</span></span>' +
        '<span><a href="#ch-' + x.item.ref + '">' + esc(x.item.title) + '</a><br><span class="muted">' + esc(x.item.note) + '</span></span></li>';
    }).join('');

    main.innerHTML =
      '<div class="page wide">' +
      '<p class="eyebrow">법인을 처음 세우는 대표를 위한 세무, 회계 기초</p>' +
      '<h1>학습 현황</h1>' +
      '<div class="progress-line"><div class="bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + pct + '%"></span></div>' +
      '<span>' + CH.length + '장 중 ' + done + '장 읽음</span>' +
      (next ? '<a class="btn primary" href="#ch-' + next.id + '">' + (done ? '이어서 읽기: ' : '처음부터 읽기: ') + next.no + '장</a>' : '<span>모두 읽었습니다.</span>') +
      '</div>' +
      '<div class="home-grid">' +
        '<div><h2>목차</h2><ol class="toc">' + toc + '</ol></div>' +
        '<div class="side-panel">' +
          '<section><h2>다가오는 세무 일정</h2><ul class="deadline-list">' + dl + '</ul>' +
          '<p class="muted" style="margin-top:8px">12월 결산 법인 기준. <a href="#calendar">전체 일정 보기</a></p></section>' +
          '<section><h2>이 사이트 사용법</h2>' +
          '<p class="muted">1장부터 순서대로 읽는 것을 권합니다. 각 장 끝에 확인 문제가 있고, 읽음 표시와 문제 결과는 이 브라우저에 저장됩니다. 설립을 앞두고 있다면 설립 체크리스트를 먼저 열어 두세요.</p></section>' +
        '</div>' +
      '</div></div>';
  }

  /* ---------- 챕터 ---------- */
  function quizScore(c) {
    var ans = state.quiz[c.id];
    if (!ans || !c.quiz) return null;
    var total = c.quiz.length, answered = 0, right = 0;
    c.quiz.forEach(function (q, i) {
      if (ans[i] !== undefined) { answered++; if (ans[i] === q.answer) right++; }
    });
    return answered === total ? { right: right, total: total } : null;
  }

  function renderQuizItem(c, q, i) {
    var chosen = state.quiz[c.id] ? state.quiz[c.id][i] : undefined;
    var answered = chosen !== undefined;
    var keys = ['가', '나', '다', '라', '마'];
    var opts = q.options.map(function (o, j) {
      var cls = '';
      if (answered && j === q.answer) cls = 'right';
      else if (answered && j === chosen) cls = 'wrong';
      return '<li><button type="button" data-q="' + i + '" data-o="' + j + '" data-key="' + keys[j] + '"' +
        (cls ? ' class="' + cls + '"' : '') + (answered ? ' disabled' : '') + '>' + esc(o) + '</button></li>';
    }).join('');
    var ex = answered
      ? '<p class="q-explain">' + (chosen === q.answer ? '<b>정답</b> ' : '<b class="x">오답</b> 정답은 ' + keys[q.answer] + '. ') + esc(q.explain) + '</p>'
      : '';
    return '<div class="q" id="q-' + i + '"><p class="q-text">' + (i + 1) + '. ' + esc(q.q) + '</p><ul class="q-options">' + opts + '</ul>' + ex + '</div>';
  }

  function renderChapter(id) {
    var c = chapterById(id);
    if (!c) return renderNotFound();
    var idx = CH.indexOf(c);
    var prev = CH[idx - 1], next = CH[idx + 1];

    var quiz = '';
    if (c.quiz && c.quiz.length) {
      quiz = '<section class="quiz" id="quiz"><h2>확인 문제</h2>' +
        c.quiz.map(function (q, i) { return renderQuizItem(c, q, i); }).join('') +
        '<button type="button" class="btn text" id="quiz-reset">문제 다시 풀기</button></section>';
    }
    var src = c.sources && c.sources.length
      ? '<section class="sources"><h2>확인할 곳</h2><ul>' + c.sources.map(function (s) {
          return '<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + '</a></li>';
        }).join('') + '</ul></section>'
      : '';

    main.innerHTML =
      '<article class="page">' +
      '<p class="eyebrow">' + c.no + '장 / ' + esc(c.part) + ' / 읽는 시간 약 ' + c.minutes + '분</p>' +
      '<h1>' + esc(c.title) + '</h1>' +
      c.body + src + quiz +
      '<div class="chapter-foot">' +
        (prev ? '<a href="#ch-' + prev.id + '"><small>이전</small>' + prev.no + '. ' + esc(prev.title) + '</a>' : '<span></span>') +
        '<button type="button" class="btn' + (state.read[c.id] ? '' : ' primary') + '" id="mark-read">' + (state.read[c.id] ? '읽음 취소' : '읽음으로 표시') + '</button>' +
        (next ? '<a class="next" href="#ch-' + next.id + '"><small>다음</small>' + next.no + '. ' + esc(next.title) + '</a>' : '<a class="next" href="#home"><small>끝</small>학습 현황으로</a>') +
      '</div></article>';

    document.getElementById('mark-read').addEventListener('click', function () {
      if (state.read[c.id]) delete state.read[c.id]; else state.read[c.id] = true;
      save();
      route();
    });
    var qz = document.getElementById('quiz');
    if (qz) {
      qz.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-q]');
        if (!b || b.disabled) return;
        var qi = +b.getAttribute('data-q'), oi = +b.getAttribute('data-o');
        state.quiz[c.id] = state.quiz[c.id] || {};
        state.quiz[c.id][qi] = oi;
        save();
        var wrap = document.getElementById('q-' + qi);
        wrap.outerHTML = renderQuizItem(c, c.quiz[qi], qi);
      });
      document.getElementById('quiz-reset').addEventListener('click', function () {
        delete state.quiz[c.id];
        save();
        c.quiz.forEach(function (q, i) {
          document.getElementById('q-' + i).outerHTML = renderQuizItem(c, q, i);
        });
      });
    }
  }

  /* ---------- 세무 일정 ---------- */
  function renderCalendar() {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var years = Object.keys(window.HOLIDAYS).map(Number);
    var year = state.cal.year && years.indexOf(state.cal.year) >= 0 ? state.cal.year : today.getFullYear();
    if (years.indexOf(year) < 0) years.push(year);
    var opts = { halfYear: !!state.cal.halfYear, freelancer: state.cal.freelancer !== false };
    var list = buildDeadlines(year, opts);

    var byMonth = {};
    list.forEach(function (x) {
      var k = x.base.getMonth();
      (byMonth[k] = byMonth[k] || []).push(x);
    });
    var blocks = '';
    for (var m = 0; m < 12; m++) {
      var items = byMonth[m] || [];
      var isNow = year === today.getFullYear() && m === today.getMonth();
      blocks += '<div class="month-block' + (isNow ? ' now' : '') + '"><h3>' + (m + 1) + '월' + (isNow ? ' <span class="tag">이번 달</span>' : '') + '</h3><ul>' +
        items.map(function (x) {
          var past = x.date < today;
          return '<li' + (past ? ' class="past"' : '') + '><span class="d">' + fmtDate(x.date) +
            (x.shifted ? '<span class="shift">원래 ' + (x.base.getMonth() + 1) + '.' + pad(x.base.getDate()) + ', 휴일로 연기</span>' : '') + '</span>' +
            '<span><a href="#ch-' + x.item.ref + '">' + esc(x.item.title) + '</a> <span class="muted">' + esc(x.item.note) + '</span></span></li>';
        }).join('') + '</ul></div>';
    }

    main.innerHTML =
      '<div class="page">' +
      '<p class="eyebrow">12월 결산 법인 기준</p>' +
      '<h1>세무 일정</h1>' +
      '<p class="lead">기한이 토요일, 일요일, 공휴일이면 다음 영업일로 옮겨 표시합니다. 공휴일은 ' + Object.keys(window.HOLIDAYS).join(', ') + '년분만 들어 있고, 임시공휴일은 반영되지 않을 수 있으니 실제 기한은 홈택스에서 확인하세요.</p>' +
      '<div class="cal-controls">' +
        '<label>연도 <select id="cal-year">' + years.sort().map(function (y) { return '<option' + (y === year ? ' selected' : '') + '>' + y + '</option>'; }).join('') + '</select></label>' +
        '<label><input type="checkbox" id="cal-half"' + (opts.halfYear ? ' checked' : '') + '> 원천세 반기납부 승인 받음</label>' +
        '<label><input type="checkbox" id="cal-free"' + (opts.freelancer ? ' checked' : '') + '> 프리랜서에게 매월 지급</label>' +
      '</div>' + blocks + '</div>';

    document.getElementById('cal-year').addEventListener('change', function (e) { state.cal.year = +e.target.value; save(); renderCalendar(); });
    document.getElementById('cal-half').addEventListener('change', function (e) { state.cal.halfYear = e.target.checked; save(); renderCalendar(); });
    document.getElementById('cal-free').addEventListener('change', function (e) { state.cal.freelancer = e.target.checked; save(); renderCalendar(); });
  }

  /* ---------- 계산기 ---------- */
  var RATES_2026 = {
    pension: 0.095, pensionMin: 400000, pensionMax: 6370000,
    health: 0.0719, ltc: 0.1314,
    empWorker: 0.009, empCompany: 0.009, empStable: 0.0025
  };
  function floor10(n) { return Math.floor(Math.round(n) / 10) * 10; }

  function insuranceCalc(pay, isCeo, sanjae) {
    var r = RATES_2026;
    var base = Math.min(Math.max(Math.floor(pay / 1000) * 1000, r.pensionMin), r.pensionMax);
    var pension = floor10(base * r.pension / 2);
    var health = floor10(pay * r.health / 2);
    var ltc = floor10(pay * r.health * r.ltc / 2);
    var empW = isCeo ? 0 : floor10(pay * r.empWorker);
    var empC = isCeo ? 0 : floor10(pay * (r.empCompany + r.empStable));
    var sj = isCeo ? 0 : floor10(pay * (sanjae || 0) / 100);
    return {
      rows: [
        ['국민연금', pension, pension, base !== pay ? '기준소득월액 ' + won(base) + '원 적용' : ''],
        ['건강보험', health, health, ''],
        ['장기요양보험', ltc, ltc, ''],
        ['고용보험', empW, empC, isCeo ? '대표이사 가입 대상 아님' : '회사분에 고용안정 0.25% 포함'],
        ['산재보험', 0, sj, isCeo ? '대표이사 가입 대상 아님' : (sanjae ? '' : '요율 미입력')]
      ],
      worker: pension + health + ltc + empW,
      company: pension + health + ltc + empC + sj
    };
  }

  var CIT = {
    2025: [[2e8, 0.09], [200e8, 0.19], [3000e8, 0.21], [Infinity, 0.24]],
    2026: [[2e8, 0.10], [200e8, 0.20], [3000e8, 0.22], [Infinity, 0.25]]
  };
  function citCalc(base, year) {
    var brackets = CIT[year], prev = 0, total = 0, rows = [];
    for (var i = 0; i < brackets.length && base > prev; i++) {
      var top = brackets[i][0], rate = brackets[i][1];
      var amt = Math.min(base, top) - prev;
      var tax = amt * rate;
      rows.push([prev, Math.min(base, top), rate, tax]);
      total += tax;
      prev = top;
    }
    return { rows: rows, total: total };
  }
  function eok(n) {
    if (n >= 1e8) {
      var e = n / 1e8;
      return (Math.round(e * 100) / 100).toLocaleString('ko-KR') + '억';
    }
    return won(n / 1e4) + '만';
  }

  function renderTools() {
    main.innerHTML =
      '<div class="page wide">' +
      '<h1>계산기</h1>' +
      '<p class="lead">대략적인 금액을 확인하는 용도입니다. 실제 고지액이나 신고 세액과는 단수 처리, 비과세 항목, 감면 등의 이유로 차이가 날 수 있습니다.</p>' +

      '<section class="tool" id="t-ins"><h2>4대보험료 (2026년 요율)</h2>' +
      '<div class="tool-body"><form onsubmit="return false">' +
        '<div class="field"><label for="ins-pay">월 보수</label><input type="text" inputmode="numeric" id="ins-pay" value="3,000,000"><span class="hint">식대 등 비과세 금액을 뺀 금액</span></div>' +
        '<div class="field"><label>대상</label><div class="radio-row">' +
          '<label><input type="radio" name="ins-who" value="emp" checked> 직원</label>' +
          '<label><input type="radio" name="ins-who" value="ceo"> 대표이사</label></div></div>' +
        '<div class="field"><label for="ins-sj">산재보험 요율 (%)</label><input type="number" step="0.01" min="0" id="ins-sj" placeholder="예: 0.6"><span class="hint">업종별 요율은 근로복지공단 고시를 확인하세요</span></div>' +
      '</form><div id="ins-out"></div></div></section>' +

      '<section class="tool" id="t-cit"><h2>법인세 산출세액</h2>' +
      '<div class="tool-body"><form onsubmit="return false">' +
        '<div class="field"><label for="cit-base">과세표준</label><input type="text" inputmode="numeric" id="cit-base" value="300,000,000"><span class="hint">이월결손금을 뺀 뒤의 금액</span></div>' +
        '<div class="field"><label for="cit-year">사업연도</label><select id="cit-year"><option value="2026" selected>2026년 이후 개시</option><option value="2025">2023 ~ 2025년 개시</option></select></div>' +
      '</form><div id="cit-out"></div></div></section>' +

      '<section class="tool" id="t-vat"><h2>부가세</h2>' +
      '<div class="tool-body"><form onsubmit="return false">' +
        '<div class="field"><label for="vat-sales">과세기간 매출 합계 (부가세 포함)</label><input type="text" inputmode="numeric" id="vat-sales" value="55,000,000"></div>' +
        '<div class="field"><label for="vat-buy">공제 가능한 매입 합계 (부가세 포함)</label><input type="text" inputmode="numeric" id="vat-buy" value="22,000,000"><span class="hint">세금계산서, 사업용 카드 등으로 받은 것 중 불공제 항목 제외</span></div>' +
      '</form><div id="vat-out"></div></div></section>' +
      '<section class="tool" id="t-dil"><h2>투자 후 지분율</h2>' +
      '<div class="tool-body"><form onsubmit="return false">' +
        '<div class="field"><label for="dil-pre">프리머니 (투자 전 기업가치)</label><input type="text" inputmode="numeric" id="dil-pre" value="4,000,000,000"></div>' +
        '<div class="field"><label for="dil-inv">투자금</label><input type="text" inputmode="numeric" id="dil-inv" value="1,000,000,000"></div>' +
        '<div class="field"><label for="dil-shares">투자 전 발행주식 총수</label><input type="text" inputmode="numeric" id="dil-shares" value="100,000"></div>' +
        '<div class="field"><label for="dil-mine">내 보유 주식 수</label><input type="text" inputmode="numeric" id="dil-mine" value="50,000"></div>' +
        '<div class="field"><label for="dil-pool">스톡옵션 풀 (투자 후 지분율 %)</label><input type="number" step="0.5" min="0" max="50" id="dil-pool" value="0"><span class="hint">투자 전에 새로 떼어 두는 물량. 프리머니에 포함하는 방식으로 계산</span></div>' +
      '</form><div id="dil-out"></div></div></section>' +
      '</div>';

    function num(id) { return +String(document.getElementById(id).value).replace(/[^0-9]/g, '') || 0; }
    function bindMoney(id, fn) {
      var el = document.getElementById(id);
      el.addEventListener('input', function () {
        var n = num(id);
        el.value = n ? n.toLocaleString('ko-KR') : '';
        fn();
      });
    }

    function updIns() {
      var pay = num('ins-pay');
      var ceo = document.querySelector('input[name="ins-who"]:checked').value === 'ceo';
      var sj = parseFloat(document.getElementById('ins-sj').value) || 0;
      var r = insuranceCalc(pay, ceo, sj);
      document.getElementById('ins-out').innerHTML =
        '<div class="table-wrap"><table><thead><tr><th>항목</th><th class="r">근로자 부담</th><th class="r">회사 부담</th><th>비고</th></tr></thead><tbody>' +
        r.rows.map(function (x) { return '<tr><td>' + x[0] + '</td><td class="r">' + won(x[1]) + '</td><td class="r">' + won(x[2]) + '</td><td class="muted">' + esc(x[3]) + '</td></tr>'; }).join('') +
        '<tr class="total"><td>합계</td><td class="r">' + won(r.worker) + '</td><td class="r">' + won(r.company) + '</td><td></td></tr>' +
        '</tbody></table></div>' +
        '<p>회사가 매달 쓰는 인건비는 월 보수 ' + won(pay) + '원에 회사 부담 ' + won(r.company) + '원을 더한 <strong>' + won(pay + r.company) + '원</strong>입니다. 근로자가 받는 금액은 여기서 근로자 부담분과 소득세, 지방소득세를 뺀 금액입니다.</p>' +
        '<p class="muted">국민연금 기준소득월액 상한 637만원, 하한 40만원은 2025년 7월부터 2026년 6월까지 적용 기준입니다.</p>';
    }
    function updCit() {
      var base = num('cit-base');
      var year = document.getElementById('cit-year').value;
      var r = citCalc(base, year);
      document.getElementById('cit-out').innerHTML =
        '<div class="table-wrap"><table><thead><tr><th>구간</th><th class="r">세율</th><th class="r">세액</th></tr></thead><tbody>' +
        r.rows.map(function (x) {
          return '<tr><td>' + (x[0] ? eok(x[0]) + ' 초과 ' : '') + eok(x[1]) + '원 이하</td><td class="r">' + Math.round(x[2] * 100) + '%</td><td class="r">' + won(x[3]) + '</td></tr>';
        }).join('') +
        '<tr class="total"><td>법인세 산출세액</td><td></td><td class="r">' + won(r.total) + '</td></tr>' +
        '<tr><td>법인지방소득세 (대략 10%)</td><td></td><td class="r">' + won(Math.floor(r.total * 0.1)) + '</td></tr>' +
        '</tbody></table></div>' +
        '<p class="muted">감면, 공제, 최저한세, 가산세는 반영하지 않은 금액입니다. 구간 표시는 과세표준 금액 기준입니다.</p>';
    }
    function updVat() {
      var s = num('vat-sales'), b = num('vat-buy');
      var sTax = Math.round(s / 11), bTax = Math.round(b / 11);
      var pay = sTax - bTax;
      document.getElementById('vat-out').innerHTML =
        '<div class="table-wrap"><table><thead><tr><th></th><th class="r">공급가액</th><th class="r">세액</th></tr></thead><tbody>' +
        '<tr><td>매출</td><td class="r">' + won(s - sTax) + '</td><td class="r">' + won(sTax) + '</td></tr>' +
        '<tr><td>매입 (공제분)</td><td class="r">' + won(b - bTax) + '</td><td class="r">' + won(bTax) + '</td></tr>' +
        '<tr class="total"><td>' + (pay >= 0 ? '납부할 세액' : '환급받을 세액') + '</td><td></td><td class="r">' + won(Math.abs(pay)) + '</td></tr>' +
        '</tbody></table></div>' +
        '<p class="muted">부가세 포함 금액의 11분의 1로 계산했습니다. 영세율, 면세 매출, 신용카드 발행세액공제 등은 반영하지 않았습니다.</p>';
    }

    bindMoney('ins-pay', updIns);
    document.querySelectorAll('input[name="ins-who"]').forEach(function (el) { el.addEventListener('change', updIns); });
    document.getElementById('ins-sj').addEventListener('input', updIns);
    bindMoney('cit-base', updCit);
    document.getElementById('cit-year').addEventListener('change', updCit);
    bindMoney('vat-sales', updVat);
    bindMoney('vat-buy', updVat);
    function updDil() {
      var pre = num('dil-pre'), inv = num('dil-inv'), s0 = num('dil-shares'), mine = num('dil-mine');
      var pool = (parseFloat(document.getElementById('dil-pool').value) || 0) / 100;
      var out = document.getElementById('dil-out');
      var post = pre + inv;
      if (!pre || !s0 || post <= 0 || pool + inv / post >= 1) {
        out.innerHTML = '<p class="muted">프리머니와 발행주식 수를 입력하세요. 스톡옵션 풀과 투자자 지분율의 합은 100%보다 작아야 합니다.</p>';
        return;
      }
      var total = s0 / (1 - pool - inv / post);
      var price = post / total;
      var newSh = Math.floor(inv / price);
      var poolSh = Math.round(total * pool);
      var tot = s0 + poolSh + newSh;
      function pct(n) { return (Math.round(n * 1000) / 10).toFixed(1) + '%'; }
      out.innerHTML =
        '<div class="table-wrap"><table><thead><tr><th>항목</th><th class="r">값</th></tr></thead><tbody>' +
        '<tr><td>포스트머니</td><td class="r">' + won(post) + '원</td></tr>' +
        '<tr><td>주당 발행가</td><td class="r">' + won(price) + '원</td></tr>' +
        '<tr><td>투자자 신주</td><td class="r">' + won(newSh) + '주</td></tr>' +
        (poolSh ? '<tr><td>스톡옵션 풀</td><td class="r">' + won(poolSh) + '주</td></tr>' : '') +
        '<tr><td>투자 후 총 주식</td><td class="r">' + won(tot) + '주</td></tr>' +
        '<tr><td>투자자 지분율</td><td class="r">' + pct(newSh / tot) + '</td></tr>' +
        '<tr><td>내 지분율</td><td class="r">' + pct(mine / s0) + ' → ' + pct(mine / tot) + '</td></tr>' +
        '<tr class="total"><td>내 보유 주식 가치</td><td class="r">' + won(mine * price) + '원</td></tr>' +
        '</tbody></table></div>' +
        '<p class="muted">신주 수는 1주 미만을 버렸습니다. 우선주 전환 비율, 리픽싱, 기존 스톡옵션은 반영하지 않았습니다.</p>';
    }
    ['dil-pre', 'dil-inv', 'dil-shares', 'dil-mine'].forEach(function (id) { bindMoney(id, updDil); });
    document.getElementById('dil-pool').addEventListener('input', updDil);

    updIns(); updCit(); updVat(); updDil();
  }

  /* ---------- 용어 ---------- */
  function renderGlossary() {
    var cats = [];
    window.GLOSSARY.forEach(function (g) { if (cats.indexOf(g[2]) < 0) cats.push(g[2]); });
    var cur = '전체';

    main.innerHTML =
      '<div class="page">' +
      '<h1>용어</h1>' +
      '<p class="lead">세무사와 대화하거나 홈택스 화면을 볼 때 자주 나오는 말을 모았습니다.</p>' +
      '<input type="search" class="gloss-search" id="g-q" placeholder="용어나 설명으로 검색" aria-label="용어 검색">' +
      '<div class="gloss-filter" id="g-cat">' + ['전체'].concat(cats).map(function (c) {
        return '<button type="button" data-c="' + esc(c) + '"' + (c === cur ? ' class="active"' : '') + '>' + esc(c) + '</button>';
      }).join('') + '</div>' +
      '<p class="muted" id="g-count"></p><dl class="gloss" id="g-list"></dl></div>';

    function draw() {
      var q = document.getElementById('g-q').value.trim().toLowerCase();
      var rows = window.GLOSSARY.filter(function (g) {
        if (cur !== '전체' && g[2] !== cur) return false;
        if (!q) return true;
        return (g[0] + ' ' + g[1] + ' ' + g[3]).toLowerCase().indexOf(q) >= 0;
      }).sort(function (a, b) { return a[0].localeCompare(b[0], 'ko'); });
      document.getElementById('g-count').textContent = rows.length + '개';
      document.getElementById('g-list').innerHTML = rows.map(function (g) {
        var ch = chapterById(g[4]);
        return '<div><dt>' + esc(g[0]) + (g[1] ? '<small>' + esc(g[1]) + '</small>' : '') + '</dt><dd>' + esc(g[3]) +
          (ch ? ' <a href="#ch-' + ch.id + '">' + ch.no + '장에서 보기</a>' : '') + '</dd></div>';
      }).join('') || '<div><dd>검색 결과가 없습니다.</dd></div>';
    }
    document.getElementById('g-q').addEventListener('input', draw);
    document.getElementById('g-cat').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      cur = b.getAttribute('data-c');
      this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('active', x === b); });
      draw();
    });
    draw();
  }

  /* ---------- 체크리스트 ---------- */
  function renderChecklist() {
    var groups = window.CHECKLIST.map(function (g, gi) {
      var done = 0;
      var items = g.items.map(function (it, ii) {
        var key = gi + '-' + ii;
        if (state.check[key]) done++;
        var ch = chapterById(it[2]);
        return '<li><label><input type="checkbox" data-k="' + key + '"' + (state.check[key] ? ' checked' : '') + '>' +
          '<span><span class="t">' + esc(it[0]) + '</span>' +
          '<span class="sub">' + (it[1] ? esc(it[1]) + ' ' : '') + (ch ? '<a href="#ch-' + ch.id + '">' + ch.no + '장</a>' : '') + '</span></span></label></li>';
      }).join('');
      return '<section class="check-group"><h2>' + esc(g.group) + ' <span>' + done + ' / ' + g.items.length + '</span></h2><ul class="check-list">' + items + '</ul></section>';
    }).join('');

    main.innerHTML =
      '<div class="page">' +
      '<h1>설립 체크리스트</h1>' +
      '<p class="lead">법인 설립 전후로 세무와 관련해 챙길 일입니다. 체크한 내용은 이 브라우저에 저장됩니다.</p>' +
      groups +
      '<button type="button" class="btn text" id="check-reset">체크 모두 해제</button></div>';

    main.querySelectorAll('input[data-k]').forEach(function (el) {
      el.addEventListener('change', function () {
        var k = el.getAttribute('data-k');
        if (el.checked) state.check[k] = true; else delete state.check[k];
        save();
        var sec = el.closest('.check-group');
        var total = sec.querySelectorAll('input').length;
        var on = sec.querySelectorAll('input:checked').length;
        sec.querySelector('h2 span').textContent = on + ' / ' + total;
      });
    });
    document.getElementById('check-reset').addEventListener('click', function () {
      state.check = {};
      save();
      renderChecklist();
    });
  }

  function renderNotFound() {
    main.innerHTML = '<div class="page"><h1>페이지를 찾을 수 없습니다</h1><p><a href="#home">학습 현황으로 돌아가기</a></p></div>';
  }

  /* ---------- 라우팅 ---------- */
  function parse() {
    var h = location.hash.replace(/^#\/?/, '');
    if (!h || h === 'home') return { name: 'home' };
    var m = h.match(/^ch[-\/](.+)$/);
    if (m) return { name: 'chapter', id: m[1] };
    if (['calendar', 'tools', 'glossary', 'checklist'].indexOf(h) >= 0) return { name: h };
    return { name: '404' };
  }
  var TITLES = { home: '학습 현황', calendar: '세무 일정', tools: '계산기', glossary: '용어', checklist: '설립 체크리스트' };

  /* 좁은 화면에서 표를 세로로 펼칠 수 있도록 칸마다 머리글을 붙인다.
     숫자 표, 행 병합이 있는 표, 두 칸짜리 표는 그대로 가로 스크롤 */
  function prepareTables() {
    main.querySelectorAll('table').forEach(function (t) {
      var ths = t.querySelectorAll('thead th');
      if (ths.length < 3 || t.querySelector('[rowspan],[colspan]') || t.classList.contains('journal')) return;
      var numeric = 0;
      ths.forEach(function (th) { if (th.classList.contains('r')) numeric++; });
      if (numeric >= 2 && ths.length < 4) return;
      var labels = Array.prototype.map.call(ths, function (th) { return th.textContent.trim(); });
      t.querySelectorAll('tbody tr').forEach(function (tr) {
        Array.prototype.forEach.call(tr.children, function (td, i) { if (labels[i]) td.setAttribute('data-label', labels[i]); });
      });
      t.classList.add('stack');
    });
  }

  function route() {
    var r = parse();
    renderSidebar(r);
    if (r.name === 'home') renderHome();
    else if (r.name === 'chapter') renderChapter(r.id);
    else if (r.name === 'calendar') renderCalendar();
    else if (r.name === 'tools') renderTools();
    else if (r.name === 'glossary') renderGlossary();
    else if (r.name === 'checklist') renderChecklist();
    else renderNotFound();
    prepareTables();

    var c = r.name === 'chapter' ? chapterById(r.id) : null;
    document.title = (c ? c.no + '. ' + c.title : (TITLES[r.name] || '창업 세무회계 노트')) + ' | 창업 세무회계 노트';
    document.body.classList.remove('nav-open');
    document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
  }

  var lastHash = null;
  window.addEventListener('hashchange', function () {
    route();
    if (location.hash !== lastHash) { window.scrollTo(0, 0); main.focus({ preventScroll: true }); }
    lastHash = location.hash;
  });
  document.querySelector('.menu-toggle').addEventListener('click', function () {
    var open = document.body.classList.toggle('nav-open');
    this.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.getElementById('scrim').addEventListener('click', function () {
    document.body.classList.remove('nav-open');
    document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
  });
  main.addEventListener('click', function () {
    if (document.body.classList.contains('nav-open')) {
      document.body.classList.remove('nav-open');
      document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
    }
  });

  lastHash = location.hash;
  route();
})();
