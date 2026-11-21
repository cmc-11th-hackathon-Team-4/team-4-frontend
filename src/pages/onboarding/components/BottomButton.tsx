import type { ButtonHTMLAttributes } from 'react';

interface BottomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

// 하단 CTA 버튼. 스타일은 디자인 확정 전 임시 무채색
function BottomButton({ variant = 'primary', className = '', ...props }: BottomButtonProps) {
  const base = 'h-13 w-full rounded-xl text-base font-semibold disabled:opacity-40';
  const color =
    variant === 'primary' ? 'bg-neutral-900 text-white' : 'bg-transparent text-neutral-700';
  return <button type="button" className={`${base} ${color} ${className}`} {...props} />;
}

export default BottomButton;
