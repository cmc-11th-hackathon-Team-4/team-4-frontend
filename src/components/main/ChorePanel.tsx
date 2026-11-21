import type { ReactNode } from 'react';

interface ChorePanelProps {
  title: string;
  hint: string;
  /** 그리드 위에 붙는 알림 카드 (하트·부탁) */
  notice?: ReactNode;
  emptyText: string;
  children: ReactNode[];
}

/** '오늘 내 집안일' / '민지의 짐' 흰 패널 + 2열 그리드 */
function ChorePanel({ title, hint, notice, emptyText, children }: ChorePanelProps) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-4">
      <h2 className="font-bold">{title}</h2>
      <p className="mt-0.5 text-[11px] text-neutral-500">{hint}</p>
      {notice && <div className="mt-3 flex flex-col gap-2">{notice}</div>}
      {children.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-neutral-300 py-8 text-center text-sm text-neutral-400">
          {emptyText}
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2.5">{children}</div>
      )}
    </section>
  );
}

export default ChorePanel;
