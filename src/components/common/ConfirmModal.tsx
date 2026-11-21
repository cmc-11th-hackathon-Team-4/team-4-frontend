interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** 공용 확인 팝업 (V5-08 가져가기, V5-03 완료 등) */
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-8"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[320px] rounded-3xl bg-white px-5 pt-7 pb-5 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">{title}</h2>
        {description && <p className="mt-2 text-sm text-neutral-500">{description}</p>}
        <div className="mt-8 flex gap-2">
          <button
            type="button"
            className="h-12 flex-1 rounded-xl bg-neutral-100 font-semibold"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="h-12 flex-1 rounded-xl bg-neutral-900 font-semibold text-white"
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
