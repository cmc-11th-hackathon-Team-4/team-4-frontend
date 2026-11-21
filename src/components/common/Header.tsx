import type { ReactNode } from 'react';
import backIcon from '@/assets/icons/back.svg';
import settingIcon from '@/assets/icons/setting.svg';
import { useGoBack } from '@/hooks/useGoBack';

interface HeaderProps {
  /** main: 왼쪽 큰 제목 (탭 첫 화면) / default: ‹ + 가운데 제목 */
  variant?: 'main' | 'default';
  title: string;
  /** default: 뒤로가기 동작 (기본: 이전 화면, 첫 화면이면 backTo) */
  onBack?: () => void;
  /** 이전 화면이 없을 때 갈 곳 (기본 내 메인 /) */
  backTo?: string;
  /** default: 뒤로가기 표시 (흐름 첫 화면은 false) */
  showBack?: boolean;
  /** 오른쪽 영역 (예: HeaderSettingButton, 단계 n/5) */
  right?: ReactNode;
}

/**
 * 상단 헤더 (공용) — 피그마 Components · Header
 * - Property 1=Main: 28 Bold 제목 + 오른쪽 아이콘
 * - Property 1=Default: 뒤로가기 + 18 SemiBold 가운데 제목
 * (Property 1=Step은 ① OnboardingLayout에 있음)
 */
function Header({
  variant = 'main',
  title,
  onBack,
  backTo = '/',
  showBack = true,
  right,
}: HeaderProps) {
  const goBack = useGoBack(backTo);

  if (variant === 'main') {
    return (
      <header className="flex h-14 shrink-0 items-center justify-between px-4">
        <h1 className="text-[28px] leading-[normal] font-bold text-gray-800">{title}</h1>
        {right}
      </header>
    );
  }

  return (
    <header className="grid h-14 shrink-0 grid-cols-[32px_1fr_32px] items-center px-4">
      {showBack ? (
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={onBack ?? goBack}
          className="-m-2 flex size-10 items-center justify-center"
        >
          <img src={backIcon} alt="" width={24} height={24} />
        </button>
      ) : (
        <span />
      )}
      <h1 className="text-center text-lg leading-[normal] font-semibold text-gray-800">{title}</h1>
      <span className="flex justify-end">{right}</span>
    </header>
  );
}

/** 헤더 오른쪽 설정(톱니) 버튼 */
export function HeaderSettingButton({
  onClick,
  label = '설정',
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="-m-2 flex size-10 items-center justify-center"
    >
      <img src={settingIcon} alt="" width={24} height={24} />
    </button>
  );
}

export default Header;
