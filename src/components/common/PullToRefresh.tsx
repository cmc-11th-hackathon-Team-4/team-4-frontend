import { useRef, useState, type ReactNode, type TouchEvent } from 'react';

const THRESHOLD = 64; // 이만큼 당기면 새로고침
const MAX_PULL = 96;

interface PullToRefreshProps {
  onRefresh: () => Promise<unknown>;
  children: ReactNode;
}

/**
 * 맨 위에서 아래로 당기면 새로고침 (V5-01 명세). 터치 기기에서만 동작
 * 이 영역이 스크롤 영역 (위 · 아래 고정 영역 사이)
 */
function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const startY = useRef<number | null>(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onTouchStart = (e: TouchEvent) => {
    startY.current = e.currentTarget.scrollTop <= 0 && !refreshing ? e.touches[0].clientY : null;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (startY.current === null) return;
    const dy = e.touches[0].clientY - startY.current;
    setPull(dy > 0 ? Math.min(dy * 0.5, MAX_PULL) : 0);
  };

  const onTouchEnd = async () => {
    if (startY.current === null) return;
    startY.current = null;
    if (pull < THRESHOLD) {
      setPull(0);
      return;
    }
    setRefreshing(true);
    setPull(THRESHOLD);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
      setPull(0);
    }
  };

  return (
    <div
      className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <div
        aria-hidden={!refreshing}
        className="flex items-end justify-center overflow-hidden transition-[height] duration-200"
        style={{ height: pull }}
      >
        <span
          role={refreshing ? 'status' : undefined}
          aria-label={refreshing ? '새로고침 중' : undefined}
          className={`mb-3 size-6 rounded-full border-2 border-neutral-300 border-t-neutral-900 ${refreshing ? 'animate-spin' : ''}`}
          style={{ transform: refreshing ? undefined : `rotate(${pull * 4}deg)` }}
        />
      </div>
      {children}
    </div>
  );
}

export default PullToRefresh;
