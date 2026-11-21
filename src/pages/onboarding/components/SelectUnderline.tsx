import type { ReactNode } from 'react';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';

interface SelectUnderlineProps {
  label: string;
  /** 보이는 값 */
  value: string;
  helperText?: string;
  /** 실제 선택은 투명하게 덮은 기기 기본 입력(select · date)으로 */
  children: ReactNode;
  className?: string;
}

/**
 * 밑줄 선택 입력 (피그마 Components · Form / Select · Underline)
 * - 시안 수치: 라벨 0px(14), 값 31px(20), 오른쪽 아래 화살표 24px, 밑줄 70px(1px), 안내 87px(12), 전체 112px
 * - 시안은 Empty 상태 한 가지라 값 색도 시안대로 gray-300
 */
function SelectUnderline({
  label,
  value,
  helperText,
  children,
  className = '',
}: SelectUnderlineProps) {
  return (
    <label className={`relative block h-28 leading-[normal] ${className}`}>
      <span className="block text-sm text-gray-500">{label}</span>
      <span className="absolute inset-x-0 top-[31px] flex items-center justify-between">
        <span className="text-xl text-gray-300">{value}</span>
        <img src={chevronDownIcon} alt="" width={24} height={24} />
      </span>
      <span aria-hidden className="absolute inset-x-0 top-[70px] h-px bg-line-800" />
      {helperText && (
        <span className="absolute inset-x-0 top-[87px] text-xs text-gray-500">{helperText}</span>
      )}
      <span className="absolute inset-x-0 top-5 h-[50px] [&>*]:size-full [&>*]:cursor-pointer [&>*]:opacity-0">
        {children}
      </span>
    </label>
  );
}

export default SelectUnderline;
