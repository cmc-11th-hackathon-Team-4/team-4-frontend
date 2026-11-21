import type { ButtonHTMLAttributes } from 'react';

type BottomButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'outline';
};

/** 화면 하단 큰 버튼 (공용) */
function BottomButton({ variant = 'outline', className = '', ...props }: BottomButtonProps) {
  const style =
    variant === 'solid' ? 'bg-neutral-900 text-white' : 'border border-neutral-300 bg-white';
  return (
    <button
      type="button"
      className={`h-12 w-full rounded-xl text-sm font-semibold disabled:opacity-40 ${style} ${className}`}
      {...props}
    />
  );
}

export default BottomButton;
