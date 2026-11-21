import { MAIN_TEXT, MAX_LOAD } from '@/constants/main';
import { STATUS_LABEL } from '@/constants/status';
import type { MemberStatus } from '@/types/member';

interface LoadGaugeProps {
  count: number;
  status: MemberStatus;
  caption: string;
}

/** 반원 게이지: 짐이 많을수록 무거움 쪽으로 참 */
function LoadGauge({ count, status, caption }: LoadGaugeProps) {
  const ratio = Math.min(count / MAX_LOAD, 1);

  return (
    <div className="mx-auto w-[240px]">
      <div className="relative">
        <svg viewBox="0 0 200 110" className="w-full">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e5e5"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#171717"
            strokeWidth="8"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${ratio * 100} 100`}
            className="transition-[stroke-dasharray] duration-500"
          />
        </svg>
        {/* TODO: 상태별 캐릭터 에셋으로 교체 */}
        <div className="absolute bottom-1 left-1/2 flex size-[104px] -translate-x-1/2 items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 text-[10px] text-neutral-400">
          캐릭터 · {STATUS_LABEL[status]}
        </div>
      </div>
      <div className="flex justify-between px-1 text-[10px] text-neutral-400">
        <span>{MAIN_TEXT.gaugeLight}</span>
        <span>{MAIN_TEXT.gaugeHeavy}</span>
      </div>
      <p className="mt-1 text-center text-sm font-semibold">{caption}</p>
    </div>
  );
}

export default LoadGauge;
