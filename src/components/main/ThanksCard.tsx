import { MAIN_TEXT } from '@/constants/main';

interface ThanksCardProps {
  text: string;
  disabled?: boolean;
  onHeart: () => void;
}

/** 내 짐을 덜어간 사람에게 하트 보내기 (V3-01 내 메인 · 하트) */
function ThanksCard({ text, disabled, onHeart }: ThanksCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-900 p-3">
      <span className="size-9 shrink-0 rounded-full border border-neutral-300 bg-neutral-100" />
      <p className="min-w-0 flex-1 truncate text-sm font-semibold">{text}</p>
      <button
        type="button"
        disabled={disabled}
        className="shrink-0 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
        onClick={onHeart}
      >
        {MAIN_TEXT.sendHeart}
      </button>
    </div>
  );
}

export default ThanksCard;
