import type { RouteObject } from 'react-router';
import S08SummaryPage from '@/pages/weekly/S08SummaryPage';
import S09ResultPage from '@/pages/weekly/S09ResultPage';
import S10CarryOverPage from '@/pages/weekly/S10CarryOverPage';
import S11BestPage from '@/pages/weekly/S11BestPage';
import S12NextPage from '@/pages/weekly/S12NextPage';
import { WEEKLY_PATHS as P } from './weeklyPaths';

/** 플로우 ③ 라우트. router.tsx 연결은 팀 합의대로 마지막에 한 번에 합친다 */
export const weeklyRoutes: RouteObject[] = [
  { path: P.summary, element: <S08SummaryPage /> },
  { path: P.result, element: <S09ResultPage /> },
  { path: P.carryOver, element: <S10CarryOverPage /> },
  { path: P.best, element: <S11BestPage /> },
  { path: P.next, element: <S12NextPage /> },
];
