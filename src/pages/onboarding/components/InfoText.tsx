import type { ReactNode } from 'react';
import infoIcon from '@/assets/icons/info-line.svg';

// 안내 문구 (피그마 Icon/function/circle/line · Info + S/14M gray-400)
function InfoText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`flex items-center gap-1 break-keep text-sm leading-[normal] font-medium text-gray-400 ${className}`}
    >
      <span aria-hidden className="relative size-5 shrink-0">
        <img
          src={infoIcon}
          alt=""
          className="absolute top-[1.04px] left-[1.04px] size-[17.92px] max-w-none"
        />
      </span>
      {children}
    </p>
  );
}

export default InfoText;
