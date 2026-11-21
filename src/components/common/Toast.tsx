import { useEffect } from 'react';
import { useToastStore } from '@/stores/toast';

const DURATION = 4000;

/** App에 한 번만 두는 전역 토스트 — 피그마 toast (354 × 52, 하단 탭 위) */
function Toast() {
  const { message, action, hide } = useToastStore();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(hide, DURATION);
    return () => clearTimeout(timer);
  }, [message, action, hide]);

  if (!message) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(122px+var(--safe-bottom))] z-50 flex justify-center px-6">
      <div
        role="status"
        className="pointer-events-auto flex min-h-[52px] w-full max-w-[354px] items-center justify-center gap-3 rounded-[14px] bg-gray-800/92 px-4 py-2.5 text-center text-sm leading-[normal] font-medium break-keep text-white"
      >
        <span>{message}</span>
        {action && (
          <button
            type="button"
            className="font-bold"
            onClick={() => {
              action.onClick();
              hide();
            }}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

export default Toast;
