import type { ReactNode } from 'react';
import infoIconSm from '@/assets/icons/info-line-sm.svg';
import infoIcon from '@/assets/icons/info-line.svg';

interface InfoTextProps {
  children: ReactNode;
  /** md: 20px 아이콘 + S/14M gray-400 (S-01 등), sm: 16px 아이콘 + S/14R gray-500 (S-02 시안) */
  size?: 'md' | 'sm';
  className?: string;
}

// 안내 문구 (피그마 Icon/function/circle/line · Info)
function InfoText({ children, size = 'md', className = '' }: InfoTextProps) {
  const sm = size === 'sm';
  return (
    <p
      className={`flex items-center gap-1 break-keep text-sm leading-[normal] ${
        sm ? 'font-normal text-gray-500' : 'font-medium text-gray-400'
      } ${className}`}
    >
      <span aria-hidden className={`relative shrink-0 ${sm ? 'size-4' : 'size-5'}`}>
        <img
          src={sm ? infoIconSm : infoIcon}
          alt=""
          className={`absolute max-w-none ${
            sm
              ? 'top-[0.83px] left-[0.83px] size-[14.33px]'
              : 'top-[1.04px] left-[1.04px] size-[17.92px]'
          }`}
        />
      </span>
      {children}
    </p>
  );
}

export default InfoText;
