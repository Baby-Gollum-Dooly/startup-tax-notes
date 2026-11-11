# 창업 세무회계 노트

법인을 세우고 운영하는 대표가 알아야 할 세무, 회계 내용을 23개 장으로 정리한 학습 사이트.

배포 주소: https://startup-tax-notes.vercel.app

## 구성

- 설립 전, 회계 기초, 세금, 운영, 투자와 상장, 확장과 정리 6개 묶음
- 장마다 확인 문제와 공식 확인처 링크
- 세무 일정: 12월 결산 법인 기준, 주말과 공휴일이면 다음 영업일로 표시
- 계산기: 4대보험료, 법인세 산출세액, 부가세, 투자 후 지분율
- 용어 96개, 설립 체크리스트
- 학습 기록은 브라우저 localStorage에 저장
- 375px 폭 휴대폰 화면 대응

## 실행

Node 18 이상. 외부 패키지 없음.

```bash
npm run build   # dist/에 정적 페이지 생성
npm start       # http://localhost:3000 미리보기
npm run dev     # 빌드 후 바로 미리보기
```

## 주소

| 주소 | 페이지 |
|---|---|
| `/` | 학습 현황 |
| `/chapters/{id}` | 챕터 본문. 예: `/chapters/vat` |
| `/calendar` | 세무 일정 |
| `/tools` | 계산기 |
| `/glossary` | 용어 |
| `/checklist` | 설립 체크리스트 |

예전 주소(`/#ch-vat`, `/#tools`)로 들어오면 새 주소로 이동함.

## 폴더 구조

```
scripts/
  build.mjs              빌드. 콘텐츠 검사 후 dist/ 생성
  serve.mjs              로컬 미리보기 서버
src/
  content/
    chapters/NN-id.mjs   챕터 1개당 파일 1개. 파일 앞 번호가 장 순서
    parts.mjs            목차 묶음 순서
    glossary.mjs         용어
    schedule.mjs         세무 일정, 공휴일
    checklist.mjs        체크리스트
  templates/
    layout.mjs           공통 틀 (상단 바, 목차, 푸터)
    pages/*.mjs          페이지별 HTML
  client/
    common.mjs           모든 페이지 공통 동작
    store.mjs            학습 기록 저장
    pages/*.mjs          페이지별 브라우저 스크립트
  lib/
    html.mjs             공통 문자열 도구, 메뉴
    schedule.mjs         기한 계산 (빌드와 브라우저 공용)
    calc.mjs             계산기 공식과 요율
  styles/                tokens, base, layout, content, components, pages, responsive, print
vercel.json              빌드 명령, 출력 폴더, 확장자 없는 주소 설정
```

## 내용 수정

- 챕터 수정: `src/content/chapters/`의 해당 파일
- 챕터 추가: `NN-id.mjs` 형식으로 파일 추가. 순서를 바꾸려면 파일 앞 번호 조정
- 세율, 요율: 본문은 챕터 파일, 계산기는 `src/lib/calc.mjs`
- 해가 바뀌면 `src/content/schedule.mjs`의 `HOLIDAYS`에 그해 공휴일 추가
- 빌드할 때 없는 챕터 링크, 퀴즈 정답 범위, 가운뎃점 사용을 검사하고 문제가 있으면 빌드 실패

## 배포

main 브랜치에 머지되면 Vercel이 `npm run build` 후 `dist/`를 배포.

## 주의

일반적인 학습용 정리이며 기준일은 2026년 11월. 실제 신고 전에는 국세청 홈택스, 국가법령정보센터, 담당 세무사를 통해 확인.
