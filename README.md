# team-4-frontend

CMC 11th 해커톤 4팀 프론트엔드 레포지토리입니다.

## 서비스 소개

> 아이디어 확정 후 작성 예정

- 배포 주소:
- 백엔드 레포: [team-4-backend](https://github.com/cmc-11th-hackathon-Team-4)

## 기술 스택

| 분류          | 사용 기술        |
| ------------- | ---------------- |
| Language      | TypeScript       |
| Framework     | React, Vite      |
| Routing       | React Router     |
| Server State  | TanStack Query   |
| Client State  | Zustand          |
| HTTP          | Axios            |
| Styling       | Tailwind CSS     |
| Lint / Format | ESLint, Prettier |
| Deploy        | Vercel           |

## 시작하기

```bash
git clone https://github.com/cmc-11th-hackathon-Team-4/team-4-frontend.git
cd team-4-frontend
npm install
cp .env.example .env   # VITE_API_URL 값 채우기
npm run dev
```

| 명령어           | 설명                            |
| ---------------- | ------------------------------- |
| `npm run dev`    | 개발 서버 실행 (localhost:5173) |
| `npm run build`  | 프로덕션 빌드                   |
| `npm run lint`   | ESLint 검사                     |
| `npm run format` | Prettier 포맷팅                 |

VS Code에서 프로젝트를 열면 추천 확장(Prettier, ESLint, Tailwind CSS IntelliSense) 설치 알림이 뜹니다. 설치하면 저장할 때 자동으로 포맷팅됩니다.

## 폴더 구조

```
src/
├── apis/        # axios 인스턴스, API 함수
├── assets/      # 이미지, 아이콘
├── components/  # 공용 컴포넌트
├── hooks/       # 커스텀 훅
├── pages/       # 페이지 컴포넌트
├── routes/      # 라우터 설정
├── stores/      # zustand 스토어
├── styles/      # 디자인 토큰, 전역 스타일
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

| 타입       | 설명                            |
| ---------- | ------------------------------- |
| `feat`     | 새로운 기능 추가                |
| `fix`      | 버그 수정                       |
| `style`    | UI·스타일 변경 (로직 변경 없음) |
| `refactor` | 코드 리팩토링                   |
| `chore`    | 설정, 패키지 설치 등            |
| `docs`     | 문서 수정                       |

예: `feat: 홈 화면 레이아웃 구현`

### PR

- 작업 브랜치에서 `main`으로 PR을 올립니다.
- PR 제목은 커밋 메시지와 같은 `타입: 작업 내용` 형식으로 작성합니다.
- PR 본문은 개조식으로, 해당 브랜치에서 한 일만 작성합니다.
