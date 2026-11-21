import { IconHand, IconHeart } from '@/components/common/icons';
import { MAIN_TEXT } from '@/constants/main';

/** V5-11: 내 짐을 덜어간 사람에게 하트 */
export function HeartNotice({
  text,
  disabled,
  onHeart,
}: {
  text: string;
  disabled?: boolean;
  onHeart: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-900 bg-neutral-50 p-3">
      <IconHeart size={20} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{text}</p>
        <p className="text-[11px] text-neutral-500">{MAIN_TEXT.heartHint}</p>
      </div>
      <button
        type="button"
        aria-label={MAIN_TEXT.sendHeart}
        disabled={disabled}
        className="flex h-9 w-12 items-center justify-center rounded-full border border-neutral-900 bg-white disabled:opacity-40"
        onClick={onHeart}
      >
        <IconHeart size={18} />
      </button>
    </div>
  );
}

/** V5-10: 짐 올리기 부탁 받음 */
export function RequestNotice({
  text,
  disabled,
  onAccept,
  onDecline,
}: {
  text: string;
  disabled?: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="rounded-2xl border border-neutral-900 bg-neutral-50 p-3">
      <div className="flex items-start gap-3">
        <IconHand size={20} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{text}</p>
          <p className="text-[11px] text-neutral-500">{MAIN_TEXT.requestHint}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={disabled}
          className="h-9 flex-1 rounded-full border border-neutral-300 bg-white text-sm disabled:opacity-40"
          onClick={onDecline}
        >
          {MAIN_TEXT.requestDecline}
        </button>
        <button
          type="button"
          disabled={disabled}
          className="h-9 flex-1 rounded-full bg-neutral-900 text-sm font-semibold text-white disabled:opacity-40"
          onClick={onAccept}
        >
          {MAIN_TEXT.requestAccept}
        </button>
      </div>
    </div>
  );
}
