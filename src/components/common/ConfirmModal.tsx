interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** 공용 확인 팝업 — 피그마 Components · Modal / Confirm (342 × 180) */
function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(18,18,18,0.45)] px-[30px]"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[342px] rounded-[20px] bg-white px-5 pt-[22px] pb-6 text-center leading-[normal]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-[#26242d]">{title}</h2>
        {description && <p className="mt-3 text-sm break-keep text-[#878d99]">{description}</p>}
        <div className="mt-7 flex gap-2">
          <button
            type="button"
            className="h-12 flex-1 rounded-xl bg-[#f1f2f5] font-bold text-[#454a54]"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="h-12 flex-1 rounded-xl bg-primary-500 font-bold text-white"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
