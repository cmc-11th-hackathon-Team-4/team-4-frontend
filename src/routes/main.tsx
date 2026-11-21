import type { RouteObject } from 'react-router';
import MainPage from '@/pages/main/MainPage';
import ChoreListPage from '@/pages/main/ChoreListPage';
import MemberListPage from '@/pages/main/MemberListPage';
import MemberPage from '@/pages/main/MemberPage';
import SettingsPage from '@/pages/main/SettingsPage';

/** ② 덜어오기 플로우 라우트 */
export const mainRoutes: RouteObject[] = [
  { index: true, element: <MainPage /> },
  { path: 'member/:memberId', element: <MemberPage /> },
  { path: 'settings', element: <SettingsPage /> },
  { path: 'settings/chores', element: <ChoreListPage /> },
  { path: 'settings/members', element: <MemberListPage /> },
];
