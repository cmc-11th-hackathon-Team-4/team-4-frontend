import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import backIcon from '@/assets/icons/back.svg';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';

interface OnboardingLayoutProps {
  /** 상단 바 화면명 */
  title?: string;
  /** 뒤로가기 표시 여부 */
  showBack?: boolean;
  /** 큰 제목 */
  heading?: string;
  /** 제목 아래 설명 */
  description?: string;
  children?: ReactNode;
  /** 하단 고정 버튼 영역 */
  footer?: ReactNode;
}

// 플로우 ① 공통 화면 틀 (피그마 Components · Header, 비주얼 시안 SubTitle 기준)
function OnboardingLayout({
  title,
  showBack = true,
  heading,
  description,
  children,
  footer,
}: OnboardingLayoutProps) {
  const navigate = useNavigate();
  const keyboardInset = useKeyboardInset();

  return (
    <div className="flex flex-1 flex-col">
      {(title || showBack) && (
        <header className="grid h-14 grid-cols-[24px_1fr_24px] items-center px-4">
          {showBack ? (
            <button
              type="button"
              aria-label="뒤로가기"
              onClick={() => navigate(-1)}
              className="-m-2 flex size-10 items-center justify-center"
            >
              <img src={backIcon} alt="" width={24} height={24} />
            </button>
          ) : (
            <span />
          )}
          {title && (
            <h1 className="text-center text-lg leading-[normal] font-semibold text-gray-800">
              {title}
            </h1>
          )}
        </header>
      )}

      <main className="flex flex-1 flex-col px-4 pt-10 break-keep">
        {heading && (
          <h2 className="text-[28px] leading-[normal] font-semibold text-gray-800">{heading}</h2>
        )}
        {description && (
          <p className="mt-4 text-base leading-[normal] font-medium text-gray-500">{description}</p>
        )}
        {children}
      </main>

      {footer && (
        // 키보드가 올라오면 버튼도 함께 올라감 (S-01 명세)
        <footer
          className="sticky bottom-0 flex flex-col gap-2 bg-white p-4"
          style={{ transform: `translateY(-${keyboardInset}px)` }}
        >
          {footer}
        </footer>
      )}
    </div>
  );
}

export default OnboardingLayout;
