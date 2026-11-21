import { useId } from 'react';
import { MAX_LOAD } from '@/constants/main';

// 피그마 "게이지" 318px: 중심 (159,159) · 반지름 151 · 두께 15.9
// 왼쪽 아래(162.35°)에서 위를 지나 오른쪽 아래(17.8°)까지 215.5° 호
const SIZE = 318;
const C = 159;
const R = 151;
const START = 162.35;
const SWEEP = 215.5;
/** 짐이 가득(5개)일 때 손잡이 위치: 시안 (278.5, 65.6) = 호의 74% 지점. 그 뒤는 흰색으로 사라지는 꼬리 */
const FULL_AT = 0.7408;

const point = (deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: C + R * Math.cos(rad), y: C + R * Math.sin(rad) };
};

interface LoadGaugeProps {
  /** 맡은 짐 수 (1인 최대 5개) */
  count: number;
  /** 테마 색 (게이지 · 손잡이 테두리) */
  color: string;
  /** 손잡이 그림자 색 */
  glow: string;
  className?: string;
}

/** 캐릭터를 감싸는 호 게이지: 손잡이가 맡은 짐 수만큼 왼쪽 아래 → 오른쪽 위(가득)로 이동 */
function LoadGauge({ count, color, glow, className = '' }: LoadGaugeProps) {
  const id = useId();
  const ratio = Math.min(Math.max(count / MAX_LOAD, 0), 1);
  const start = point(START);
  const end = point(START + SWEEP);
  const knob = point(START + SWEEP * FULL_AT * ratio);

  return (
    <svg
      aria-hidden
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      fill="none"
      className={`overflow-visible ${className}`}
    >
      <defs>
        {/* 시안 그대로: 오른쪽 아래 흰색 → 왼쪽 테마색 */}
        <radialGradient
          id={`${id}-g`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(300.483 209.754) rotate(-178.835) scale(287.068 230.579)"
        >
          <stop offset="0.0053" stopColor="white" stopOpacity="0.8" />
          <stop offset="1" stopColor={color} />
        </radialGradient>
        <filter id={`${id}-s`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={glow} />
        </filter>
      </defs>
      <path
        d={`M ${start.x} ${start.y} A ${R} ${R} 0 1 1 ${end.x} ${end.y}`}
        stroke={`url(#${id}-g)`}
        strokeWidth={15.9}
        strokeLinecap="round"
      />
      <circle
        cx={knob.x}
        cy={knob.y}
        r={10.78}
        fill="white"
        fillOpacity={0.8}
        stroke={color}
        strokeWidth={5.39}
        filter={`url(#${id}-s)`}
        className="transition-all duration-500"
      />
    </svg>
  );
}

export default LoadGauge;
