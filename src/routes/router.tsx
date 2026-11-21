import { createBrowserRouter } from 'react-router';
import App from '../App';
import { mainRoutes } from './main';
import { mypageRoutes } from './mypage';
import { onboardingRoutes } from './onboarding';
import { weeklyRoutes } from './weekly';

// 플로우별 라우트를 합치기만 함
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [...mainRoutes, ...onboardingRoutes, ...weeklyRoutes, ...mypageRoutes],
  },
]);
