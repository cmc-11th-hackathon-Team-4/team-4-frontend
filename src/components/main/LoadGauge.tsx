import { MAIN_TEXT, MAX_LOAD } from '@/constants/main';
import { STATUS_ICON } from '@/constants/mood';
import type { MemberStatus } from '@/types/member';
import HeartBurst from './HeartBurst';

interface LoadGaugeProps {
  count: number;
  status: MemberStatus;
  /** 새 하트를 받았을 때 캐릭터 뒤 하트 뿅뿅 (1회성). key가 바뀌면 다시 재생 */
  heartBurstKey?: string;
  onHeartBurstEnd?: () => void;
  /** 내 메인: 캐릭터를 누르면 기분 말풍선 (V5-01) */
  onCharacterClick?: () => void;
}

/** 캐릭터 + 오른쪽 반원 게이지: 맡은 짐이 많을수록 위에서부터 참 (1인 최대 5개) */
function LoadGauge({
  count,
  status,
  heartBurstKey,
  onHeartBurstEnd,
  onCharacterClick,
}: LoadGaugeProps) {
  const ratio = Math.min(count / MAX_LOAD, 1);
  const Face = STATUS_ICON[status];

  return (
    <div className="relative mx-auto size-[200px]">
      <svg viewBox="0 0 200 200" className="absolute inset-0">
        <path
          d="M 100 8 A 92 92 0 0 1 100 192"
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M 100 8 A 92 92 0 0 1 100 192"
          fill="none"
          stroke="#171717"
          strokeWidth="9"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${ratio * 100} 100`}
          className="transition-[stroke-dasharray] duration-500"
        />
      </svg>
      {/* TODO(디자인): '짐 3/5' 위치는 임시로 게이지 아래쪽 끝 */}
      <span className="absolute right-0 bottom-0 text-xs font-semibold text-neutral-600">
        {MAIN_TEXT.gaugeCount(count, MAX_LOAD)}
      </span>
      {/* 하트 뿅뿅은 캐릭터 뒤 (캐릭터보다 먼저 그림) */}
      {heartBurstKey && <HeartBurst key={heartBurstKey} onEnd={() => onHeartBurstEnd?.()} />}
      {/* TODO: 상태별 캐릭터 에셋으로 교체 */}
      <button
        type="button"
        aria-label={MAIN_TEXT.moodTitle}
        disabled={!onCharacterClick}
        className="absolute inset-[26px] flex items-center justify-center rounded-full border border-dashed border-neutral-300 bg-neutral-100 text-neutral-600 disabled:cursor-default"
        onClick={onCharacterClick}
      >
        <Face size={56} strokeWidth={1.4} />
      </button>
    </div>
  );
}

export default LoadGauge;
