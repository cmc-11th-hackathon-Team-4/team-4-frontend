import type { RouteObject } from 'react-router';
import P01ProfilePage from '@/pages/onboarding/P01ProfilePage';
import S01CreateHousePage from '@/pages/onboarding/S01CreateHousePage';
import S02InvitePage from '@/pages/onboarding/S02InvitePage';
import S03WaitingPage from '@/pages/onboarding/S03WaitingPage';
import S04ChoresPage from '@/pages/onboarding/S04ChoresPage';
import S05AssignPage from '@/pages/onboarding/S05AssignPage';
import S06CyclePage from '@/pages/onboarding/S06CyclePage';
import S13CJoinConfirmPage from '@/pages/onboarding/S13CJoinConfirmPage';
import S13JoinPage from '@/pages/onboarding/S13JoinPage';
import S13WJoinWaitingPage from '@/pages/onboarding/S13WJoinWaitingPage';
import S14WelcomePage from '@/pages/onboarding/S14WelcomePage';
import { ONBOARDING_PATHS as P } from './onboardingPaths';

/** 플로우 ① 라우트 (router.tsx에서 ②·③과 함께 합침) */
export const onboardingRoutes: RouteObject[] = [
  { path: P.welcome, element: <S14WelcomePage /> },
  { path: P.profileNew, element: <P01ProfilePage /> },
  { path: P.create, element: <S01CreateHousePage /> },
  { path: P.invite, element: <S02InvitePage /> },
  { path: P.join, element: <S13JoinPage /> },
  { path: P.joinConfirm, element: <S13CJoinConfirmPage /> },
  { path: P.joinWaiting, element: <S13WJoinWaitingPage /> },
  { path: P.waiting, element: <S03WaitingPage /> },
  { path: P.chores, element: <S04ChoresPage /> },
  { path: P.assign, element: <S05AssignPage /> },
  { path: P.cycle, element: <S06CyclePage /> },
];
