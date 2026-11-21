import { useRef } from 'react';
import checkIcon from '@/assets/icons/checkbox-card.svg';
import { MAIN_TEXT } from '@/constants/main';
import { DEFAULT_CHORE_ICON, choreIconOf } from '@/constants/choreIcons';
import ChoreIcon from '@/pages/onboarding/components/ChoreIcon';

const LONG_PRESS_MS = 450;

interface ChoreCardProps {
  name: string;
  /** 아래 작은 글씨: 마감('이번 주까지') 또는 '○○님에게 부탁 중' */
  caption: string;
  /** 부탁 중: 반투명 */
  dimmed?: boolean;
  /** 카드 누르기 · 길게 누르기 */
  onPress?: () => void;
  /** 오른쪽 위 체크 (완료). 없으면 체크는 장식 */
  onComplete?: () => void;
}

/** 집안일 카드 161px (피그마 "할일키드": 아이콘 · 체크 · 이름 · 마감) */
function ChoreCard({ name, caption, dimmed = false, onPress, onComplete }: ChoreCardProps) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired = useRef(false);
  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  return (
    <div
      className={`relative flex flex-col gap-2 rounded-xl bg-white py-3 pr-2 pl-3 shadow-[0_1px_3px_rgba(113,113,113,0.25)] ${
        dimmed ? 'opacity-50' : ''
      }`}
    >
      {/* 카드 전체 버튼: 탭 또는 길게 눌러 (시안 안내 문구) */}
      <button
        type="button"
        aria-label={name}
        disabled={!onPress}
        className="absolute inset-0 rounded-xl disabled:cursor-default"
        onPointerDown={() => {
          fired.current = false;
          timer.current = setTimeout(() => {
            fired.current = true;
            onPress?.();
          }, LONG_PRESS_MS);
        }}
        onPointerUp={clear}
        onPointerLeave={clear}
        onPointerCancel={clear}
        onContextMenu={(e) => e.preventDefault()}
        onClick={() => {
          clear();
          if (!fired.current) onPress?.();
        }}
      />
      <div className="pointer-events-none flex items-start justify-between">
        <span
          className={`relative size-10 rounded-xl ${
            choreIconOf(name) === DEFAULT_CHORE_ICON ? 'bg-line-600' : 'bg-white'
          }`}
        >
          <ChoreIcon name={name} className="absolute top-1/2 left-1/2 -translate-1/2" />
        </span>
        {onComplete ? (
          <button
            type="button"
            aria-label={MAIN_TEXT.completeChore(name)}
            className="pointer-events-auto relative -m-2 p-2"
            onClick={onComplete}
          >
            <img src={checkIcon} alt="" width={20} height={20} />
          </button>
        ) : (
          <img src={checkIcon} alt="" width={20} height={20} />
        )}
      </div>
      <div className="pointer-events-none flex min-w-0 flex-col gap-1 leading-[normal]">
        <p className="truncate font-semibold text-gray-800">{name}</p>
        <p className="truncate text-xs font-medium text-gray-500">{caption}</p>
      </div>
    </div>
  );
}

export default ChoreCard;
