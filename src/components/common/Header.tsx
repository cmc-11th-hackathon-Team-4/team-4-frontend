import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import backIcon from '@/assets/icons/back.svg';
import settingIcon from '@/assets/icons/setting.svg';

interface HeaderProps {
  /** main: 왼쪽 큰 제목 (탭 첫 화면) / default: ‹ + 가운데 제목 */
  variant?: 'main' | 'default';
  title: string;
  /** default: 뒤로가기 동작 (기본 navigate(-1)) */
  onBack?: () => void;
  /** 오른쪽 영역 (예: HeaderSettingButton) */
  right?: ReactNode;
}

/**
 * 상단 헤더 (공용) — 피그마 Components · Header
 * - Property 1=Main: 28 Bold 제목 + 오른쪽 아이콘
 * - Property 1=Default: 뒤로가기 + 18 SemiBold 가운데 제목
 * (Property 1=Step은 ① OnboardingLayout에 있음)
 */
function Header({ variant = 'main', title, onBack, right }: HeaderProps) {
  const navigate = useNavigate();

  if (variant === 'main') {
    return (
      <header className="flex h-14 shrink-0 items-center justify-between px-4">
        <h1 className="text-[28px] leading-[normal] font-bold text-gray-800">{title}</h1>
        {right}
      </header>
    );
  }

  return (
    <header className="grid h-14 shrink-0 grid-cols-[24px_1fr_24px] items-center px-4">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={onBack ?? (() => navigate(-1))}
        className="-m-2 flex size-10 items-center justify-center"
      >
        <img src={backIcon} alt="" width={24} height={24} />
      </button>
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
