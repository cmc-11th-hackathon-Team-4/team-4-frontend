import { useEffect, useRef } from 'react';
import { IconHeart } from '@/components/common/icons';

const DURATION = 1600;
// 캐릭터 뒤에서 퍼지는 하트 위치 (원 중심 기준 x, y px)
const HEARTS = [
  { x: -112, y: -78, delay: 0 },
  { x: 108, y: -92, delay: 120 },
  { x: -128, y: 10, delay: 240 },
  { x: 124, y: 4, delay: 80 },
  { x: -64, y: -124, delay: 300 },
  { x: 56, y: -130, delay: 200 },
];

/** 하트 받았을 때 캐릭터 뒤 하트 뿅뿅 (1회 재생 후 onEnd) */
function HeartBurst({ onEnd, color }: { onEnd: () => void; color?: string }) {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onEndRef.current = onEnd;
  });

  useEffect(() => {
    const animations = refs.current.map((el, i) => {
      const { x, y, delay } = HEARTS[i];
      return el?.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
          {
            transform: `translate(calc(-50% + ${x * 0.6}px), calc(-50% + ${y * 0.6}px)) scale(1.2)`,
            opacity: 1,
            offset: 0.35,
          },
          {
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y - 20}px)) scale(0.9)`,
            opacity: 0,
          },
        ],
        { duration: DURATION, delay, easing: 'ease-out', fill: 'forwards' },
      );
    });
    const timer = setTimeout(() => onEndRef.current(), DURATION + 400);
    return () => {
      clearTimeout(timer);
      animations.forEach((a) => a?.cancel());
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {HEARTS.map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute top-1/2 left-1/2 text-neutral-900 opacity-0"
          style={{ color }}
        >
          <IconHeart size={i % 2 ? 18 : 24} fill="currentColor" />
        </span>
      ))}
    </div>
  );
}

export default HeartBurst;
