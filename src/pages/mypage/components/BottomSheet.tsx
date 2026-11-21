import type { ReactNode } from 'react';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';

interface BottomSheetProps {
  title: string;
  onClose: () => void;
  children?: ReactNode;
  /** 하단 버튼 */
  footer?: ReactNode;
}

/** V5-12에서 여는 바텀시트 (V5-13 · V5-14). 부모에서 열 때만 렌더 */
function BottomSheet({ title, onClose, children, footer }: BottomSheetProps) {
  // 키보드가 올라오면 시트(버튼 포함)도 함께 올라감
  const keyboardInset = useKeyboardInset();

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-[430px] rounded-t-3xl bg-white px-5 pt-3 pb-[calc(20px+var(--safe-bottom))]"
        style={{ marginBottom: keyboardInset }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line-700" />
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {children}
        {footer && <div className="mt-8">{footer}</div>}
      </div>
    </div>
  );
}

export default BottomSheet;
