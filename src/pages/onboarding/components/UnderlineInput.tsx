import { useId, type InputHTMLAttributes } from 'react';
import closeIcon from '@/assets/icons/close-fill.svg';

interface UnderlineInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** 밑줄 아래 안내 문구 */
  helperText?: string;
}

// 한 줄 입력 (피그마 Components · Form / Input · Underline: Empty / Filled / Focused)
function UnderlineInput({
  label,
  value,
  onChange,
  helperText,
  className = '',
  ...props
}: UnderlineInputProps) {
  const id = useId();
  const filled = value.length > 0;

  return (
    // 시안 수치: 라벨 0px, 값 35px(아이콘 34px), 밑줄 70px(2px), 전체 80px
    <div className={`group relative ${helperText ? 'h-28' : 'h-20'} ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm leading-[normal] text-gray-800 group-focus-within:text-primary-500"
      >
        {label}
      </label>
      <div className="absolute inset-x-0 top-[22px] flex h-12 items-center gap-2">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-base leading-[normal] font-medium text-gray-900 caret-primary-500 outline-none placeholder:text-gray-300"
          {...props}
        />
        {filled && (
          <button
            type="button"
            aria-label={`${label} 지우기`}
            onClick={() => onChange('')}
            className="flex size-6 shrink-0 items-center justify-center"
          >
            <img src={closeIcon} alt="" width={20} height={20} />
          </button>
        )}
      </div>
      <div
        aria-hidden
        className={`absolute inset-x-0 top-[70px] h-0.5 group-focus-within:bg-primary-500 ${
          filled ? 'bg-gray-400' : 'bg-line-700'
        }`}
      />
      {helperText && (
        <p className="absolute inset-x-0 top-[87px] text-sm leading-[normal] text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default UnderlineInput;
