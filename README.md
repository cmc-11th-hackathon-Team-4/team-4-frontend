# 니턴내턴

> 같이 사는 사람끼리 집안일을 나누고, 힘든 날엔 서로의 짐을 덜어주는 앱

CMC 11th 해커톤 4팀 프론트엔드 레포지토리입니다.

- 배포 주소: https://team-4-frontend-bice.vercel.app
- 백엔드 레포: [team-4-backend](https://github.com/cmc-11th-hackathon-Team-4)

## 서비스 소개

집안일을 랜덤으로 공평하게 나누고, 기분이 지치거나 바쁜 날에는 구성원이 내 짐을 덜어가거나 내가 부탁할 수 있어요.<br>
주기가 끝나면 한 주를 결산하고, 서로 가장 많이 덜어준 사람을 배려왕으로 보여줘요.<br>
로그인 없이 기기 단위로 사용하고, 초대 코드로 우리 집에 참여합니다.

### 주요 기능

| 플로우                 | 내용                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| ① 그룹 생성            | 프로필(캐릭터 + 닉네임) 만들기, 집 만들기, 초대 코드 공유 · 코드로 참여, 대기실, 집안일 고르기, 결산 주기 설정, 랜덤 배분 |
| ② 덜어주기 · 짐 올리기 | 내 메인(짐 게이지 · 기분 선택), 상대 짐 덜어가기, 내 짐 부탁하기(받기 · 거절), 완료, 하트로 고마움 전하기, 알림 배너      |
| ③ 주간 결산            | 결산 홈, 한 일 · 못 한 일, 못 한 일 이월 · 덜어내기, 이번 주 배려왕, 다음 주기 배분 · 시작                                |
| ④ 마이                 | 마이페이지(프로필 · 우리 집 구성원), 프로필 수정, 우리 집 설정(집안일 추가 · 기간 늘리기 · 시연 메뉴)                     |

### 앱 구조

- 이 레포는 React 웹이고 Vercel에 배포됩니다. `main`에 머지하면 자동으로 배포됩니다.
- 제출용 Android 앱(APK)은 Expo WebView가 배포 주소를 화면 가득 띄우는 방식이라, 웹을 배포하면 앱에도 바로 반영됩니다.
- 모바일 화면(피그마 프레임 402 × 874) 기준이며, 넓은 화면에서는 같은 비율로 가운데에 표시합니다.

## 기술 스택

| 분류          | 사용 기술                                                              |
| ------------- | ---------------------------------------------------------------------- |
| Language      | TypeScript                                                             |
| Framework     | React, Vite                                                            |
| Routing       | React Router                                                           |
| Server State  | TanStack Query                                                         |
| Client State  | Zustand                                                                |
| HTTP          | Axios                                                                  |
| Styling       | Tailwind CSS v4 (디자인 토큰은 `src/index.css`의 `@theme`), Pretendard |
| Lint / Format | ESLint, Prettier                                                       |
| Deploy        | Vercel                                                                 |

## 시작하기

```bash
git clone https://github.com/cmc-11th-hackathon-Team-4/team-4-frontend.git
cd team-4-frontend
npm install
cp .env.example .env
npm run dev
```

| 명령어           | 설명                            |
| ---------------- | ------------------------------- |
| `npm run dev`    | 개발 서버 실행 (localhost:5173) |
| `npm run build`  | 타입 체크 + 프로덕션 빌드       |
| `npm run lint`   | ESLint 검사                     |
| `npm run format` | Prettier 포맷팅                 |

### 환경 변수

| 이름             | 설명                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `VITE_API_URL`   | 백엔드 서버 주소 (`/api/v1` 없이, HTTPS)                                                   |
| `VITE_DEMO_MENU` | `false`면 우리 집 설정의 시연 메뉴(기간 종료하기 · 처음부터 다시 하기)를 숨김. 기본은 보임 |

Vercel에서 환경 변수를 바꾸면 다시 배포(Redeploy)해야 반영됩니다.

VS Code에서 프로젝트를 열면 추천 확장(Prettier, ESLint, Tailwind CSS IntelliSense) 설치 알림이 뜹니다.<br>
설치하면 저장할 때 자동으로 포맷팅됩니다.

## 화면 · 경로

| 플로우 | 화면                                                                                             | 경로                                                                              |
| ------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| ①      | S-14 홈 · 집 없음                                                                                | `/welcome`                                                                        |
| ①      | P-01 프로필 만들기                                                                               | `/profile/new`                                                                    |
| ①      | S-01 집 만들기                                                                                   | `/onboarding/create`                                                              |
| ①      | S-02 초대장 만들기                                                                               | `/onboarding/invite`                                                              |
| ①      | S-13 코드로 참여 · S-13-C 이 집이 맞나요 · S-13-W 방장 기다리는 중                               | `/onboarding/join`, `/onboarding/join/confirm`, `/onboarding/join/waiting`        |
| ①      | S-03 대기실                                                                                      | `/onboarding/waiting`                                                             |
| ①      | S-04 집안일 고르기 · S-05 랜덤 배분 · S-06 결산 주기                                             | `/setup/chores`, `/setup/assign`, `/setup/cycle`                                  |
| ②      | V5-01 내 메인                                                                                    | `/`                                                                               |
| ②      | V5-07 상대 상세                                                                                  | `/member/:memberId`                                                               |
| ②      | V5-12 우리 집 설정 · 집안일 목록 · 구성원 목록                                                   | `/settings`, `/settings/chores`, `/settings/members`                              |
| ③      | S-08 결산 홈 · S-09 한 일 · 못 한 일 · S-10 못 한 일 이월 · S-11 이번 주 배려왕 · S-12 다음 주기 | `/weekly`, `/weekly/result`, `/weekly/carry-over`, `/weekly/best`, `/weekly/next` |
| ④      | M-01 마이페이지                                                                                  | `/my`                                                                             |
| ④      | P-01 프로필 수정                                                                                 | `/profile/edit`                                                                   |

앱을 `/`로 열면 서버 상태에 따라 첫 화면이 나뉩니다. 프로필이나 집이 없으면 `/welcome`, 집이 대기 중이면 대기실, 배분 중이면 랜덤 배분, 시작된 집이면 내 메인으로 이동합니다.

## API 연동

- 서버는 로그인 없이 **기기 UUID**로 사용자를 구분합니다. 앱이 처음 실행될 때 UUID를 만들어 저장하고, 모든 요청에 `X-Device-Id` 헤더로 보냅니다 (`src/utils/deviceId.ts`).
- 서버 응답 `{ success, code, message, data }`에서 `data`만 꺼내 쓰고, 실패하면 에러 코드가 담긴 `ApiError`로 바꿉니다 (`src/apis/instance.ts`, `src/apis/error.ts`).
- 다른 폰과의 동기화는 TanStack Query 폴링으로 처리합니다.

## 시연 메뉴

우리 집 설정(`/settings`) 맨 아래에 시연용 메뉴가 있습니다.

- **기간 종료하기** (방장): 진행 중인 기간을 바로 끝내고 결산(S-08)으로 이동합니다.
- **처음부터 다시 하기**: 이 기기를 새 사용자로 되돌립니다. 기기 UUID · 프로필 · 세션을 지우고 첫 화면으로 이동하며, 서버 데이터는 지우지 않습니다. 두 폰으로 시연할 때는 두 폰 모두 초기화한 뒤 집을 새로 만드세요.

## 폴더 구조

```
src/
├── apis/        # axios 인스턴스, 에러 처리, 도메인별 API 함수
├── assets/      # 이미지, 아이콘, 캐릭터, 일러스트
├── components/  # 공용 컴포넌트 (common: 헤더 · 탭바 · 토스트 · 확인 팝업 등)
├── constants/   # 문구 · 캐릭터 · 집안일 아이콘 등 상수
├── hooks/       # 커스텀 훅 (TanStack Query 훅 포함)
├── pages/       # 플로우별 페이지 (onboarding · main · weekly · mypage)
├── routes/      # 라우터와 플로우별 라우트 · 경로 상수
├── stores/      # zustand 스토어 (세션 · 프로필 · 토스트 등)
├── types/       # 공용 타입
└── utils/       # 유틸 함수
```

## Git 컨벤션

### 브랜치

- `main`: 배포 브랜치이며, 직접 push하지 않습니다.
- 작업 브랜치는 `타입/작업내용` 형식으로 만듭니다.
  - 예: `feat/home-page`, `fix/login-button`, `setting/eslint`

### 커밋 메시지

`타입: 작업 내용` 형식으로 작성합니다.

| 타입       | 설명                              |
| ---------- | --------------------------------- |
| `feat`     | 새로운 기능 추가                  |
| `fix`      | 버그 수정                         |
| `style`    | UI · 스타일 변경 (로직 변경 없음) |
| `refactor` | 코드 리팩토링                     |
| `chore`    | 설정, 패키지 설치 등              |
| `docs`     | 문서 수정                         |

예: `feat: 홈 화면 레이아웃 구현`

### PR

- 작업 브랜치에서 `main`으로 PR을 올립니다.
- PR 제목은 커밋 메시지와 같은 `타입: 작업 내용` 형식으로 작성합니다.
- PR 본문은 개조식으로, 해당 브랜치에서 한 일만 작성합니다.
