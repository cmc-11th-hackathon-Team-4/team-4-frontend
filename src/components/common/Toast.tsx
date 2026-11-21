import { useEffect } from 'react';
import { useToastStore } from '@/stores/toast';

const DURATION = 4000;

/** App에 한 번만 두는 전역 토스트 */
function Toast() {
  const { message, action, hide } = useToastStore();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(hide, DURATION);
    return () => clearTimeout(timer);
  }, [message, action, hide]);

  if (!message) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-28 z-50 flex justify-center px-4">
      <div
        role="status"
        className="pointer-events-auto flex max-w-[360px] items-center gap-3 rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm break-keep text-white shadow-lg"
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
