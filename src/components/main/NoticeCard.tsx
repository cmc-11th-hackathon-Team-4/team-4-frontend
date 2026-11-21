import { MAIN_TEXT } from '@/constants/main';

interface NoticeCardProps {
  title: string;
  count: number;
  onClick: () => void;
}

/** 지친 구성원 알림 카드 (V3-01) */
function NoticeCard({ title, count, onClick }: NoticeCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-neutral-400 p-3">
      <span className="size-9 shrink-0 rounded-full border border-neutral-300 bg-neutral-100" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="text-xs text-neutral-500">{MAIN_TEXT.noticeSub(count)}</p>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white"
        onClick={onClick}
      >
        {MAIN_TEXT.noticeButton}
      </button>
    </div>
  );
}

export default NoticeCard;
