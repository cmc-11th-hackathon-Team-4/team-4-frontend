import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
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

// 플로우 ① 공통 화면 틀. 스타일은 디자인 확정 전 임시 무채색
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
        <header className="relative flex h-14 items-center justify-center px-4">
          {showBack && (
            <button
              type="button"
              aria-label="뒤로가기"
              onClick={() => navigate(-1)}
              className="absolute left-2 flex size-10 items-center justify-center text-xl"
            >
              ‹
            </button>
          )}
          {title && <h1 className="text-base font-semibold">{title}</h1>}
        </header>
      )}

      <main className="flex flex-1 flex-col px-4 pt-4">
        {heading && <h2 className="text-2xl font-bold">{heading}</h2>}
        {description && <p className="mt-2 text-sm text-neutral-500">{description}</p>}
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
