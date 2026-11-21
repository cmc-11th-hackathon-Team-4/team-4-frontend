import { MAIN_TEXT, MAX_LOAD } from '@/constants/main';
import { STATUS_ICON } from '@/constants/mood';
import type { MemberStatus } from '@/types/member';

interface LoadGaugeProps {
  count: number;
  status: MemberStatus;
  /** 받은 하트 수 (내 캐릭터 옆 하트) */
  hearts?: number;
}

/** 캐릭터 + 오른쪽 반원 게이지: 내가 맡은 짐이 많을수록 위에서부터 참 (최대 10개) */
function LoadGauge({ count, status, hearts = 0 }: LoadGaugeProps) {
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
      {/* TODO: 상태별 캐릭터 에셋으로 교체 */}
      <div className="absolute inset-[26px] flex items-center justify-center rounded-full border border-dashed border-neutral-300 bg-neutral-100 text-neutral-600">
        <Face size={56} strokeWidth={1.4} />
      </div>
      {hearts > 0 && (
        <span
          key={hearts}
          className="absolute top-4 left-2 animate-bounce rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-bold text-white [animation-iteration-count:2]"
        >
          {MAIN_TEXT.heartCount(hearts)}
        </span>
      )}
    </div>
  );
}

export default LoadGauge;
