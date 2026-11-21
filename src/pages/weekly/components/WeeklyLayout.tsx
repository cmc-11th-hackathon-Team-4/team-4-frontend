import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Header from '@/components/common/Header';
import TabBar from '@/components/common/TabBar';
import { WEEKLY_STEP_TOTAL } from '../steps';

interface WeeklyLayoutProps {
  /** 헤더 오른쪽 n/5. 없으면 첫 화면(S-08): 뒤로가기 · 단계 · 하단 탭 없음 */
  step?: number;
  /** 큰 제목 (두 줄이면 \n) */
  title?: ReactNode;
  /** 제목 아래 설명 */
  description?: ReactNode;
  children?: ReactNode;
  /** 하단 버튼 영역 */
  footer?: ReactNode;
}

/**
 * 플로우 ③ 공통 화면 틀 — 피그마 ③ 주간 종료 플로우 디자인 (S-08 ~ S-12)
 * 헤더 "이번 주 결산" + n/5, 제목 28 SemiBold · 설명 16 Medium, 하단 CTA + 탭바
 */
function WeeklyLayout({ step, title, description, children, footer }: WeeklyLayoutProps) {
  const isFirst = step === undefined;

  return (
    <div className="flex flex-1 flex-col">
      <Header
        variant="default"
        title="이번 주 결산"
        showBack={!isFirst}
        right={
          !isFirst && (
            <span className="text-sm leading-[normal] font-medium whitespace-nowrap text-primary-500">
              {step}/{WEEKLY_STEP_TOTAL}
            </span>
          )
        }
      />

      <main className="flex flex-1 flex-col px-4 pb-4">
        {title && (
          <h2 className="mt-8 text-[28px] leading-[normal] font-semibold whitespace-pre-line text-gray-800">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-5 text-base leading-[normal] font-medium text-gray-500">{description}</p>
        )}
        {children}
      </main>

      {/* 하단 CTA: 위쪽은 흰색으로 흐려짐 */}
      {footer && (
        <footer className="sticky bottom-0 flex flex-col gap-3 bg-gradient-to-b from-white/0 from-[20%] to-white px-4 pt-3 pb-4">
          {footer}
        </footer>
      )}

      {!isFirst && <TabBar />}
    </div>
  );
}

/** 결산 하단 버튼: primary(보라 꽉 참) / secondary(연보라 + 테두리, S-12 다시 나누기) */
export function WeeklyButton({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  const style =
    variant === 'primary'
      ? 'rounded-xl bg-primary-500 text-white disabled:bg-line-500 disabled:text-gray-300'
      : 'rounded-[14px] border-[1.5px] border-primary-400 bg-primary-100 text-primary-500 disabled:opacity-40';
  return (
    <button
      type="button"
      className={`h-[54px] w-full text-lg leading-[normal] font-semibold ${style} ${className}`}
      {...props}
    />
  );
}

export default WeeklyLayout;
