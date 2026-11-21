import { NavLink } from 'react-router';
import { MAIN_PATHS } from '@/routes/mainPaths';
import { MYPAGE_PATHS } from '@/routes/mypagePaths';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { IconChart, IconHome, IconUser } from './icons';

const TABS = [
  { to: MAIN_PATHS.home, label: '홈', Icon: IconHome, end: true },
  { to: WEEKLY_PATHS.summary, label: '결산', Icon: IconChart, end: false },
  { to: MYPAGE_PATHS.my, label: '마이', Icon: IconUser, end: false },
];

/** 하단 탭바 (공용): 홈 · 결산 · 마이 */
function TabBar() {
  return (
    <nav className="sticky bottom-0 z-10 grid grid-cols-3 border-t border-neutral-200 bg-white pt-2 pb-[calc(8px+var(--safe-bottom))]">
      {TABS.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[11px] ${isActive ? 'font-semibold text-neutral-900' : 'text-neutral-400'}`
          }
        >
          <Icon size={22} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default TabBar;
