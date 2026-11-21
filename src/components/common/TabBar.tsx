import { NavLink, useLocation } from 'react-router';
import homeIcon from '@/assets/icons/nav-home.svg';
import homeActiveIcon from '@/assets/icons/nav-home-active.svg';
import myIcon from '@/assets/icons/nav-my.svg';
import myActiveIcon from '@/assets/icons/nav-my-active.svg';
import settlementIcon from '@/assets/icons/nav-settlement.svg';
import settlementActiveIcon from '@/assets/icons/nav-settlement-active.svg';
import { MAIN_PATHS } from '@/routes/mainPaths';
import { MYPAGE_PATHS } from '@/routes/mypagePaths';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';

const TABS = [
  { to: MAIN_PATHS.home, label: '홈', icon: homeIcon, activeIcon: homeActiveIcon, end: true },
  {
    to: WEEKLY_PATHS.summary,
    label: '결산',
    icon: settlementIcon,
    activeIcon: settlementActiveIcon,
    end: false,
  },
  { to: MYPAGE_PATHS.my, label: '마이', icon: myIcon, activeIcon: myActiveIcon, end: false },
];

/** 하단 탭바 (공용): 홈 · 결산 · 마이 — 피그마 Components · Navigation / Bottom */
function TabBar() {
  const { pathname } = useLocation();
  const isHomeSub = pathname.startsWith('/member/');
  return (
    <nav className="sticky bottom-0 z-10 grid grid-cols-3 bg-white px-4 pt-[11px] pb-[max(28px,var(--safe-bottom))] shadow-[0_-4px_12px_rgba(174,174,174,0.25)]">
      {TABS.map(({ to, label, icon, activeIcon, end }) => (
        <NavLink key={to} to={to} end={end} className="flex h-[51px] flex-col items-center">
          {({ isActive: linkActive }) => {
            // 상대 상세(/member/…)도 홈 탭 (피그마 V5-07)
            const isActive = linkActive || (to === MAIN_PATHS.home && isHomeSub);
            return (
              <>
                <span className="mt-0.5 flex h-6 items-center justify-center">
                  <img src={isActive ? activeIcon : icon} alt="" />
                </span>
                <span
                  className={`mt-[3px] text-xs leading-[18px] ${
                    isActive ? 'font-bold text-primary-500' : 'text-gray-300'
                  }`}
                >
                  {label}
                </span>
              </>
            );
          }}
        </NavLink>
      ))}
    </nav>
  );
}

export default TabBar;
