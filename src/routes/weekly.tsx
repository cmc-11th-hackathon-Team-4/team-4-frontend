import type { RouteObject } from 'react-router';
import WeeklySummaryPage from '@/pages/weekly/WeeklySummaryPage';
import WeeklyResultPage from '@/pages/weekly/WeeklyResultPage';
import WeeklyCarryOverPage from '@/pages/weekly/WeeklyCarryOverPage';
import WeeklyBestPage from '@/pages/weekly/WeeklyBestPage';
import WeeklyNextPage from '@/pages/weekly/WeeklyNextPage';

// ③ 주간 결산 플로우
export const weeklyRoutes: RouteObject[] = [
  {
    path: 'weekly',
    children: [
      { index: true, element: <WeeklySummaryPage /> }, // S-08 주간 결산
      { path: 'result', element: <WeeklyResultPage /> }, // S-09 한 일 · 못 한 일
      { path: 'carry-over', element: <WeeklyCarryOverPage /> }, // S-10 못 한 일 이월
      { path: 'best', element: <WeeklyBestPage /> }, // S-11 이번 주 배려왕
      { path: 'next', element: <WeeklyNextPage /> }, // S-12 다음 주기 · 재배분
    ],
  },
];
