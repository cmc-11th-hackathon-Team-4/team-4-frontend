import type { ButtonHTMLAttributes } from 'react';

interface BottomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: 피그마 Button / Primary (Large), secondary: 텍스트 버튼 */
  variant?: 'primary' | 'secondary';
}

// 하단 버튼 (피그마 Components · Button / Primary 기준)
function BottomButton({ variant = 'primary', className = '', ...props }: BottomButtonProps) {
  const style =
    variant === 'primary'
      ? 'h-[54px] rounded-[14px] px-5 text-lg font-semibold bg-primary-500 text-white disabled:bg-line-500 disabled:text-gray-300'
      : 'py-2 text-sm font-medium text-gray-600 disabled:text-gray-300';
  return (
    <button type="button" className={`w-full leading-[normal] ${style} ${className}`} {...props} />
  );
}

export default BottomButton;
