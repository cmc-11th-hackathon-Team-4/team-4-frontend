import { NavLink } from 'react-router';
import { IconChart, IconHome, IconUser } from './icons';

// TODO: 결산(③)·마이 경로 확정되면 연결
const TABS = [
  { to: '/', label: '홈', Icon: IconHome, end: true },
  { to: '/weekly', label: '결산', Icon: IconChart, end: false },
  { to: '/my', label: '마이', Icon: IconUser, end: false },
];

/** 하단 탭바 (공용) */
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
