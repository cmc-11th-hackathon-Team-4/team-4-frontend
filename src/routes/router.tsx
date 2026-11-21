import { createBrowserRouter } from 'react-router';
import App from '../App';
import { mainRoutes } from './main';
import { weeklyRoutes } from './weekly';

// 플로우별 라우트를 합치기만 함 (① onboardingRoutes 추가 예정)
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [...mainRoutes, ...weeklyRoutes],
  },
]);
