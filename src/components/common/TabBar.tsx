import { NavLink } from 'react-router';
import { useToastStore } from '@/stores/toast';
import { IconChart, IconHome, IconUser } from './icons';

const ACTIVE = 'font-semibold text-neutral-900';
const IDLE = 'text-neutral-400';
const ITEM = 'flex flex-col items-center gap-0.5 text-[11px]';

/** 하단 탭바 (공용). 마이는 화면이 생기면 NavLink로 교체 */
function TabBar() {
  const showToast = useToastStore((s) => s.show);

  return (
    <nav className="sticky bottom-0 z-10 grid grid-cols-3 border-t border-neutral-200 bg-white pt-2 pb-[calc(8px+var(--safe-bottom))]">
      <NavLink to="/" end className={({ isActive }) => `${ITEM} ${isActive ? ACTIVE : IDLE}`}>
        <IconHome size={22} />홈
      </NavLink>
      {/* TODO: router.tsx에 weeklyRoutes 연결되면 동작 */}
      <NavLink to="/weekly" className={({ isActive }) => `${ITEM} ${isActive ? ACTIVE : IDLE}`}>
        <IconChart size={22} />
        결산
      </NavLink>
      <button
        type="button"
        className={`${ITEM} ${IDLE}`}
        onClick={() => showToast('준비 중이에요')}
      >
        <IconUser size={22} />
        마이
      </button>
    </nav>
  );
}

export default TabBar;
