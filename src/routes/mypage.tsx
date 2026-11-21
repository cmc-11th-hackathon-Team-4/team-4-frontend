import type { RouteObject } from 'react-router';
import M01MyPage from '@/pages/mypage/M01MyPage';
import P01ProfilePage from '@/pages/onboarding/P01ProfilePage';
import { MYPAGE_PATHS as P } from './mypagePaths';

/** 플로우 ④ 라우트 (router.tsx에서 ①②③과 함께 합침) */
export const mypageRoutes: RouteObject[] = [
  { path: P.my, element: <M01MyPage /> },
  // P-01은 만들기·수정 공용 화면
  { path: P.profileEdit, element: <P01ProfilePage mode="edit" /> },
];
