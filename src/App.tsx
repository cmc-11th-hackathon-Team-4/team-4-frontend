import { Outlet } from 'react-router';

// 모바일 셸: 폭·배경색은 디자인 확정 후 조정 (임시 무채색)
function App() {
  return (
    <div className="min-h-dvh w-full bg-neutral-100">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white pt-[var(--safe-top)] pr-[var(--safe-right)] pb-[var(--safe-bottom)] pl-[var(--safe-left)]">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
