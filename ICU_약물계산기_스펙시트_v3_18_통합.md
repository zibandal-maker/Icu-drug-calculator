# ICU 약물 계산기 — 통합 스펙시트 v3.18
**단일 진실 원천(Single Source of Truth)** | 파일: `icu_drug_calculator.html` (배포본 `index.html`)
크기: ~465K자(~498KB) | 배포: https://icu-drug-calculator.vercel.app/

> ## v3.18 변경 — Play 정식 출시 대응 + 감사 P1 + 규제 포지셔닝 (2026-10-29)
> **배경**: Play 프로덕션 승격(`kr.icucalc.twa`). 웹↔앱 연결, 7월 감사(감사리포트_20260708) P1 미반영분 처리,
> 식약처 「전문가용 디지털의료기기소프트웨어 허가·심사 가이드라인」(2026-09-30, 약물 용량 판단 SW 예시) 대응 문구 정리.
>
> ### 앱 스토어 링크 (단일 소스)
> | 항목 | 내용 |
> |------|------|
> | **`APP_LINKS`** (head) | 플랫폼별 `{id, enabled, store, appName, packageName, storeBase, utm}`. 스토어 URL은 `appStoreUrl(platformId, placement)`로만 생성 → placement별 Play 설치 리퍼러(UTM: `utm_medium=banner|header|footer`) |
> | **`APP_PROMO`** | `bannerId·dismissKey·inAppKey` + `placements{banner:[android], header:[android,desktop], footer:[android,desktop,ios]}` + `text{}` 문구 |
> | **노출 마크업** | `[data-applink][data-placement]` / `[data-applink-wrap]` / `[data-app-text]` / `[data-app-dismiss]` — `AppPromo` 모듈이 설정 읽어 href·문구·표시 제어 |
> | **앱 내부 숨김** | `document.referrer`가 `android-app://<packageName>` 또는 `display-mode: standalone` → sessionStorage `icucalc-in-app`=1, 전 위치 숨김 |
> | **설치자 숨김** | `navigator.getInstalledRelatedApps()` (manifest `related_applications` + `prefer_related_applications:false`) |
> | **배너** | 구 `#notice-androidbeta`(베타 모집) → `#notice-app-android`(정식 출시). dismiss 키 신규(`icucalc-notice-app-android`) |
> | **헤더** | `.hdr-app` — 데스크톱 전용(≤480px 숨김: 320–360px 제목 잘림 방지) |
> | **SEO** | `MobileApplication` JSON-LD를 APP_LINKS에서 생성·주입. sitemap lastmod 2026-10-29 |
> | **주의** | `manifest.json`은 정적 파일이라 패키지명 중복 기재 — APP_LINKS 변경 시 동기화 |
>
> ### 감사 P1 (터치 기기 전용 `@media (hover:none) and (pointer:coarse)` — 데스크톱 무변경)
> | 항목 | 변경 | 검증 |
> |------|------|------|
> | 핀치줌 | viewport `maximum-scale=1.0` 제거 | meta 확인 |
> | 입력 ≥16px | 일괄 16px !important (iOS 포커스 확대 방지). 원래 >16px였던 `.tit-val-wrap input`(20)·`.inp-wrap input`(19)은 동일 특이도 체인으로 원값 유지 | 모바일 <16px 입력 0개 |
> | 터치타깃 | `.tit-btn` 33→40px(+`::after` 히트 44px), `.tab` min-h 40, `.ftab` 34, `.qbtn` 30, `.pt-wt-step` 높이 40(폭 유지 — 320px 줄바꿈 방지) | 320/360/390 가로넘침 0, 환자행 폭 무변화 |
> | Propofol PRIS | `c-prop.dose.thresholds`: 4 caution(>48h PRIS·TG/CK/젖산/K/ECG) · 5 danger(상한 초과) + `#prop-warn` + `cProp`→`renderDoseWarn` | 2=없음/4/5 PASS |
>
> ### 규제 포지셔닝 문구 (앱 자체 화법: 제안·추천 → 참고 고려사항)
> - Vent: "ABGA 기반 Ventilator 조정 제안" → "참고 고려사항", 배지 보조→참고, 안내문 "다음 조정 방향을 제안" → "가이드라인상 고려사항을 표시", beta 배너·disclaimer·빈상태 문구 동일 기조
> - CRRT: "추천 용액" → "조성 일치 용액 (참고)", beta 배너 "계산·추천 값" → "계산·표시 값", "결정은 담당 의료진 판단"
> - footer 면책에 **사용 목적(intended use)** 명시: 공개 수치를 입력값으로 계산·표시하는 참고 도구, 진단·치료 결정 비대체
> - **미처리(임상 판단 필요)**: VENT_SUGGEST 룰 개별 메시지·CRRT 백 자동선택 로직 자체는 유지. 공개 배포 유지 여부·식약처 해당여부 질의는 별도 결정
>
> ### 검증
> 10개 탭 전체 결과 텍스트 old/new 동일(무회귀), JS 오류 0, 데스크톱 tit-btn 33px·입력 원크기 유지, Android/iOS/320 시나리오 7종(배너·헤더·footer·TWA 숨김) PASS.
>
> ### 배포
> 변경 파일: `index.html`, `manifest.json`, `sitemap.xml` → GitHub 업로드 → Vercel. 백업: `index_backup_pre_applinks_20261029.html`, `index_backup_pre_p1_v318_20261029.html`, `manifest_backup_pre_applinks_20261029.json`.
>
> ---
>
> ## v3.17 변경 — Pentobarbital 진정 탭 추가 (이번 세션)
> **피드백**: 진정 약물에 **펜토바르비탈** 추가 요청(용량·속도계산 + 기본 프로토콜 + 커스텀). 난치성 뇌전증지속상태(RSE)·
> 난치성 두개내압 상승의 **바르비투르 혼수(burst suppression 목표)**용. midaz/prop의 검증된 dc 패턴에 맞춰 추가.
>
> ### v3.17 작업 요약 (jsdom 검증 완료 + 무회귀)
> | 작업 | 내용 | 검증 |
> |------|------|------|
> | **c-pento 신설** | sd 탭 dc 약물. `dose:{ default:1, unit:'mg/kg/hr', min:0.5, max:5, conc:8, concUnit:'mg', mode:'wt_hr', load:{...} }` + `mapId:'drug:pentobarbital'` | dose:{ default: 19→20, mapId 20→21 |
> | **로딩·프로토콜 DATA화** | 로딩 용량(5/10/15)·통상(10)·최대주입속도(50 mg/min)·바이알농도(50)·돌발(5)을 `dose.load` 객체에 보유 (하드코딩 회피) | 로딩그리드 700mg/14mL |
> | **UI (기존 진정제 동형)** | 로딩 그리드 + 지속주입(믹스 400mg/50mL=8mg/mL 기본 + 커스텀 mix-panel + 슬라이더 0.5–5 + 적정 ±0.5 + qbtns) + 기본 프로토콜 배너 + 희석/부작용 경고 | res 렌더·slider 동기 |
> | **cPento** | `doseMeta('c-pento')` 읽어 로딩그리드(load.mgkg) + `d×bwt/getConc`=mL/hr(mode wt_hr) | 8.75/43.75/4.375 mL/hr PASS |
> | **엔진 등록** | calcMap `'pento':'cPento'`, boot sliders + 세션복원 slPairs `['pento-d','pento-sl']`, updateAll에 cPento() | 체중연동·커스텀재계산·복원 PASS |
>
> ### 기본 프로토콜(RSE) — 근거
> - **로딩** 5–15 mg/kg(통상 10) ≤50 mg/min → **유지** 0.5 mg/kg/hr 시작, q1h 0.5씩 증량하여 **burst suppression(15초당 2–3 bursts)** 도달(최대 5, 일부 프로토콜 4). 돌발발작 시 5 mg/kg 재볼루스. burst suppression 후 ≥48h 유지, cEEG q6h.
> - **바이알 50 mg/mL** — 인퓨전은 D5W/NS로 **4–8 mg/mL 희석**(>8 침전). 앱 기본 8 mg/mL(400mg/50mL). 저혈압·심억제·장마비 흔함(승압제 필요 가능).
> - 근거: Neurocritical Care Society SE 2012 · surgicalcriticalcare.net SE 2025 · medicine.com/FDA(Nembutal 50mg/mL, 희석 4–8mg/mL) · StatPearls NBK545288.
> - 검증값(70kg, 8 mg/mL): 1 mg/kg/hr → 8.75 mL/hr · 5 → 43.75 · 0.5 → 4.375 / 로딩 10mg/kg → 700mg=14mL / 커스텀 5mg/mL@1 → 14 mL/hr.
>
> ### 배포 메모
> - 이번 세션은 클라우드 컨테이너 재활용 후 **git proxy**가 적용되어 토큰-URL push가 차단됨(authorized repo 아님). GitHub 웹 업로드("Add files via upload")로 반영(직전 3a0ea8f도 동일 방식). 소스=GitHub, Vercel 자동배포.
> - 편집 기준 실측: `dose:{ default:` 20 · `mapId:'drug:` 21 · `<script` 6.
>
> ---
>
> ## v3.16 변경 — 저나트륨혈증 교정 수액 적합성 가드 (이전 세션)
> **피드백**: "0.9% NS일 때 교정 수액 속도가 과도하게 나온다". **검증 결과 계산식(Adrogué-Madias)은 정확**하나
> (3% saline은 교과서적 55/82/109 mL/hr로 정상, 앱 출력=독립계산 100% 일치), **수액 적합성 가드 부재 + 방향성 버그**가 원인.
>
> ### 근본 원인 (jsdom 재현)
> | 시나리오 | 기존 출력 | 문제 |
> |---------|----------|------|
> | 0.9% NS, Na 120→128, 70kg | 632 / 949 / 1265 mL/hr | ΔNa/L=0.79로 작아 A-M이 거대값 산출(수학적으론 정확) |
> | NS, Na 150 (수액 오선택) | 5,375 / 8,063 / 10,750 mL/hr | fluidNa 근접 시 발산 |
> | NS, Na 153 | 21,500 / 43,000 mL/hr | 무한 발산(가드 없음) |
> | D5W(Na 0)로 저Na "상승" | 양수 속도 표시 | **`Math.abs(deltaPerL)` 방향성 버그** — 실제론 Na 하강 수액인데 상승속도 표기 |
>
> ### 수정 (가산·DATA 기반, A-M 계산식 무손상 동결)
> | 작업 | 내용 |
> |------|------|
> | **NA_SAFETY.fluidGuard 신설** | `maxRateMlH:500`(실무 상한, 3% saline 통과·NS 플래그) + `wrongDir`·`nsInappropriate`(SIADH desalination)·`amClosedSystem`(폐쇄계 한계) 문구 + 출처 |
> | **방향성 가드** | `needDir`(저Na +1/고Na −1) × deltaPerL = `effPerL`. `effPerL≤0`(교정 방향과 반대 수액)이면 속도 **"부적합"** 표시(기존 abs로 양수 오표기 제거) |
> | **비효율 가드** | `effPerL>0`이나 예측속도 > maxRateMlH이면 `≈N mL/hr ⚠` + 최상단 경고(NS면 desalination 문구 + A-M 폐쇄계 한계) |
> | **경고 최상단 노출** | `fluidGuardMsgs`를 기존 안전메시지 앞에 concat |
>
> ### 검증 (jsdom, 전부 PASS + roc 무회귀)
> - 3% saline: 55/82/109 mL/hr **불변**, 가드 미발동
> - 0.9% NS 저Na: `≈632 mL/hr ⚠` + "비효율 수액"·desalination·폐쇄계 경고 노출
> - half saline(77)·D5W(0)로 저Na 상승: **"부적합"** (방향 반대) — 기존 버그 수정
> - NS로 고Na(150→145) 하강: **"부적합"**(NS는 Na 못 낮춤) / D5W로 고Na 하강: 정상 수치·플래그 없음
> - 근거: A-M 한계 Hanna 2023(PMC10278828) · NS/SIADH desalination(AJKD·PharmacyJoe) · ECPG 2014
>
> ---
>
> ## v3.15 변경 — Rocuronium 지속주입 추가 + 하드코딩 제거 (이전 세션)
> 임상 요청으로 **Rocuronium(에스메론) 지속주입(continuous infusion)** 기능을 추가. 기존 roc 카드는
> bolus 그리드 + **하드코딩된 정보배너(0.3/0.6 mg/kg/hr 리터럴)**만 있었음(§0.2 위반). 이를 vecuronium(bec)의
> 검증된 dc 패턴에 맞춰 **DATA 메타 기반 지속주입 계산기**로 재구성. bolus 그리드는 무손상 유지(가산 원칙).
>
> ### v3.15 작업 요약 (전부 무회귀 검증 완료 — node/jsdom)
> | 작업 | 내용 | 검증 |
> |------|------|------|
> | **roc dose 메타** | `dose:{ default:10, unit:'mcg/kg/min', min:4, max:16, conc:10000, concUnit:'mcg', mode:'wt_min' }` 가산 + `mapId:'drug:rocuronium'` | dose:{ default: 18→19, mapId 19→20 |
> | **하드코딩 제거** | `roc-inf-info` 정보배너의 `0.3 mg/kg/hr`·`0.6 mg/kg/hr` 리터럴 → DATA 메타 + `getConc` 기반 계산으로 대체 | 리터럴 잔존 0 검증 |
> | **지속주입 UI** | bec 동형(농도 원액 10mg/mL 표시 + 커스텀 희석 mix-panel + 슬라이더 4–16 + 적정버튼 ±1 + res-big) + TOF/재분포 안내배너 | roc-res 렌더·slider 동기 |
> | **cRoc 재작성** | bolus 그리드 무손상 유지 + `doseMeta('c-roc')` 읽어 `d×bwt×60/getConc` = mL/hr, note에 mg/kg/hr 병기(d×0.06) | 4.2/6.72/1.68 mL/hr PASS |
> | **엔진 등록** | `toggleCustomMix` calcMap에 `'roc':'cRoc'`, `sliders[]`에 `['roc-d','roc-sl']` 추가. cRoc는 이미 updateAll에 존재 | 체중연동·커스텀재계산 PASS |
>
> ### 용량 근거 (검증된 출처)
> - **FDA 라벨(Pfizer/accessdata)**: 지속주입 초기 10–12 mcg/kg/min(자발회복 확인 후 시작), 임상 범위 **4–16 mcg/kg/min**(성인). 희석 D5W/LR 최대 5 mg/mL, 24h 내 사용. **말초신경자극(TOF) 적정**.
> - **EMCrit IBCC (therapeutic paralysis)**: 시작 ~10 mcg/kg/min(≈0.6 mg/kg/hr), 적정 4–16 mcg/kg/min(0.25–1 mg/kg/hr). **6–9시간 후 요구량 ~40%↓(재분포)**. 목표 TOF 1–2 twitch.
> - ICU 지속주입 실사용 근거: Groetzinger 2021(Ann Pharmacother, PMID 33043678), COVID-era 평가(PMC10064190).
> - 단위: **mcg/kg/min 1차**(FDA·EMCrit·앱 bec와 통일), mg/kg/hr 병기(1 mcg/kg/min = 0.06 mg/kg/hr). **기본 믹스 250mg/50mL = 5 mg/mL(=5000 mcg/mL)** — FDA 안정성 상한 농도·50mL 시린지 기반(원액 10mg/mL 10mL는 지속주입엔 비현실적이라는 임상 피드백 반영). 커스텀 희석 지원.
> - 믹스 표준 참고: ASHP Standardize-4-Safety(원액 10 mg/mL, undiluted) / 병원 프로토콜(VCH 500mg/250mL=2mg/mL) / FDA(≤5 mg/mL 24h 안정) — 병원별 상이, 앱 기본은 5 mg/mL 채택.
> - 검증값(70kg, 5 mg/mL): 10 mcg/kg/min → 8.4 mL/hr(0.60 mg/kg/hr) · 16 → 13.4 · 4 → 3.36 / 커스텀 1mg/mL: 10 mcg/kg/min → 42 mL/hr.
>
> ### 드리프트 관찰 (v3.14 문서 ↔ 실제 index.html)
> - v3.15 편집 시점 실제 파일은 문서의 §10~11 assert 기준값보다 **이미 앞서 있었음**: `<script>` 6개(문서 5), `dose:{ default:` 18개(문서 16), `mapId:'drug:` 19개(문서 17). v3.14~v3.15 사이 미기록 변경 누적. roc 추가분 반영 후 현재 실측: dose 19·mapId 20·script 6.
> - 문자수/바이트수 주의: 실측 len()≈464K자, `wc -c`≈498KB(한글 멀티바이트). 문서 이전 "~442KB"는 갱신.
>
> ---
>
> ## v3.14 변경 — Vent/CRRT 안정화 + 단일 환자 연동 완성 (이전 세션)
> Vent·CRRT 모듈의 실사용 버그 수정과 UX 정리, 그리고 **앱의 출발 원칙(한 환자 체중 → 전 모듈 동시반영)을
> Vent/CRRT까지 확장**. 전 작업 320~2560px 전 폭 × 전 탭 Playwright 회귀 + node 문법 검증.
>
> ### v3.14 작업 요약 (전부 회귀 검증 완료)
> | 작업 | 내용 | 검증 |
> |------|------|------|
> | **RR 미반영 버그** | `calcVentSuggest`가 RR을 읽기만 하고 판정 미사용 → **룰 1b(RR·MV) 신설**. RR>35 빈호흡/<8 저호흡, MV=TV×RR로 >10·<4 L/min 평가. `VENT_SUGGEST.vent`에 `rrLow/rrHigh/rrTachy/mvLow/mvHigh` 추가 | RR 14→40 제안 변화·빈호흡 경고 확인 |
> | **비현실 ΔP 검증** | PEEP≥Plateau(ΔP≤0)·ΔP<5를 "적정" 통과시키던 버그 → 3구간(≤0 입력확인 / <5 측정오류의심 / 5–15 적정 / >15 예후불리). 제안+`calcVentDP` 패널 양쪽. `protect.drivingMin:5` 추가 | ΔP=1·음수 모두 경고 |
> | **IBW 단일화** | 신장·성별이 공용바(vs-height/vs-sex)와 IBW패널(ibw-height/ibwSex) 2곳 이중입력 → **IBW패널 단일 source**. 공용바에서 제거, `calcVentSuggest`가 ibw-height/ibwSex 읽음. cIBW 끝에서 calcVentSuggest 호출 | 신장170→150 IBW카드·제안 동시반응 |
> | **TV 현재값 평가** | TV테이블 위 `tv-current-eval` — 공용바 설정 TV가 IBW 기준 몇 mL/kg인지 실시간(>8 감량/<5.5 부족/6–8 적정). 공용바↔폐보호 시각 연결 | TV 600=9.1/400=6.1 갱신 |
> | **상단 체중 연동** | CRRT가 독립 `crrt-wt`(기본70)로 상단 bwt() 무시 → **updateAll·initCRRT에서 상단 동기화 + 직접입력 override**(dry weight 대응). Vent는 updateAll에 cIBW 추가로 IBW vs 실제체중 갱신 | 상단55→CRRT55·dose반영, override65 유지 |
> | **IBW 좌우 레이아웃** | 세로 3블록(입력→IBW결과→비교) → **좌우 2열**(`.ibw-layout` grid 1.4fr/1fr). 좌=계산+IBW인라인, 우=실제체중vsIBW. 슬라이더 압축, 560px↓ 세로전환 | 데스크탑2열·모바일1열 |
> | **참조표 아코디언** | ARDS 중증도표·FiO₂-PEEP 조합표가 항상 펼침 → `.vent-card-acc` details로 접음(기본 접힘). 참조성 표만, 입력/제안은 유지 | 기본 접힘·rec 백그라운드 동작 |
> | **어조 재작성** | AI투→사무조 전면. `실무`→`국내 일반`, `조언자 역할·병렬 제시`→`함께 보는 참고값`, 명령조(하십시오)→평서, 경고 단정어 완화. 의학 라벨(권장PEEP·VILI 정보)은 보존 | 렌더 정상·정보 보존 |
> | **Vercel Analytics** | 정적HTML 스니펫(`window.va` 스텁+`/_vercel/insights/script.js`) head 삽입. switchTab에 `va('event',{name:'tab_view',data:{tab}})` 탭별 추적 | va 정의·이벤트 발화 |
> | **Beta 태그** | Vent·CRRT에 3중 표시 — 탭버튼 β superscript + 섹션 `.beta-banner` + 재사용 `.beta-tag` | 배너·β 렌더 |
> | **모바일 표 수정** | Vent 표 셀 padding 과대(10px14px) → `.vent-tbl-wrap` + 미디어쿼리(430/359px 축소). 320px 헤더 줄바꿈 | 320px까지 표 수용 |
>
> ### 신규 DATA·CSS·헬퍼 (v3.14)
> - DATA: `VENT_SUGGEST.vent`에 `rrLow/rrHigh/rrTachy/mvLow/mvHigh`, `protect.drivingMin` 추가
> - CSS: `.ibw-layout`·`.vent-card-acc`(+vca-body)·`.beta-tag`·`.beta-banner`·`.vent-tbl-wrap` 모바일쿼리
> - 신규 룰: calcVentSuggest 룰1b(RR/MV) + 압력룰 3구간화 / cIBW에 tv-current-eval + calcVentSuggest 연동
> - 연동: updateAll → crrt-wt 동기화·calcCRRT·cIBW / initCRRT → bwt() 동기화 / recalcVentAll → cIBW 추가
> - 제거: 공용바 `vs-height`·`vs-sex`(IBW패널로 단일화, 죽은 참조 0 확인)
>
> ---
>
> ## v3.13 변경 — 하드코딩 감사 + DATA 단일화 (이전 세션)
> v3.12(스펙 통합) 이후, 하드코딩 감사를 실시하고 발견된 0.2 위반(임상수치 리터럴)을
> **가산·무손상으로 DATA화**. 모든 변경은 jsdom 렌더링으로 무회귀(패치 전후 출력 동일) 검증.
> 새 모듈일수록 모듈화가 좋았고(전해질 A → 약물 C), 모범 패턴(상수객체+출처주석+엔진참조)을
> 구형 모듈에 소급 적용. 향후 임상 임계는 코드가 아닌 DATA만 고치면 됨.
>
> ### v3.13 작업 요약 (전부 무회귀 검증 완료)
> | 작업 | 내용 | 검증 |
> |------|------|------|
> | **P0-1** | 약물 농도·범위 17종(norepi+16) DATA화. `getConc` 폴백 리터럴 + min/max → `DRUGS.dose{}`. **norepi 세팅연동 상한 버그 수정**(농도세팅 norepiFi에 max가 묶여 일반/더블링/Quad 경고 달랐음 → 임상 상한은 농도 무관) | 16종 rate+tag 100% 일치, 3111 케이스 |
> | **다단계경고** | 승압제·강심제 4종(norepi·epi·dobu·dopa)에 `dose.thresholds[]` + `renderDoseWarn` 근거기반 다단계 임상경고 | 경계 트리거 정확, rate 무회귀 |
> | **P0-2** | CRRT 백 선택 임계(K 6.0/4.5/3.5) if-else → `electrolyteBags.selectMatrix` DATA 순회 | 3111 격자 if-else===matrix |
> | **P0-3** | Na 교정 안전가드(ODS 8/6·뇌부종 10/0.5·수액Na 513·정상범위 135/145) → `NA_SAFETY{}`. **고위험군 분기**(체크 시 24h≤6)·48h 한계(18)·ODS 지연성 신규 | 표준위험 무회귀, 고위험 분기 작동 |
> | **P1** | ABGA(Winter's·AG·보상식·delta) → `ABGA_C{}` 신설. CorrCa `severeAlbCut`, 4-2-1 `FLUID_421`, Osm/CrCl 문구 리터럴 DATA 주입 | ABGA·CorrCa·Osm·CrCl 출력 동일 |
> | **mapId** | 약물 17종에 `mapId:'drug:<성분>'` 전역 ID 매핑 가산(통합 대비) | — |
>
> ### 신규 DATA 객체·헬퍼 (v3.13)
> - DATA: `NA_SAFETY`, `ABGA_C`, `FLUID_421` 신설 / `CORR_CA.severeAlbCut`·`CRRT.electrolyteBags.selectMatrix` 필드 추가
> - 헬퍼: `drugById(id)`·`doseMeta(id)`·`renderDoseWarn(el,id,dose)` (DRUGS dose 메타 읽기)
> - DRUGS 확장: `dose:{default,unit,min,max,conc,concUnit,mode,thresholds[]}` + `mapId`
>
> ---
>
> ## v3.12 기반 — 스펙 통합 (이전 세션)
> 분산되어 있던 3개 스펙시트(메인 v3.4 · CRRT v0.4 · Vent v0.2)와,
> **스펙에는 없으나 실제 배포 코드(v3.11)에만 반영된 변경점**을 단일 문서로 통합.
> 모든 항목은 **실제 HTML 소스(`index.html`) grep/node 검증 기준**으로 작성됨 (스펙 문서가 아닌 구현 기준).
>
> ### 통합 시 정정된 스펙↔코드 드리프트 (검증 완료)
> | 영역 | 구 스펙 표기 | 실제 코드 (검증) | 처리 |
> |------|------------|----------------|------|
> | 버전 | 메인 v3.4 | 코드 v3.11 (v3.5~v3.11 누락) | **v3.12로 통합** |
> | 전해질·대사 | "로드맵 제안(우선1)" | **이미 전부 구현** (Corr Ca·CrCl·Osm·K·Mg·P) | §13으로 승격 |
> | 커스텀 약물 | 메모리만 언급 | **구현됨** (v3.6, ~20함수) | §16 신설 |
> | 즐겨찾기 | 메모리만 언급 | **구현됨** (v3.8~3.9, fav 탭) | §17 신설 |
> | 영양 요구량 | "로드맵(우선2)" | **구현됨** (v3.11, 수액탭 내) | §12.6 편입 |
> | CRRT `nafamostatInfo` | 스펙 함수명 | 실제 없음 → 정보 표시 + `nafamostatLegacyMgH` | 명칭 정정 |
> | CRRT `checkBuffer` | 별도 함수 | 실제 없음 → `calcCRRTbag` 내 pH 로직으로 **통합** | 구조 정정 |
> | CRRT `legacyKclMix` | 별도 함수 | 실제 없음 → DATA에 존재, UI 토글 | 명칭 정정 |
> | CRRT UI 핸들러 | 미명시 | `calcCRRT`·`calcCRRTbag`·`calcCRRTrca`·`initCRRT` | 추가 명문화 |
> | Vent UI 핸들러 | `calc*` 순수만 | `calcVent*` 핸들러 분리 (DUS/ROX/Risk/CLT/Sbt/Predict) | 2레이어 명문화 |
> | `<script>` 개수 | 메인 스펙 "2개" | 실제 **3개** (JSON-LD 1 + 일반 2) | 무결성 정정 |
> | switchTab names | 10개 | 실제 **12개** (+`fav`, +`crrt`) | 정정 |
> | 탭 버튼 | "9개" | 실제 **.tabs 내 10개** + active(환자바) | 정정 |

---

## 0. 핵심 아키텍처 원칙 (비협상 — 모든 섹션에 우선)

> 만성질환 가이드 시리즈 전체 공통 철학. 위반 시 통합·확장 불가.
> 새 모듈·약물·계산기 추가 시 **항상 먼저 확인**.

### 0.1 절대적 모듈화 (DATA / ENGINE / UI 3레이어 분리)
- **DATA 레이어**: 모든 임상 지식(수치·약물명·기준값·농도·고시조건·용량)은 데이터 객체에만 존재.
  - `DRUGS[]`, `SLIDER_OC{}`, `IVR_TABLE{}`, `VASO_D[]`, `CRRT{}`, `VENT{}`, `VENT_V2{}`, Na/ABGA 공식 상수
- **ENGINE 레이어**: 순수 계산 함수. DATA를 읽어 결과만 생성. 임상 수치 자체 보유 금지.
  - `calcEffluentDose()`, `calcDTF()`, `ocSliderRate()`, `calcNaCorrection()`, `getDrugRateMLhr()`
- **UI 레이어**: 렌더·표시. 계산 로직 없음. ENGINE 결과를 화면에 그릴 뿐.
  - `renderDrugs()`, `calcCRRT()`(핸들러), `calcVentDUS()`(핸들러), `renderActiveSummary()`
- 세 레이어는 **ID 참조로만** 결합. 값 복제 금지.
- **CRRT·Vent 패턴**: 순수 엔진(`calcDTF`,`calcEffluentDose`)과 UI 핸들러(`calcVentDUS`,`calcCRRT`)를
  분리. 핸들러가 DOM에서 입력 읽어 순수 엔진 호출 → 결과를 DOM에 렌더. (검증된 모범 패턴, 유지)

### 0.2 하드코딩 절대 금지
- 엔진·UI 코드에 임상 수치를 리터럴로 박지 않는다.
  - ❌ `if(drug==='norepi') rate = dose*60/4;`  (농도 4 박힘)
  - ✅ `rate = ocSliderRate(drugId, dose);`  (농도는 `SLIDER_OC.conc`)
- 약물 특성(농도·범위·단위)은 그 약물의 데이터 객체가 단독 소유. 다른 모듈은 ID로 인용.
- 새 약물 추가 = 데이터 객체 + 설정 등록만으로 동작 (엔진 수정 최소화).
- 같은 값이 두 곳(예: `bvols`/`vols`, `calcMap`)에 나타나면 **반드시 동기화** 또는 단일 소스화.

### 0.3 가산만(additive) 원칙 — 무손상
- 기존 엔진 로직·ID·계산식을 **수정하지 않고 확장만** 한다.
- 새 기능은 기존 함수에 가지 추가 또는 새 함수 추가 방식.
  - 예: `getDrugRateMLhr()` 신설로 대시보드·수액 양쪽이 같은 헬퍼 공유 (기존 로직 무손상)
  - 예: `initVentV2()` 신설로 v0.2 §5~7 가산 (`initVent()` v0.1 §1~4 무손상)
- 검증된 계산식(Adrogué-Madias, Winter's, FF, DTF 등)은 출처와 함께 동결.

### 0.4 통합 대비 (전역 ID 규칙)
- 약물은 성분 단위 전역 ID (`drug:dapagliflozin`), 계열은 별도 (`class:sglt2i`).
- ICU 앱 로컬 ID(`c-norepi`, `oc-lido`, `crrt:`, `vent:`)는 통합 시 매핑 레이어로 전역 ID에 연결.
- **정문 함수 계약**: 각 앱은 `recommend(patient) → {drugs[], targets[], flags[]}` 읽기전용
  인터페이스를 노출 가능하게 둔다 (통합엔진은 이 정문만 호출).

### 0.5 스펙 우선 + 실측 검증
- 항상 스펙시트(설계도) 먼저. 자료 확보 후 빌드.
- **ID·함수 존재 여부는 메모리·구 스펙이 아닌 실제 파일 grep/node 검증**으로 확인 (이 통합의 교훈).
- 마일스톤마다 스펙 갱신. 현재 문서가 단일 진실 원천.

---

## 1. 파일 구조

```
icu_drug_calculator.html (단일 파일, ES5/var, CDN 없음)
├── <head> SEO + 피드백(formspree.io/f/mkoadkje) + <style>(~48KB)
├── <body>
│   ├── .app-header (축소, 우측 피드백 버튼)
│   ├── .sticky-bar
│   │   ├── #session-bar            ← 환자 칩
│   │   ├── .pt-compact             ← 컴팩트 환자 바 (체중 스테퍼 + 빠른설정 + 💉현재약물)
│   │   ├── .pt-quick-wrap          ← 빠른 체중 (접이식, 기본 숨김)
│   │   └── .tabs                   ← 탭 10개 버튼 (flex 다줄)
│   ├── #tab-vp/sd/ot/cardio        ← JS renderDrugs/renderSections
│   ├── #tab-calc                   ← 범용 인퓨전 (정적+ucCalc)
│   ├── #tab-elyte                  ← 전해질·대사 종합 (Na·ABGA·CorrCa·CrCl·Osm·K·Mg·P)
│   ├── #tab-ibw                    ← Vent 통합 탭 (§1~7, initVent+initVentV2)
│   ├── #tab-emg                    ← 응급 (정적)
│   ├── #tab-fluid                  ← 수액 I/O + 영양 요구량
│   ├── #tab-crrt                   ← CRRT (initCRRT, §1~5 아코디언)
│   ├── #tab-fav                    ← 즐겨찾기 (renderFavTab)
│   ├── #tab-active                 ← 현재약물 대시보드 (환자바 버튼 진입)
│   └── <footer>                    ← 면책조항 + 출처 아코디언 (병원명·연도 없음)
├── <script type="application/ld+json"> (JSON-LD, 1개)
├── <script> (부트 156B, 1개)
├── <script> (메인 ~234KB, 1개)
├── <script> (Vercel va 스텁, v3.14 추가)
└── <script defer src="/_vercel/insights/script.js"> (v3.14 추가)
```

**무결성: `<html>/<head>/<body>/<style>/<footer>` 각 1개, `<script>` 합 5개**
(JSON-LD 1 + 일반 2 + Vercel Analytics 2 = 5) — *v3.14에서 Vercel Web Analytics 2개 추가(이전 3개). 구 스펙 "2개"는 오기, v3.12에서 3으로 정정됨*

---

## 2. 탭 구성 (10 버튼 + 환자바 현재약물 버튼)

| id | 버튼 | 내용 | 방식 | 진입 init |
|----|------|------|------|----------|
| `vp` | 🔴 승압 | 6종 | JS renderDrugs | — |
| `sd` | 😴 진정 | 11종 | JS renderDrugs | — |
| `ot` | 💙 이외 | 5종(섹션) | JS renderSections | — |
| `cardio` | 🫀 심혈관 | 11종(섹션) | JS renderSections | — |
| `calc` | 🧮 계산기 | 범용 인퓨전 | 정적+ucCalc | — |
| `elyte` | 🧪 전해질 | Na·ABGA·CorrCa·CrCl·Osm·K·Mg·P | calc함수 8개 | inline §13 |
| `ibw` | 🫁 Vent <sup>β</sup> | §1~7 (TV·SBT·예측·US·산소·위험) | calc+render | initVent+initVentV2 |
| `emg` | 🚨 응급 | 9섹션 | 정적 | — |
| `fluid` | 💧 수액 | 수액 I/O + 영양 | calc함수 | calcNutrition+initFluidModule |
| `crrt` | 💧 CRRT <sup>β</sup> | §1~5 (dose·FF·백·항응고·산염기) | calc함수 | initCRRT |
| `fav` | ⭐ 즐겨찾기 | 자주 쓰는 약물 모음 | renderFavTab | renderFavTab |
| `active` | (환자바 💉현재약물) | 대시보드+상세 | 요약+DOM 이동 | — |

**switchTab names (12개)**:
`['vp','sd','ot','cardio','calc','ibw','emg','fluid','elyte','active','fav','crrt']`
- **.tabs 내 버튼 10개**, `active`는 `.pt-active-btn`(환자바)에서 진입
- switchTab 안전처리: `if(btn && btn.classList && btn.classList.contains('tab'))` — 탭 밖 호출 대응
- 탭 진입 시 init 호출 (위 표 init 열): `ibw→initVent()+initVentV2()`, `crrt→initCRRT()`,
  `elyte→8개 calc`, `fluid→calcNutrition()+initFluidModule()`, `fav→renderFavTab()`
- **v3.14**: switchTab 끝에 Vercel `va('event',{name:'tab_view',data:{tab:name}})` 탭별 추적(가드 — `typeof window.va==='function'`일 때만). Vent·CRRT는 `<sup>β</sup>` + `.beta-banner` 베타 표시.

---

## 3. 컴팩트 환자 바

```html
<div class="pt-compact">
  <input id="ptName">                          <!-- 환자명 -->
  <div class="pt-compact-wt">                   <!-- 체중 스테퍼 -->
    <button onclick="stepBwt(-1)">−</button>
    <input id="bwt" value="60">
    <button onclick="stepBwt(1)">＋</button>
  </div>
  <button onclick="togPtPanel()">빠른설정 ▾</button>
  <button class="pt-active-btn" onclick="switchTab('active',this)">
    💉 현재약물<span class="pt-active-cnt"></span>
  </button>
</div>
```
**함수:** `setBwt(v)` / `stepBwt(delta)` (±1kg, 20–200 제한) / `togPtPanel()` / `updActBtn()`
- 체중은 **스테퍼**(곱셈 인자라 정밀도 중요, 슬라이더 비채택). `id="bwt"`/`id="ptName"` 각 1개.
- `updateAll()` → 체중 의존 모듈(수액·Na·슬라이더·CrCl·영양) 실시간 갱신.

---

## 4. DRUGS 배열 (34종 기본) + 카드 구조

### 4.1 카드 헤더
- **dc 카드(계산형)**: 접힘=영문+한글(우측)+배지(용도) / 펼침=농도·범위 + body
- **oc 카드(정보형/슬라이더)**: 접힘=영문+한글+`.oc-tag` / 펼침=농도 + body

### 4.2 배지 줄바꿈 (좁은 화면 약물명 보호)
```css
.dc-r{flex-wrap:wrap;max-width:55%;}
@media (max-width:430px){ .dc-btn{flex-direction:column;} .dc-r{max-width:100%;margin-left:14px;} }
```

### 4.3 약물 목록
- **vp** (6): norepi, vaso, epi, phe, dobu, dopa
- **sd** (12): dex, midaz, ultiva, prop, pento(v3.17), fent, etom, halo, bec(Vecuronium), roc, sug, lasix
- **cardio** (11): milri, dilti / lido, amio, adeno, vera, digo / esmo, labet / ntg, nic
- **ot** (5): flum, nalox / ins / vitk, octreo, hep
- **+ 커스텀 약물** (사용자 정의, §16) — localStorage 저장, 동일 카드 체계로 렌더

### 4.4 dose 메타 (v3.13 신규 — 농도·범위 DATA 단일화)
계산형(dc) 약물 17종이 농도·용량범위를 객체에 보유. 엔진은 리터럴 대신 이를 읽음(0.2 준수).
```javascript
// DRUGS 객체에 가산된 필드 (id/name/body 등 기존 무손상)
{
  id:'c-norepi',
  mapId:'drug:norepinephrine',          // 전역 ID 매핑 (통합 대비)
  dose:{
    default:0.1,                         // 입력 디폴트 (body value와 동기화)
    unit:'mcg/kg/min',
    min:0.025, max:1.0,                  // 표시 범위 (★농도세팅과 무관 — norepi 버그 교훈)
    conc:32, concUnit:'mcg',             // 기본 농도 (getConc 폴백이 읽음)
    mode:'wt_min',                       // 단위변환 모드 (메타 기록, 엔진은 인라인식)
    thresholds:[                         // 다단계 임상경고 (있는 약물만)
      { at:0.25, level:'info',    msg:'...', src:'ssc2021' },
      { at:0.5,  level:'caution', msg:'...', src:'ssc2021,sccm' },
      { at:1.0,  level:'danger',  msg:'...', src:'martin,pulmcrit' }
    ]
  }
}
```
**헬퍼** (DATA 읽기):
```javascript
drugById(id)        // DRUGS에서 객체 조회
doseMeta(id)        // dose 메타 반환 (없으면 null)
renderDoseWarn(warnEl,id,dose)  // thresholds 누적매칭 → 가장 높은 충족 임계 표시
```
**calcMode** (단위변환 — 메타 기록만, 엔진은 기존 인라인식 동결):
| mode | 식 | 예 |
|------|---|---|
| wt_min | d×bwt×60/conc | norepi·epi·dobu·milri·ultiva·bec |
| wt_hr | d×bwt/conc | dex·midaz·prop·hep |
| hr | d/conc | dilti·octreo·fent·lasix |
| min | d×60/conc | labet |
| wt_min_x1000 | d×bwt×60/(conc×1000) | esmo(자체렌더) |
| wt_min_preset | d×bwt×60/(DOPA_F[].conc_mgml×1000) | dopa |

**17종 mapId**: norepi→`drug:norepinephrine`, epi→`drug:epinephrine`, dobu→`drug:dobutamine`,
milri→`drug:milrinone`, dilti→`drug:diltiazem`, octreo→`drug:octreotide`, hep→`drug:heparin`,
labet→`drug:labetalol`, esmo→`drug:esmolol`, dopa→`drug:dopamine`, dex→`drug:dexmedetomidine`,
midaz→`drug:midazolam`, ultiva→`drug:remifentanil`, bec→`drug:vecuronium`, prop→`drug:propofol`,
fent→`drug:fentanyl`, lasix→`drug:furosemide`

### 4.5 다단계 임상경고 (v3.13 — dose.thresholds[])
**근거 명확한 승압제·강심제 4종에만 선별 적용** (무리한 일괄 적용 회피):
| 약물 | 임계(level·근거) |
|------|------|
| **norepi** | 0.25 info(Vaso 추가)·0.5 caution(스테로이드)·1.0 danger(사망률↑) — SSC2021·SCCM·Martin |
| **epi** | 0.5 caution(빈맥·젖산·2차약제)·2.0 danger(FDA상한) — FDA 209359·SSC2021 |
| **dobu** | 10 info(>10 드묾)·20 caution(수용체포화)·40 danger(VT/VF) — LITFL·PMC12399504 |
| **dopa** | 10 info(α1전환)·20 caution(부정맥·norepi전환)·50 danger(최대) — FDA 018132·critcon |

**제외(의도적)**: vaso(VASO_D salvage 0.04 기존)·esmo(FDA초과 기존)·phe(임계약함)·진정제(적정기반).
**확장법**: ① dose.thresholds 추가 ② body에 `{id}-warn` div ③ cXxx에 `renderDoseWarn` 호출. 엔진 무수정.

---

## 5. 고정용량 약물 슬라이더식 (핵심)

### 5.1 SLIDER_OC (DATA)
```javascript
var SLIDER_OC={
  'oc-lido': {min:1,   max:4,   step:0.5,  val:2,    unit:'mg/min',  conc:4,   mode:'massmin'},
  'oc-vera': {min:0.5, max:5,   step:0.5,  val:2,    unit:'mg/hr',   conc:0.1, mode:'masshr'},
  'oc-ntg':  {min:5,   max:200, step:5,    val:10,   unit:'mcg/min', conc:100, mode:'mcgmin_on_mcgml'},
  'oc-nic':  {min:2.5, max:15,  step:2.5,  val:5,    unit:'mg/hr',   conc:0.1, mode:'masshr'},
  'oc-vaso': {min:0.01,max:0.04,step:0.01, val:0.02, unit:'u/min',   conc:0.2, mode:'umin'}
};
```
### 5.2 계산식 (ocSliderRate, mode별)
```
massmin / mcgmin_on_mcgml / umin : dose*60/conc
masshr                          : dose/conc
```
**검증값**: lido 2→30, vera 2→20, ntg 10→6, nic 5→50, vaso 0.02→6 mL/hr

### 5.3 커스텀 농도 (ocCustomConc)
- mix-drug/mix-vol에서 농도 계산. **NTG 주의**: mix는 mg, dose는 mcg → `mcgmin_on_mcgml`이면 `conc×1000`.

### 5.4 Vasopressin 행 선택 (테이블식, 슬라이더 아님)
- `selectVasoRate(dose,rate,rowEl)`: `.oc-row-sel` 하이라이트 + `ocSelectedRate['c-vaso']` 저장.
  Salvage ≥0.04 경고가 핵심이라 테이블 유지.

---

## 6. 현재 약물 대시보드 (#tab-active)

```
#tab-active
├── #active-summary    ← renderActiveSummary (요약 2열)
└── #active-drugs-list ← DOM 이동 카드 (상세 조절)
```
### renderActiveSummary — 약물 유형별 속도 읽기
1. 계산형 dc: `.res-big-num`
2. 인슐린: `.res-rate` 폴백
3. 고정용량: `rate==='—'`이면 `ocSelectedRate[d.id]` (미선택 시 "속도 미설정·탭하여 선택")
4. **커스텀 약물**: `renderCustomActiveCards()`로 동일 처리 (§16)

**제외 키워드**: 속도 텍스트에 '체중'/'계산'/'대기'/'입력' 포함 시 무시(placeholder).
**favReturnCards()**: 탭 전환 시 이동 카드 원위치 복귀 — `switchTab()` display 변경 **전에** 호출.

---

## 7. 범용 인퓨전 계산기 (#tab-calc)
양방향(fwd/rev), 전 단위 조합, gtt 통합:
- 정방향: mL/hr + "매크로(20)·마이크로(60) gtt/min"
- 함수: `ucSetDir`, `ucCalc`, `ucDrugToBase`, `ucParseDose`, `ucFmt`

---

## 8. 인슐린·HME
- 인슐린: 100U/100mL(1U/mL), 커스텀 지원. `cIns: rate = d / getConc('ins',1,'U')` (res-rate).
- HME 번역: "인공코"→"HME(수동 가습)", "Heated Humidifier"→"가열식 가습기".

---

## 9. 디자인 토큰

```css
:root{
  --bg:#e8ecf3; --surface:#fcfdff; --surface2:#f1f4fa;
  --accent:#3a5fc8;    /* 로열블루 */
  --accent-lt:#eef3fc; --accent-bg:#dbe6f8;
  --text:#1c2535; --text2:#3a4456; --muted:#6b7687; --muted2:#9aa3b2;
  --border:#dde3ee; --border2:#c5d0e2;
  --green:#16a34a; --red:#dc2626;
  --mono:'JetBrains Mono'/'SF Mono'; --r:10px; --rl:14px;
}
/* 토글 ON: #34c759 · 슬라이더: 트랙 4px, thumb 17px(흰+accent) */
/* CRRT 탭: 신장·수분 톤 청록~딥블루 💧 / Vent: 호흡기 청록·하늘 🫁 */
```
### 압축 규칙
- 참고 배너(.ban) 10.5px / 믹스 1줄 / 프리셋 이름만 / 결과 숫자 29px
### 푸터 (병원명·연도·버전 표기 0 — "화성유일" 잔존 0 검증됨)
```
<footer>
├── .footer-disclaimer   ← 강한 면책조항 (빨간 박스)
├── .footer-acc          ← 출처 아코디언 (toggleRefAcc, 기본 접힘)
│     .ref-cat × N: 약물·가이드라인 / 수액 / 전해질·산염기 / 혈액제제 / CRRT / Vent
└── .footer-final        ← "임상 적용 전 주치의 확인 필수"
```

---

## 10~11. 약물 추가 절차 + 무결성 체크 (v3.12 통합)

### 약물 추가 절차
**dc 약물**: DRUGS[] → cXxx() → updateAll()에 추가 → calcMap 등록 → sliders[] 등록
**oc 슬라이더**: DRUGS[] (type:'oc') → SLIDER_OC 등록 → body 슬라이더 HTML → mode 선택 → ocCustomConc 분기

### 무결성 체크 (v3.12 — 실측 기준 정정)
> ⚠️ **substring 충돌 주의**: `calcCRRT`는 `calcCRRTbag`/`calcCRRTrca`에, `calcCuffLeak`은
> `calcCuffLeakDual`에, `initVent`는 `initVentV2`에 부분일치한다. 정확 카운트는
> 단어 경계 정규식 `re.findall(r'function '+fn+r'\s*\(', html)` 사용 (또는 `'function '+fn+'('`).
```python
assert html.count('<html')==1 and html.count('<body>')==1
assert html.count('<style>')==1 and html.count('<footer>')==1
assert len(re.findall(r'<script', html))==5        # ★ JSON-LD 1 + 일반 2 + Vercel Analytics 2 (v3.14)
assert html.count('function switchTab(')==1
# 메인 핵심
for fn in ['updOcSlider','selectVasoRate','renderActiveSummary','calcNaCorrection',
           'calcABGA','getDrugRateMLhr','toggleRefAcc','calcIBW','calcNutrition']:
    assert html.count('function '+fn)==1
# 전해질·대사 §13 (v3.5 — 실구현)
for fn in ['calcCorrCa','calcCrCl','calcOsm','calcKCorr','calcMgRep','calcPhosRep']:
    assert html.count('function '+fn)==1
# CRRT §11 (실구현 — 명칭 정정)
for fn in ['calcEffluentDose','calcFilFraction','calcDeliveredRatio','suggestPremixBag',
           'calcCaRatio','checkRcaTargets','calcCRRT','calcCRRTbag','calcCRRTrca','initCRRT',
           'nafamostatLegacyMgH','crrtBagById','crrtFFColor']:
    assert html.count('function '+fn)==1
assert html.count('var CRRT')==1
# Vent §14 (순수 엔진 + 핸들러)
for fn in ['calcDTF','checkDE','calcROX','calcCuffLeakDual','listExtubationRisk','ksccmRecBadge',
           'calcVentTV','calcSbtReady','calcRsbi','calcCuffLeak','calcExtubation',
           'calcVentDUS','calcVentROX','calcVentRisk','calcVentCLT','calcVentSbt','calcVentPredict',
           'initVent','initVentV2']:
    assert html.count('function '+fn)==1
assert html.count('var VENT_V2')==1
# 커스텀 §16 + 즐겨찾기 §17 (v3.6/3.8 — 실구현)
for fn in ['addCustomDrug','calcCustomDrug','saveCustomDrugs','loadCustomDrugs',
           'saveFav','loadFav','toggleFav','renderFavTab']:
    assert html.count('function '+fn)==1
# ── v3.13 하드코딩 정리 (DATA 단일화) ──
# 신규 헬퍼 (P0-1)
for fn in ['drugById','doseMeta','renderDoseWarn']:
    assert len(re.findall(r'function '+fn+r'\s*\(',html))==1
# 신규 DATA 객체 (P0-3·P1)
assert html.count('var NA_SAFETY')==1      # Na 안전가드
assert html.count('var ABGA_C')==1         # ABGA 임계
assert html.count('var FLUID_421')==1      # 4-2-1 유지수액
# DATA 참조 (엔진이 리터럴 대신 DATA 읽음)
assert 'NA_SAFETY.fluidNa.hts3' in html and 'NA_SAFETY.normalLow' in html
assert 'ABGA_C.winters.slope' in html and 'ABGA_C.ag.normal' in html
assert 'CORR_CA.severeAlbCut' in html
assert 'CRRT.electrolyteBags.selectMatrix' in html   # P0-2
assert 'FLUID_421.t1' in html
# DRUGS dose 메타 + mapId (P0-1)
assert html.count('dose:{ default:')==16   # +norepi 별도 = 17종
assert html.count("mapId:'drug:")==17
assert html.count('thresholds:[')==4        # norepi+epi+dobu+dopa
# 제거된 리터럴 (엔진 핵심 — 잔존 시 위반)
assert ',norepiFi===0?1:3,' not in html     # norepi 세팅연동 버그
assert "getConc('norepi',32," not in html   # 농도 폴백 리터럴
assert 'fluidNa=513' not in html and 'naCur<135' not in html
assert 'ph<7.35' not in html and 'var normAG=12' not in html
assert 'if(alb<3.0)' not in html
assert 'wt<=10) h421' not in html
fn_re = lambda f: len(re.findall(r'function '+f+r'\s*\(',html))  # 단어경계 카운트
assert fn_re('suggestPremixBag')==1         # selectMatrix 순회로 전환됨
assert '화성유일' not in html
assert 100_000 < len(html) < 450_000   # 실제 ~423K (v3.13)
```

### 절대 하지 말 것
- 임상 수치 하드코딩 (엔진·UI 리터럴) → DATA로
- `innerHTML=''`로 탭 전체 초기화 (이동 카드 삭제)
- switchTab/renderDrugs 중복 정의
- SLIDER_OC conc 단위 혼동 (NTG mcg/mL, mix mg → ×1000)
- 순수 엔진과 UI 핸들러 혼합 (CRRT/Vent 2레이어 패턴 유지)

---

## 12. 수액 I/O 모듈 (#tab-fluid)

### 12.1 IVR_TABLE (수액 분포)
```javascript
'NS','LR','PLA' : {ivf:0.25, isf:0.75, icf:0.00}   // 등장 결정질 (ECF)
'PLA'=Plasma Solution A: Na140/Cl98/K5/Mg3/acetate27/gluconate23, 294mOsm
'D5W','D10W'    : {ivf:0.083,isf:0.25, icf:0.667}  // TBW 균등 (자유수)
'HTS'(3%NaCl)  : {ivf:0.50, isf:0.50, icf:-1.00}  // ICF→ECF osmotic pull
'Alb5'         : {ivf:0.50, isf:0.50, icf:0.00}   // 콜로이드
'Alb20'        : {ivf:4.00, isf:-3.00,icf:0.00}   // hyperoncotic ISF→IVF
```
- **일반수액 행**(addFluidRow): Alb5/Alb20·혈액제제 제외 → mL/hr × 시간
- **혈액제제·콜로이드 행**(addBloodRow): 포함 → 단위 × mL **단일용량**(시간 곱 안 함)
- ⚠️ 알부민 볼루스를 일반수액(시간곱)에 두면 폭증 → 반드시 콜로이드 행

### 12.2 혈액제제 한국 표준 용량 (1단위)
pRBC 220 / FFP 150 / PLT(농축) 40 / Cryo 15 mL/U
- `bvols`/`vols` 동기화 필수. addBloodRow 끝에 `setBloodVol(id)`. 성분채집혈소판(~250mL) 미포함.

### 12.3 약물 carrier 자동 합산
- `getDrugRateMLhr(cid)`: 약물 1개 mL/hr (계산형 res-big-num / 인슐린 res-rate / 고정 ocSelectedRate)
- `calcVasopressorInput(dutyHr)`: 켜진 모든 인퓨전 약물 합산 (DRUGS 순서). 라벨 "약물 carrier(자동)".
- **커스텀 약물도 포함** (§16, getDrugRateMLhr 공통 헬퍼 경유).

### 12.4 권고 유지수액
4-2-1(Holliday-Segar) + NICE 성인 25–30 mL/kg/day → plan-maint 표시(참고).

### 12.5 Insensible Loss
`calcInsensibleLoss(dutyHr)` — 피부 + 기계환기 호흡(HME/가열식/없음별). `calcDutyBalance()` 듀티 수지.

### 12.6 영양 요구량 (v3.11 — 신규 편입, 구 스펙 "로드맵")
```javascript
calcNutrition()  // 입력: 신장(nut-ht)·성별(nut-sex)·체중
// 열량 25–30 kcal/kg, 단백 1.2–2.0 g/kg. 출처: ASPEN/ESPEN
```

---

## 13. 전해질·대사 종합 탭 (#tab-elyte — v3.5 확장, 구 스펙 "로드맵 우선1" → 실구현)

탭 진입 시 8개 calc 일괄 호출:
`calcNaCorrection() · calcABGA() · calcCorrCa() · calcCrCl() · calcOsm() · calcKCorr() · calcMgRep() · calcPhosRep()`

### 13.1 Na 교정 (calcNaCorrection) — v3.13: NA_SAFETY DATA화
- Adrogué-Madias: ΔNa(1L) = (수액Na − 혈청Na)/(TBW+1). TBW = 체중×계수(남0.6/여0.5/고령남0.5/고령여0.45)
- **모든 임상 임계가 `NA_SAFETY` DATA 객체에서** (엔진 리터럴 제거):
  ```javascript
  var NA_SAFETY = {
    normalLow:135, normalHigh:145,
    hypo:{ std24h:8, highRisk24h:6, highRiskLow:4, h48:18, hourlyMax:1.0,
           highRiskFactors:'간질환·알코올·영양실조·저칼륨·중증저Na(<115–120)',
           rates:[0.5,0.75,1.0],
           severe:{ htsVol:[100,150], htsMin:[10,20], target6h:[4,6], riseMin:5, remeasureHr:2 },
           odsOnset:'ODS는 지연성(교정 2–6일 후). 한계 내여도 고위험군 발생 가능.' },
    hyper:{ max24h:10, hourlyMax:0.5, note:'...' },
    fluidNa:{ hts3:513, ns:154, half:77, d5w:0 },
    defaultSexCoef:0.6,
    src:'NEJM Evidence 2023, CJASN 2024, ECPG 2014, Brazilian J Nephrol 2024'
  };
  ```
- **고위험군 분기 (v3.13 신규)**: UI 체크박스 `na-highrisk` → `limit24h` 8↔6 자동 전환.
  같은 계획 7 mmol/L에서 표준은 "주의", 고위험은 "🚨 위험"으로 갈림.
- **48h 한계(18) 병기 + ODS 지연성 안내** 추가 (과교정 정의 >8/24h 또는 >18/48h).
- 안전: 저Na 24h ≤limit24h 초과 시 🚨 ODS. 고Na ≤0.5/hr(≤10/24h). 중증 HTS 볼루스 프로토콜.

### 13.2 ABGA (calcABGA) — v3.13: ABGA_C DATA화 (신설)
- 입력 pH/PaCO2/HCO3 + 급/만성 + Na/Cl/Alb. 1차 판정 + 보상 + AG(알부민보정) + Delta ratio.
- **모든 임상 임계가 `ABGA_C` DATA 객체에서** (엔진 리터럴 16곳 제거):
  ```javascript
  var ABGA_C = {
    phLow:7.35, phHigh:7.45, hco3Normal:24,
    hco3MetLow:22, hco3MetHigh:26, co2RespHigh:45, co2RespLow:35,
    winters:{ slope:1.5, intercept:8, range:2 },     // 1.5×HCO₃+8±2
    metAlk:{ base:40, slope:0.7 },
    respChronic:{ base:24, slope:3.5 }, respAcute:{ base:24, slope:1.0 },
    respAlkChronic:{ base:24, slope:5 }, respAlkAcute:{ base:24, slope:2 },
    compTol:3,
    ag:{ normal:12, range:2, albCoef:2.5, albNormal:4.0 },  // 12±2, 보정 +2.5×(4.0−alb)
    delta:{ low:1, high:2 },                          // <1 mixed / 1–2 순수 / >2 알칼리증동반
    src:'StatPearls NBK482146, LITFL, Deranged Physiology, MDCalc'
  };
  ```
- 검증 케이스(pH7.15/23/16, Na140 Cl105 Alb4): Winter's 30–34, AG 19, Delta 0.88(mixed NAGMA) — RFN 예제 일치.

### 13.3 보정 Ca (calcCorrCa)  — Ca + factor×(albNormal−Alb). v3.13: `CORR_CA.severeAlbCut:3.0` 추가(중증저알부민 경고)
### 13.4 CrCl/eGFR (calcCrCl)  — Cockcroft-Gault, CKD-EPI(RENAL_EQ). v3.13: ARC/투석 문구 리터럴 → `RENAL_EQ.arc.threshold`/`dialysis.threshold` 주입
### 13.5 삼투압+gap (calcOsm)  — OSM_C 참조. v3.13: "gap>10"·"275-295" 문구 → `OSM_C.gapHigh`/`normalLow`/`normalHigh` 주입
### 13.6 K 교정 (calcKCorr)   — 저K 보충(KCl mEq) / 고K 응급세트. K_REPLACE DATA (v3.5)
### 13.7 Mg 보충 (calcMgRep) / 인 보충 (calcPhosRep) — MG_REPLACE·PHOS_REPLACE DATA (v3.5)

---

## 14. CRRT 탭 (#tab-crrt — CRRT v0.4 + 코드 정정)

### 14.0 범위·철학 (비협상)
- **역할: 참고 도구.** 백 조성·nafamostat 용량·FF 판정을 "고려 가능 옵션·현재 상태"까지만. 처방은 의료진.
- **무상태(stateless):** 추세 저장 없음. 매 입력마다 현시점 판정. (추세·이력은 EMR)
- **이중레이어(임상 한정):** `[가이드]`(KSN 2025·KDIGO 2012)/`[국내 일반]`(국내 프로토콜) 배지. **급여레이어 없음**(ICU 비대상). ※ v3.14: `[실무]`→`[국내 일반]` 표기 정정(AI투 완화).
- **균형·밀도:** cutoff + 근거수준/권고등급 + 한계 병기. 핵심 펼침·나머지 접힘.

### 14.1 핵심 임상 원칙
- 용량은 **effluent·FF·delivered 3축**. effluent 20–25(>40 무이득), **FF <20–25%(응고 한계)**, delivered/prescribed >0.8.
- **FF가 응고 지배.** BFR↑·전치환↑로 FF↓. dialysate는 FF 무관(확산).
- **국내 항응고 표준 = nafamostat.** RCA는 KDIGO/KSN 우선이나 국내 citrate 보급 제한.
- **RCA 칼슘 이중회로**: post-filter iCa(효율) ≠ systemic iCa(안전). 축적은 total/iCa ratio.
- **buffer = bicarbonate** (KDIGO 쇼크 1B / 간부전·유산산증 2B).

### 14.2 구조 (아코디언 5섹션)
```
#tab-crrt  (initCRRT = calcCRRT + calcCRRTbag + calcCRRTrca)
├── §1 처방 핵심: dose + FF + delivered  ← 펼침 (calcCRRT)
├── §2 칼륨·인산 → premix 백 선택        ← 접힘 (calcCRRTbag)
├── §3 마그네슘·칼슘                      ← 접힘 (DATA 표시)
├── §4 항응고 (nafamostat 표준 / RCA)     ← 접힘 (calcCRRTrca + nafamostat 정보)
└── §5 산염기·buffer                      ← 접힘 (calcCRRTbag 내 pH 로직으로 통합)
```
※ 구 스펙 §6 급여 섹션 **삭제됨**(ICU 비대상).

### 14.2b v3.14 — 상단 체중 연동 (이번 세션)
**문제**: CRRT가 독립 `crrt-wt`(기본 70)를 갖고 상단 환자 체중 `bwt()`를 무시 → effluent dose(mL/kg/h)가 실제 환자와 불일치(앱의 single-patient 원칙 이탈).
**해결 — 연동 + override 구조**:
- `initCRRT()` 진입 시: `crrt-wt`를 `bwt()`로 동기화 후 calcCRRT/Bag/rca.
- `updateAll()`(상단 체중 변경): `crrt-wt = bwt()` + calcCRRT 재호출 → dose 즉시 반영.
- **직접 입력 시 override 유지**: CRRT 탭에서 crrt-wt를 직접 바꾸면 그 값 보존(dry weight 대응 — 부종·수분과다 환자에서 건체중 기준 dose).
- UI: 라벨에 "상단 환자 연동·조정가능" 표기.
- 검증: 상단 55→CRRT 55·dose 55기준, 상단 80→80 추종, CRRT 직접 65→65 유지.

### 14.3 DATA: `var CRRT` — dose / ff / electrolyteBags(products 5종 + **selectMatrix** + phosphateMix + legacyKclMix) / magnesium / calcium / nafamostat / rca / acidBase
**백 5종**: Hemosol B0 / Prismasol 2 / Prismasol 4(Multibic 4K) / Phoxilium / Biphozyl
> **v3.13 (P0-2)**: `electrolyteBags.selectMatrix` DATA가 **코드에 실제 반영**됨(v3.12 시점엔 스펙만 있고 코드엔 없었음 — 드리프트 해소).
> K 선택 임계(6.0/4.5/3.5)·P 경계(3.5)를 7행 매트릭스로 보유. `suggestPremixBag`이 이를 순회.
> ```javascript
> selectMatrix:[
>   { kMin:6.0, pMax:null, bag:'bag:hemosol_b0',  reason:'고K 우선' },
>   { kMin:4.5, pMax:3.5,  bag:'bag:phoxilium',   reason:'P 보충 동반' },
>   { kMin:4.5, pMax:null, bag:'bag:prismasol_2', reason:'K2 완만하강' },
>   { kMin:3.5, pMax:3.5,  bag:'bag:phoxilium',   reason:'K+P 동시' },
>   { kMin:3.5, pMax:null, bag:'bag:prismasol_4', reason:'저K 예방' },
>   { kMin:-1,  pMax:3.5,  bag:'bag:phoxilium',   reason:'K4+P + KCl 고려' },
>   { kMin:-1,  pMax:null, bag:'bag:prismasol_4', reason:'K4 + KCl 고려' }
> ]
> ```
> kMin='초과(>)' 기준, pMax=null이면 P 무관, 순서대로 첫 매칭. 검증: 3111 격자케이스 if-else와 100% 일치.

### 14.4 ENGINE (순수) + UI 핸들러 — ★코드 실측 명칭
| 역할 | 순수 엔진 | UI 핸들러 |
|------|----------|----------|
| §1 dose | `calcEffluentDose` | `calcCRRT` |
| §1 FF | `calcFilFraction` (+`crrtFFColor`) | `calcCRRT` |
| §1 delivered | `calcDeliveredRatio` | `calcCRRT` |
| §2 백 | `suggestPremixBag` (selectMatrix 순회, +`crrtBagById`) | `calcCRRTbag` |
| §4 RCA Ca | `calcCaRatio`·`checkRcaTargets` | `calcCRRTrca` |
| §4 nafamostat | `nafamostatLegacyMgH`(legacy 환산) | (정보 표시, calcCRRTrca 내) |
| §5 buffer | — | `calcCRRTbag` 내 pH 분기 |
| 헬퍼 | `crrtNum`·`crrtRound` | — |

> **v3.13 (P0-2)**: `suggestPremixBag`이 if-else 임계 → `CRRT.electrolyteBags.selectMatrix` 순회로 전환.
> 백 선택 기준 변경 = 매트릭스 행 수정만(엔진 무수정). 무회귀 동결.
>
> **정정(v3.12)**: 구 스펙의 `nafamostatInfo`/`checkBuffer`/`legacyKclMix` 별도 함수는 **존재하지 않음**.
> nafamostat은 정보 표시 + `nafamostatLegacyMgH` 환산만. buffer는 `calcCRRTbag`의 pH 입력 분기로
> **통합**(pH<7.15 생명위협→Prismasol+IV NaHCO₃ / pH>7.5→Biphozyl 전환). legacyKclMix는 DATA에만.

### 14.5 공식 (검증 동결 — Node 대조 완료)
```
Effluent dose = (전치환+후치환+투석액+net UF)/체중[kg]   목표 20–25
FF: PlasmaFlow = BFR×60×(1−Hct); TotalUF = 전+후+netUF+PBP
    FF% = TotalUF / (PlasmaFlow + 전치환 + PBP) × 100      ※dialysate 미포함, 전치환은 분모 가산
    목표 FF<20–25%, post-filter Hct<0.40
Total/iCa ratio = totalCa/systemicICa  [≥2.5 축적]
nafamostat ugtt(60gtt/mL): ugtt/min≈mL/h × 농도(mg/mL) = mg/h
```
**검증값(11종 PASS, 동결)**: dose 30/52.5 · FF 35.7/23.2/20.5/27.5 · delivered 0.81 · CaRatio 2.4/2.6 · bag Phox/Phox/Hemosol · nafa 20/10

### 14.6 UI
- §1 펼침: dose+FF+delivered 3카드 + FF 색상 게이지(녹<20/주황20–25/빨강>25)+응고경고
- §2: K·P 입력 → premix 백 카드(조성)+`[가이드 KSN]` + **인(P) 기반 혼합 비율**(실무) + 구세대 IK40 토글
- §4: nafamostat 기본(표준, 20–50→적정, ACT 150–250/aPTT 50–70) + 옛 프로토콜 환산 접이식 / RCA post·systemic iCa **분리 입력**, ratio ≥2.5 빨강
- §5: pH 입력 → 산/알칼리증 백 보정 (calcCRRTbag 내)

---

## 15. Vent 탭 (#tab-ibw — Vent v0.2 + 코드 정정)

### 15.0 범위·철학 (비협상)
- **역할: 참고 도구.** liberation 연속 과정 — **단계 판정·저장 안 함(무상태).** 지표 충족도만 즉석 표시. ※ v3.14: UI 문구 "조언자 역할·병렬 제시"→"함께 보는 참고"로 정정(AI투 완화).
- **단일 지표 단정 금지:** 모든 예측지표 단독 부정확 → 병렬·조합. 점수 합산 없음.
- **권고등급 투명화:** KSCCM GRADE 배지(강도+근거수준). 전부 conditional/expert/deferred — 명령 톤 금지.

### 15.1 구조 (§1~7, 2 init)
```
🫁 Vent 탭 (tab-ibw)
├── §1 폐보호 TV + IBW        ← 펼침   ┐ initVent (v0.1)
├── §2 SBT Readiness          ← 접힘   │  = renderVentSbtList + calcVentSbt + calcVentPredict
├── §3 Extubation 예측지표    ← 접힘   ┘
├── §4 SBT 진행/실패 기준     ← 접힘
├── §5 Diaphragm US (DTF·DE)  ← 접힘   ┐ initVentV2 (v0.2)
├── §6 Post-extubation 산소   ← 접힘   │  = renderVentPO2 + renderVentRisk + calcVentDUS
└── §7 발관실패 위험 + CLT    ← 접힘   ┘    + calcVentROX + calcVentRisk + calcVentCLT
```
탭 진입(`name==='ibw'`) 시 `initVent()` + `initVentV2()` 둘 다 호출.

### 15.2 DATA: `var VENT`(v0.1) + `var VENT_V2`(v0.2: ksccm2024 9권고 / diaphragmUS / postExtubation / extubationFailure)

### 15.3 ENGINE (순수) + UI 핸들러 — ★코드 실측 명칭
| 역할 | 순수 엔진 | UI 핸들러 |
|------|----------|----------|
| §1 TV | `calcVentTV` | (정적+core) |
| §2 SBT | `calcSbtReady` | `calcVentSbt`·`renderVentSbtList` |
| §3 예측(RSBI 등) | `calcRsbi`·`calcCuffLeak`·`calcExtubation` | `calcVentPredict` |
| §5 Diaphragm | `calcDTF`·`checkDE` | `calcVentDUS` |
| §6 ROX/산소 | `calcROX` | `calcVentROX`·`renderVentPO2` |
| §7 위험/CLT | `listExtubationRisk`·`calcCuffLeakDual` | `calcVentRisk`·`calcVentCLT`·`renderVentRisk` |
| 권고배지 | `ksccmRecBadge` | — |
| 헬퍼 | `ventNum`·`ventRound` | `onVentChange` |

### 15.4 공식 (검증 동결)
```
DTF% = (Tdi흡기말 − Tdi호기말)/Tdi호기말 ×100      예: (0.28−0.20)/0.20 = 40%
ROX  = (SpO₂[%] / FiO₂[소수]) / RR                예: (95/0.4)/24 = 9.9
RSBI = RR / TV(L)
Cuff leak % = (흡기TV − 호기TV)/흡기TV ×100
```
**검증값(7종)**: DTF 40/10 · DE 1.5(성공)/0.8(DD) · ROX 9.9/5.0 · cuffDual 30mL/6%

### 15.5 UI
- §3 RSBI: KSCCM 권고B 배지 + "최근 57–80 제안" 한국 보강
- §5: DTF·DE 입력 → 색상 판정 + AUC/한계. "보조 지표·조합 필수"
- §6: HFNC/NIV/COT 3카드 + 권고배지. ROX 계산기. 고위험인자 체크 → HFNC/NIV 예방
- §7: 12위험인자 체크리스트 + **CLT 이중 cutoff**(KSCCM 110/15.1 vs 한국 50/14.7 병치) + 스테로이드 연계
- **배지 시스템**: `[B·조건부·중등도]` 칩, 탭 시 remark 펼침. B=청록/E=회색/I=주황(보류)

### 15.6 v3.14 — 제안 엔진 보강 + 단일 source + UX (이번 세션)
**입력 단일화 (Single Source of Truth)**
- 신장·성별은 **IBW 패널(`ibw-height`/`ibwSex`)이 유일 source**. 공용 Ventilator 바에서 `vs-height`/`vs-sex` 제거(죽은 참조 0 검증).
- `calcVentSuggest`는 `ventNum('ibw-height')`·`ibwSex` 전역을 읽음. `cIBW()` 끝에서 `calcVentSuggest()` 호출 → 신장/성별 변경 시 제안 TV/kg 동시 갱신.
- 공용 바 = 호흡기 setting 전용(FiO₂·PEEP·Plateau·TV·RR), IBW 패널 = 체격. 역할 분리.

**calcVentSuggest 룰 보강**
- **룰 1b (RR·MV)** 신설 — 기존엔 rr을 읽기만 하고 미사용(버그). `MV = TV×RR/1000`. 판정: RR>rrHigh(35) 빈호흡 / RR<rrLow(8) 저호흡 / MV>mvHigh(10) 과환기 / MV<mvLow(4) 부족 / else 적정.
- **압력 룰 3구간화** — ΔP=Plateau−PEEP. `dp≤0`(PEEP≥Plateau, 물리 불가→입력확인) / `dp<drivingMin(5)`(측정오류·자발호흡 간섭 의심) / `5–15 적정` / `>drivingMax(15) 예후불리(Amato 2015)`. `calcVentDP` 패널도 동일 3구간 + ban 경고.
- `VENT_SUGGEST.vent`: `rrLow:8, rrHigh:35, rrTachy:30, mvLow:4, mvHigh:10` / `protect.drivingMin:5` 추가.

**tv-current-eval** — TV테이블 위. 공용바 설정 TV가 IBW 기준 mL/kg(>8 감량/<5.5 부족/6–8 적정) + "6mL/kg≈N mL" 목표. cIBW 내 렌더. recalcVentAll에 cIBW 추가(TV 변경 시 갱신, 순환 없음 — cIBW는 recalcVentAll 미호출).

**참조표 아코디언** — ARDS 중증도표·FiO₂-PEEP 조합표를 `.vent-card-acc` details로 접음(기본 접힘). renderPeepLadder는 접혀도 백그라운드 동작. 공용입력바·제안·Plateau/Driving은 펼침 유지.

**상단 체중 연동** — updateAll 끝에 `cIBW()` 추가 → 상단 bwt() 변경 시 IBW vs 실제체중 비교 갱신(비만 경고 실시간).

**어조** — Vent 전반 AI투→사무조. "조언자 역할·병렬 제시"→"함께 보는 참고". 경고 단정어 완화(VILI 정보는 보존).

**Beta** — 탭버튼 🫁Ventβ + `.beta-banner`(검증 진행 중 안내).

---

## 16. 커스텀 약물 빌더 (v3.6 — 신규 명문화, 구 스펙 누락)

사용자 정의 약물을 생성·저장·계산·즐겨찾기·현재약물 토글. localStorage 영속.

### 16.1 함수군
```
addCustomDrug() / delCustomDrug() / loadCustomDrugs() / saveCustomDrugs()
calcCustomDrug(id) / calcVasoCustom() / changeCustomUnit() / updateCustomConc()
renderCustomDrugs() / renderCustomActiveCards()
toggleCustomActive() / toggleCustomFav() / toggleCustomForm() / toggleCustomMix()
toggleCustomMixNorepi() / toggleCustomMixVaso() / ocCustomConc()
```
### 16.2 원칙
- 커스텀 약물도 기본 약물과 **동일 카드 체계**로 렌더 (renderDrugs 패턴 재사용).
- 대시보드·수액 carrier 합산에 **자동 포함** (getDrugRateMLhr 공통 헬퍼 경유 — 0.3 가산 원칙).
- 커스텀 데이터는 DATA 레이어 별도 객체(CUSTOM_DRUGS 등) 단독 소유, localStorage 직렬화.

---

## 17. 즐겨찾기 탭 (#tab-fav — v3.8~3.9 통합, 구 스펙 누락)

자주 쓰는 약물(기본+커스텀)을 별 표시하여 한 탭에 모아보기.

### 17.1 함수군
```
saveFav() / loadFav() (FAV_KEY localStorage)
toggleFav() / isFav() / favStarHtml() / favFindDrug()
renderFavTab() / renderFavCustomCards() / calcFavCustom() / changeFavCustomUnit()
favReturnCards()  ← 탭 전환 시 이동 카드 복귀 (switchTab display 변경 前 호출)
```
### 17.2 원칙
- 즐겨찾기 우선 정렬(원본 순서 유지하며 fav만 위로).
- **DOM 이동 패턴**: 카드를 fav 탭으로 이동 → 탭 떠날 때 `favReturnCards()`로 원위치
  (`innerHTML=''` 금지 — 이동 카드 보존). active 대시보드와 동일 패턴.

---

## 18. 빌드·검증 파이프라인 (v3.13)

```
1. 스펙시트 먼저 (설계도 — 변경 전 무회귀 사전대조 포함)
2. DATA 객체 수정 (임상수치 — 하드코딩 금지, 출처주석 동반)
3. ENGINE 순수 함수 (DATA 읽기) + node --check
4. 검증값 Node 대조 (CRRT 11종·Vent 7종·Na·ABGA 동결값)
5. UI 핸들러 (DOM↔엔진 연결) + CSS
6. Python 조립: 앵커 정확매칭 (badges 전체줄 등 substring 충돌 회피)
7. 무결성 체크 (§10~11 assert 전체 PASS — 단어경계 정규식)
8. ★ jsdom 무회귀 (v3.13 표준): 원본 vs 패치본 출력 대조
   □ rate/경고태그 100% 일치 (DATA화는 출력 불변이어야)
   □ 신규 기능(고위험 분기·다단계경고)은 경계 트리거 정확
   □ 페이지 에러 0
   ※ Playwright Chromium 미가용 시 jsdom(runScripts:'dangerously')로 대체 — 본 세션 검증법
9. 스펙↔코드 동기화 (이 문서 갱신 — 마일스톤마다)
```
> **v3.13 검증 교훈**: ① 하드코딩 DATA화는 "값 그대로 이전"이므로 코드 전 Node 사전대조로
> 무회귀를 수학적으로 보장 가능. ② Playwright Chromium 다운로드가 막히면 `jsdom`으로 실제 DOM
> 렌더링 검증(`new JSDOM(html,{runScripts:'dangerously'})` → 함수 직접 호출). ③ Python 바이트수와
> JS 문자수 혼동 주의(한글 멀티바이트 — `wc -c` vs `len()`).

---

## 19. 개선 로드맵 (남은 항목)

> 전해질·대사(우선1)·영양(우선2)은 **완료**. 아래는 미구현분.

### 미구현
- **CRRT §3 Mg/Ca 인터랙티브화** (현재 DATA 표시 위주 → 입력 기반 판정 보강 가능)
- **응급약물 체중 자동 용량** (현재 참조표 → 체중 연동)
- **수액 GDT/소변량 추적 강화**
- ~~PWA/TWA Play Store 래핑~~ — **완료** (2026-10 프로덕션, `kr.icucalc.twa`)
- ⚠️ 응급약물 체중 자동 용량 등 **용량 판단 기능 확장은 규제 포지셔닝 정리 전 보류** (v3.18)

### 별도 프로젝트 (장기)
- 약물 Y-site 호환성 (데이터 방대)
- 만성질환 가이드 통합 레이어 (recommend 정문 계약 기반)

### 기술 부채
- getDrugRateMLhr placeholder 텍스트 의존 → 약물 추가 시 제외 키워드 확인
- SLIDER_OC 추가 시 conc 단위 혼동 주의 (NTG mcg/mL)
- 매 마일스톤 스펙↔코드 동기화 (v3.12로 v3.4→v3.11 격차 해소, **v3.13으로 하드코딩 정리 반영**; 향후 누적 방지)
- **남은 P-레벨**: oc 약물·커스텀 약물 mapId 미부여(이번엔 dc 17종만). 통합 시점 정리.

---

## 20. 통합 대비 ID (전 모듈)

### 20.1 dc 약물 mapId (v3.13 — 코드 반영 완료, 17종)
DRUGS 객체에 `mapId:'drug:<성분>'` 가산:
```
c-norepi→drug:norepinephrine   c-epi→drug:epinephrine      c-dobu→drug:dobutamine
c-milri→drug:milrinone         c-dilti→drug:diltiazem      c-octreo→drug:octreotide
c-hep→drug:heparin             c-labet→drug:labetalol      c-esmo→drug:esmolol
c-dopa→drug:dopamine           c-dex→drug:dexmedetomidine  c-midaz→drug:midazolam
c-ultiva→drug:remifentanil     c-bec→drug:vecuronium       c-prop→drug:propofol
c-fent→drug:fentanyl           c-lasix→drug:furosemide
c-roc→drug:rocuronium          (v3.15 추가 — 18종)
c-pento→drug:pentobarbital     (v3.17 추가 — 19종)
```
> 같은 약물 = 첨부 약제 레지스트리와 동일 전역 ID. 통합 시 rename 수준 정렬.
> **미부여(통합 시점 처리)**: oc 약물(oc-lido 등)·커스텀 약물·CRRT/Vent 약물.

### 20.2 전 모듈 ID 체계
```
# 전역 (질환 네임스페이스 없음, 성분 단위)
drug:nafamostat  drug:trisodium_citrate  drug:calcium_chloride  drug:potassium_chloride
drug:methylprednisolone  drug:dexamethasone  drug:norepinephrine  drug:vasopressin ...
class:serine_protease_inhibitor  class:catecholamine ...
lab:potassium lab:phosphate lab:magnesium lab:calcium_total lab:calcium_ionized
lab:ph lab:bicarbonate lab:hematocrit lab:sodium lab:creatinine lab:egfr
# ICU 로컬 (통합 시 매핑 레이어로 전역 연결)
c-norepi(→mapId) oc-lido oc-ntg ...                 # 약물 로컬 (dc는 mapId 보유)
crrt:effluent_dose crrt:filtration_fraction crrt:bag:hemosol_b0 crrt:rca ...
vent:idx:rsbi vent:idx:rox vent:idx:dtf vent:po2:hfnc vent:test:clt_korea ...
calc:effluent_dose calc:filtration_fraction calc:dtf calc:rox calc:cuff_leak_dual
# 가이드라인 참조
guide:ksccm_mv_liberation_2024  guide:ksn_ckrt_2025  guide:kdigo_aki_2012
# 급여(notice:) 없음 — ICU 비대상
```
- **정문 계약**: `recommend(patient) → {drugs[], targets[], flags[]}` 노출 가능. 통합엔진은 이것만 호출.

---

## 21. 근거 출처 (footer 링크)

### 약물·기본
표준 ICU 프로토콜·MDCalc / Insulin 100U 100mL(UIowa/UCSF) / Vasopressin Salvage 0.04(SSC 2021)

### 수액·영양
Plasma Solution A(Plasma-Lyte 148 PI FDA·서울아산) / 혈액제제(서울아산·서울대·적십자) /
4-2-1(Holliday-Segar 1957, NICE CG174) / 영양(ASPEN·ESPEN)

### 전해질·산염기
Na 교정(Adrogué-Madias NEJM 2000, Sterns 2024, MDCalc#480) / ABGA(Harrison's, LITFL, Winter's) /
CrCl(Cockcroft-Gault, CKD-EPI) / Osm·K·Mg·P(표준 ICU 프로토콜)
**v3.13 보강** — Na ODS: NEJM Evidence 2023(EVIDoa2200215)·CJASN "Stay the Course" 2024(PMC10843202)·
ScienceDirect 메타 2024·Brazilian J Nephrol 2024(과교정 8/24h·18/48h, PMC12854713)·ECPG 2014.
ABGA: StatPearls NBK482146(Winter's·pH경계)·LITFL(AG·delta)·Deranged Physiology(보상식)·MDCalc.

### 약물 다단계 임상경고 (v3.13 신규)
- norepi: SSC 2021·SCCM·StatPearls NBK537259·ACEP Refractory Shock 2025·Martin/PulmCrit
- epi: FDA 라벨 209359/205029(0.05–2 mcg/kg/min)·SSC 2021
- dobu: LITFL Dobutamine CCC(2–20, max40)·PMC12399504(수용체포화)·Drugs.com·NHS CCF
- dopa: FDA 라벨 018132·critcon(용량별 수용체)·droracle 2026(부정맥)·Drugs.com(max50)

### CRRT
KSN CKRT 2025 (ksn.or.kr) / KDIGO AKI 2012 / UAB CRRT Academy 2018(FF) / Tolwani 2018(FF 예제) /
Deranged Physiology / Springer Crit Care 2021 / PLoS One 2020(백 매트릭스, PMC7485827) / EBP 2022 / Frontiers Med 2022 /
Biphozyl 2021 / BMC Nephrol 2024(nafamostat) / PLoS One 2014 · Sci Rep 2025 / Renal Fellow · Springer 2017(RCA)

### Vent
KSCCM Liberation from MV 2024 (Acute Crit Care 39(1):1-23) / ATS/ACCP 2017 / Marques 2024(US) /
Llamas-Álvarez meta / KSCCM journal 2025 / Roca ROX 2019 · Fuentes 2022 / Lim 2006(한국 CLT) /
Yang-Tobin NEJM 1991(RSBI) · Boles ERJ 2007 · PADIS/ABCDEF

---

*v3.18 — Play 출시 연동(APP_LINKS 단일소스·TWA 숨김·UTM) + 감사 P1(핀치줌·16px·터치타깃·PRIS) + 규제 포지셔닝 문구.*
*v3.14 — Vent/CRRT 안정화(RR룰·ΔP검증) + IBW 단일화 + 상단 체중 Vent/CRRT 연동 + UX(좌우레이아웃·아코디언·어조) + Vercel Analytics·Beta.*
*v3.13 — 하드코딩 감사 + DATA 단일화(P0-1 약물·P0-2 CRRT백·P0-3 Na·P1 ABGA + 다단계경고 + mapId).*
*v3.12 — 분산 스펙(메인 v3.4·CRRT v0.4·Vent v0.2) + 코드 전용 변경점(v3.5~v3.11) 단일 통합.*
*모든 항목은 실제 index.html grep/node/Playwright 검증 기준. 모든 DATA화는 무회귀(패치 전후 출력 동일) 확인.*
*향후 마일스톤마다 이 문서 갱신(드리프트 누적 방지). 임상 임계는 코드가 아닌 DATA만 고치면 됨.*
*ICU 앱은 참고 도구다. 모든 값은 함께 보는 참고이며, 최종 처방은 의료진이 정한다.*
