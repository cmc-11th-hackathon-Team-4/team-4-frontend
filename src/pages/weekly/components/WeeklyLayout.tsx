import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import TabBar from '@/components/common/TabBar';

const STEPS = ['summary', 'result', 'carryOver', 'best', 'next'] as const;
export type WeeklyStep = (typeof STEPS)[number];

interface WeeklyLayoutProps {
  step: WeeklyStep;
  /** 내 못 한 일이 없어 S-10을 건너뛰면 점 4개 */
  skipCarryOver?: boolean;
  showBack?: boolean;
  children?: ReactNode;
  /** 하단 고정 버튼 영역 */
  footer?: ReactNode;
}

// 플로우 ③ 공통 화면 틀. 스타일은 디자인 확정 전 임시 무채색
function WeeklyLayout({
  step,
  skipCarryOver = false,
  showBack = true,
  children,
  footer,
}: WeeklyLayoutProps) {
  const navigate = useNavigate();
  const steps = skipCarryOver ? STEPS.filter((s) => s !== 'carryOver') : STEPS;

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 items-center px-4">
        {showBack && (
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={() => navigate(-1)}
            className="-ml-2 flex size-10 items-center justify-center text-xl"
          >
            ‹
          </button>
        )}
        <h1 className="text-lg font-bold">이번 주 결산</h1>
        <div className="ml-auto flex items-center gap-1.5">
          {steps.map((s) => (
            <span
              key={s}
              className={`h-2.5 rounded-full ${s === step ? 'w-6 bg-neutral-900' : 'w-2.5 bg-neutral-300'}`}
            />
          ))}
        </div>
      </header>

      <main className="flex flex-1 flex-col px-5 pt-4 pb-4">{children}</main>

      {footer && <footer className="flex flex-col gap-2 p-5">{footer}</footer>}

      <TabBar />
    </div>
  );
}

export default WeeklyLayout;
