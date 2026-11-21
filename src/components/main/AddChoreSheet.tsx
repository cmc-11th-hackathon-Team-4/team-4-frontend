import { useState } from 'react';
import BottomButton from '@/components/common/BottomButton';
import { MAIN_TEXT } from '@/constants/main';

interface AddChoreSheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

/** + 짐 올리기 바텀시트 */
function AddChoreSheet({ open, onClose, onSubmit }: AddChoreSheetProps) {
  const [name, setName] = useState('');
  if (!open) return null;

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40" onClick={onClose}>
      <form
        className="w-full max-w-[430px] rounded-t-2xl bg-white p-5 pb-[calc(20px+var(--safe-bottom))]"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <h2 className="mb-3 font-bold">{MAIN_TEXT.addTitle}</h2>
        <input
          autoFocus
          maxLength={20}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={MAIN_TEXT.addPlaceholder}
          className="mb-4 h-12 w-full rounded-xl border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-900"
        />
        <BottomButton type="submit" variant="solid" disabled={!name.trim()}>
          {MAIN_TEXT.addOk}
        </BottomButton>
      </form>
    </div>
  );
}

export default AddChoreSheet;
