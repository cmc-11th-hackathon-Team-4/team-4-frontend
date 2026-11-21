import { useState } from 'react';
import BottomButton from '@/components/common/BottomButton';
import { MAIN_TEXT } from '@/constants/main';
import InfoText from '@/pages/onboarding/components/InfoText';
import UnderlineInput from '@/pages/onboarding/components/UnderlineInput';
import { INPUT_RULES, isValidText } from '@/pages/onboarding/validation';

interface AddChoreSheetProps {
  onClose: () => void;
  /** 저장이 끝나면 resolve, 실패하면 reject (실패 시 입력값 유지) */
  onSubmit: (name: string) => Promise<unknown>;
}

/** V5-13 집안일 추가 시트 (부모에서 열 때만 렌더) */
function AddChoreSheet({ onClose, onSubmit }: AddChoreSheetProps) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const valid = isValidText(name, INPUT_RULES.choreName);

  const submit = async () => {
    if (!valid || saving) return;
    setSaving(true);
    try {
      await onSubmit(name.trim());
      onClose();
    } catch {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40" onClick={onClose}>
      <form
        role="dialog"
        aria-modal="true"
        aria-label={MAIN_TEXT.addTitle}
        className="w-full max-w-[430px] rounded-t-3xl bg-white px-5 pt-3 pb-[calc(20px+var(--safe-bottom))]"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300" />
        <h2 className="mb-6 text-xl font-bold">{MAIN_TEXT.addTitle}</h2>
        <UnderlineInput
          autoFocus
          label={MAIN_TEXT.addLabel}
          placeholder={MAIN_TEXT.addPlaceholder}
          maxLength={INPUT_RULES.choreName.max}
          value={name}
          onChange={setName}
        />
        <InfoText className="mt-3">{MAIN_TEXT.addInfo}</InfoText>
        <BottomButton type="submit" variant="solid" className="mt-10" disabled={!valid || saving}>
          {MAIN_TEXT.addOk}
        </BottomButton>
      </form>
    </div>
  );
}

export default AddChoreSheet;
