import type { ReactNode } from 'react';
import heartIcon from '@/assets/icons/heart-button.svg';
import { MAIN_TEXT } from '@/constants/main';

/** "오늘 내 짐" 맨 위 알림 카드 (피그마 V5-10 부탁 받음 · V5-11 덜어감 알림) */
function NoticeCard({ title, hint, action }: { title: string; hint: string; action: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-white py-3 pr-3 pl-4 shadow-[0_1px_3px_rgba(113,113,113,0.25)]">
      <div className="flex min-w-0 flex-col gap-1 leading-[normal]">
        <p className="font-semibold break-keep text-gray-800">{title}</p>
        <p className="text-xs font-medium text-gray-500">{hint}</p>
      </div>
      {action}
    </div>
  );
}

interface RequestNoticeProps {
  text: string;
  disabled?: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

/** V5-10 부탁 받음: [다음에] [받을게요] */
export function RequestNotice({ text, disabled, onAccept, onDecline }: RequestNoticeProps) {
  return (
    <NoticeCard
      title={text}
      hint={MAIN_TEXT.requestHint}
      action={
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            disabled={disabled}
            className="h-8 rounded-2xl bg-white px-2 text-sm leading-[normal] font-medium whitespace-nowrap text-gray-500 disabled:opacity-40"
            onClick={onDecline}
          >
            {MAIN_TEXT.requestDecline}
          </button>
          <button
            type="button"
            disabled={disabled}
            className="h-8 rounded-2xl bg-primary-500 px-2 text-sm leading-[normal] font-medium whitespace-nowrap text-white disabled:opacity-40"
            onClick={onAccept}
          >
            {MAIN_TEXT.requestAccept}
          </button>
        </div>
      }
    />
  );
}

interface HeartNoticeProps {
  text: string;
  disabled?: boolean;
  onHeart: () => void;
}

/** V5-11 덜어감 알림: 하트 버튼 */
export function HeartNotice({ text, disabled, onHeart }: HeartNoticeProps) {
  return (
    <NoticeCard
      title={text}
      hint={MAIN_TEXT.heartHint}
      action={
        <button
          type="button"
          aria-label={MAIN_TEXT.sendHeart}
          disabled={disabled}
          className="-m-2 shrink-0 p-2 disabled:opacity-40"
          onClick={onHeart}
        >
          <img src={heartIcon} alt="" width={24} height={24} />
        </button>
      }
    />
  );
}
