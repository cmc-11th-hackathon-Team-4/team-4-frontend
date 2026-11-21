import { createBrowserRouter } from 'react-router';
import App from '../App';
import { mainRoutes } from './main';

// 플로우별 라우트를 합치기만 함 (① onboardingRoutes, ③ weeklyRoutes 추가 예정)
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [...mainRoutes],
  },
]);
