import { Outlet } from 'react-router';
import Toast from '@/components/common/Toast';
import NotificationBanner from '@/components/main/NotificationBanner';
import StartGate from '@/pages/onboarding/StartGate';

/**
 * 모바일 셸
 * - 폰(폭 500px 미만): 화면 전체
 * - 넓은 화면: 피그마 프레임 비율 402 × 874 (창이 낮으면 창 높이에 맞춤)
 * - 프레임에 transform을 줘서 팝업 · 토스트 · 배너(position: fixed)가 브라우저가 아니라 프레임 기준으로 뜸
 * - 스크롤은 프레임 안쪽에서만 (하단 탭 sticky도 이 영역 기준)
 */
function App() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-neutral-100">
      <div className="relative flex h-dvh w-full max-w-[430px] [transform:translateZ(0)] flex-col overflow-hidden bg-white pt-[var(--safe-top)] pr-[var(--safe-right)] pb-[var(--safe-bottom)] pl-[var(--safe-left)] min-[500px]:h-[min(874px,100dvh)] min-[500px]:w-[402px] min-[500px]:shadow-xl">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {/* ① 앱 첫 화면 분기: `/` 로 열면 서버 상태에 따라 /welcome 등으로 */}
          <StartGate>
            <Outlet />
          </StartGate>
        </div>
        <Toast />
        <NotificationBanner />
      </div>
    </div>
  );
}

export default App;
