import { IconClock, IconCube, IconX } from '@/components/common/icons';
import { MAIN_TEXT } from '@/constants/main';

interface ChoreTileProps {
  name: string;
  onClick?: () => void;
  /** 있으면 X(완료) 버튼 표시 */
  onComplete?: () => void;
  /** 짐 올리기 요청 중: '민지에게 요청 중' (onClick이 있으면 눌러서 취소) */
  pendingTo?: string;
}

/** 집안일 카드 (2열 그리드용) */
function ChoreTile({ name, onClick, onComplete, pendingTo }: ChoreTileProps) {
  if (pendingTo) {
    const Tag = onClick ? 'button' : 'div';
    return (
      <Tag
        {...(onClick ? { type: 'button' as const, onClick } : {})}
        className="flex h-[124px] w-full flex-col rounded-2xl border border-dashed border-neutral-300 p-3 text-left"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
          <IconClock size={18} />
        </span>
        <p className="mt-auto font-semibold text-neutral-400">{name}</p>
        <span className="mt-1 w-fit rounded-full border border-neutral-300 px-2 py-0.5 text-[10px] text-neutral-500">
          {MAIN_TEXT.requesting(pendingTo)}
        </span>
      </Tag>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-[124px] w-full flex-col rounded-2xl bg-neutral-100 p-3 text-left active:bg-neutral-200"
        onClick={onClick}
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-white">
          <IconCube size={18} />
        </span>
        <span className="mt-auto font-semibold">{name}</span>
        <span className="text-[11px] text-neutral-400">{MAIN_TEXT.thisWeek}</span>
      </button>
      {onComplete && (
        <button
          type="button"
          aria-label={`${name} 완료`}
          className="absolute top-0 right-0 flex size-11 items-center justify-center"
          onClick={onComplete}
        >
          {/* 보이는 원은 28px, 누르는 영역은 44px */}
          <span className="flex size-7 items-center justify-center rounded-full border border-neutral-900 bg-white">
            <IconX size={14} strokeWidth={2.4} />
          </span>
        </button>
      )}
    </div>
  );
}

export default ChoreTile;
