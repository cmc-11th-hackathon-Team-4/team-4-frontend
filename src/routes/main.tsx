import type { RouteObject } from 'react-router';
import MainPage from '@/pages/main/MainPage';
import MemberPage from '@/pages/main/MemberPage';

/** ② 덜어오기 플로우 라우트 */
export const mainRoutes: RouteObject[] = [
  { index: true, element: <MainPage /> },
  { path: 'member/:memberId', element: <MemberPage /> },
];
