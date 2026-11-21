import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  hint: string;
  children: ReactNode;
}

/** 메인 아래 반투명 카드 (피그마 "내 구성원" · "오늘 내 짐" 카드) */
function SectionCard({ title, hint, children }: SectionCardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-white bg-white/50 py-4 pr-4 pl-3.5">
      <div className="flex flex-col gap-1 leading-[normal]">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <p className="text-xs font-medium text-gray-500">{hint}</p>
      </div>
      {children}
    </section>
  );
}

export default SectionCard;
