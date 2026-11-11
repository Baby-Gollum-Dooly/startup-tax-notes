/*
 * 12월 결산 법인 기준 반복 세무 일정
 * month: 1 ~ 12, 0이면 매월 / day: 날짜 또는 'end'(말일)
 * from, until: 'YYYY-MM' 형식. 이 기간에 해당하는 기한만 표시
 */
export const DEADLINES = [
  {
    "month": 0,
    "day": 10,
    "title": "원천세 신고납부",
    "note": "매월 납부 사업장. 반기납부는 1월, 7월만",
    "chapter": "payroll",
    "repeat": "monthly"
  },
  {
    "month": 0,
    "day": 10,
    "title": "4대보험료 납부",
    "note": "전월분",
    "chapter": "payroll",
    "repeat": "monthly"
  },
  {
    "month": 0,
    "day": "end",
    "title": "사업소득, 기타소득 간이지급명세서 제출",
    "note": "전월에 프리랜서 등에게 지급한 경우",
    "chapter": "payroll",
    "repeat": "monthly"
  },
  {
    "month": 1,
    "day": 10,
    "title": "원천세 반기납부",
    "note": "전년 7월 ~ 12월분, 승인받은 사업장",
    "chapter": "payroll"
  },
  {
    "month": 1,
    "day": 25,
    "title": "부가세 2기 확정신고",
    "note": "전년 10월 ~ 12월",
    "chapter": "vat"
  },
  {
    "month": 2,
    "day": "end",
    "title": "이자, 배당, 기타소득 지급명세서 제출",
    "note": "전년 지급분",
    "chapter": "payroll"
  },
  {
    "month": 3,
    "day": 10,
    "title": "근로소득, 퇴직소득 지급명세서 제출",
    "note": "연말정산 결과 포함",
    "chapter": "payroll"
  },
  {
    "month": 3,
    "day": 10,
    "title": "건강보험 보수총액 신고",
    "note": "근로소득 간이지급명세서를 냈다면 신고한 것으로 봄. 미제출이나 오류가 있을 때만 신고",
    "chapter": "payroll"
  },
  {
    "month": 3,
    "day": 15,
    "title": "고용보험, 산재보험 보수총액 신고",
    "note": "근로복지공단",
    "chapter": "payroll"
  },
  {
    "month": 3,
    "day": 31,
    "title": "법인세 신고납부",
    "note": "성실신고확인 대상은 4월 30일",
    "chapter": "cit"
  },
  {
    "month": 4,
    "day": 25,
    "title": "부가세 1기 예정신고",
    "note": "1월 ~ 3월. 예정고지 대상은 고지서 납부",
    "chapter": "vat"
  },
  {
    "month": 4,
    "day": 30,
    "title": "법인지방소득세 신고납부",
    "note": "성실신고확인 법인은 5월 31일. 사업장이 여러 지자체면 나눠 신고",
    "chapter": "cit"
  },
  {
    "month": 5,
    "day": 31,
    "title": "종합소득세 신고납부",
    "note": "대표 개인. 배당, 근로 외 소득이 있는 경우",
    "chapter": "payroll"
  },
  {
    "month": 7,
    "day": 10,
    "title": "원천세 반기납부",
    "note": "1월 ~ 6월분, 승인받은 사업장",
    "chapter": "payroll"
  },
  {
    "month": 7,
    "day": 25,
    "title": "부가세 1기 확정신고",
    "note": "4월 ~ 6월",
    "chapter": "vat"
  },
  {
    "month": 8,
    "day": 31,
    "title": "법인세 중간예납",
    "note": "설립 첫해 없음. 50만원 미만 중소기업 면제",
    "chapter": "cit"
  },
  {
    "month": 10,
    "day": 25,
    "title": "부가세 2기 예정신고",
    "note": "7월 ~ 9월. 예정고지 대상은 고지서 납부",
    "chapter": "vat"
  },
  {
    "month": 8,
    "day": 31,
    "title": "주민세 사업소분 신고납부",
    "note": "7월 1일 기준 사업소. 위택스",
    "chapter": "taxmap"
  },
  {
    "month": 6,
    "day": 30,
    "title": "해외금융계좌 신고",
    "note": "전년 매월 말일 중 하루라도 해외 계좌 잔액 합계가 5억원을 넘은 경우",
    "chapter": "overseas"
  },
  {
    "month": 7,
    "day": "end",
    "title": "근로소득 간이지급명세서 제출",
    "note": "상반기 지급분. 2026년까지 반기 제출",
    "chapter": "payroll",
    "until": "2026-12"
  },
  {
    "month": 1,
    "day": "end",
    "title": "근로소득 간이지급명세서 제출",
    "note": "전년 하반기 지급분",
    "chapter": "payroll",
    "until": "2027-01"
  },
  {
    "month": 0,
    "day": "end",
    "title": "근로소득 간이지급명세서 제출",
    "note": "전월 지급분. 2027년 1월 지급분부터 매월 제출",
    "chapter": "payroll",
    "from": "2027-02"
  }
];

/* 기한 연기 계산용 공휴일. 토, 일은 코드에서 처리. 해마다 추가
   출처: 한국천문연구원 월력요항, 인사혁신처 보도자료(2026.4.28 노동절, 제헌절 공휴일 지정) */
export const HOLIDAYS = {
  "2026": [
    "01-01",
    "02-16",
    "02-17",
    "02-18",
    "03-02",
    "05-01",
    "05-05",
    "05-25",
    "06-03",
    "06-06",
    "07-17",
    "08-17",
    "09-24",
    "09-25",
    "09-28",
    "10-05",
    "10-09",
    "12-25"
  ],
  "2027": [
    "01-01",
    "02-06",
    "02-08",
    "02-09",
    "03-01",
    "05-03",
    "05-05",
    "05-13",
    "06-06",
    "07-19",
    "08-16",
    "09-14",
    "09-15",
    "09-16",
    "10-04",
    "10-11",
    "12-27"
  ]
};
