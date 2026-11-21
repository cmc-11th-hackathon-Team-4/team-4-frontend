import { useState } from 'react';
import BottomButton from '@/components/common/BottomButton';
import { MAIN_TEXT } from '@/constants/main';
import InfoText from '@/pages/onboarding/components/InfoText';
import { addDays, formatMonthDayWeek } from '@/utils/date';

interface ExtendCycleSheetProps {
  endDate: string;
  onClose: () => void;
  onSubmit: (endDate: string) => Promise<unknown>;
}

/** V5-14 이번 기간 늘리기 (방장). 부모에서 열 때만 렌더 */
function ExtendCycleSheet({ endDate, onClose, onSubmit }: ExtendCycleSheetProps) {
  const [days, setDays] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const nextEndDate = days === null ? null : addDays(endDate, days);

  const submit = async () => {
    if (!nextEndDate || saving) return;
    setSaving(true);
    try {
      await onSubmit(nextEndDate);
      onClose();
    } catch {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={MAIN_TEXT.extendTitle}
        className="w-full max-w-[430px] rounded-t-3xl bg-white px-5 pt-3 pb-[calc(20px+var(--safe-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300" />
        <h2 className="text-xl font-bold">{MAIN_TEXT.extendTitle}</h2>

        <p className="mt-5 text-sm text-neutral-500">{MAIN_TEXT.currentEnd}</p>
        <p className="mt-1 text-lg font-semibold">{formatMonthDayWeek(endDate)}</p>

        <div role="radiogroup" className="mt-5 grid grid-cols-3 gap-2">
          {MAIN_TEXT.extendOptions.map((option) => {
            const active = option.days === days;
            return (
              <button
                key={option.days}
                type="button"
                role="radio"
                aria-checked={active}
                className={`h-12 rounded-full text-sm font-semibold ${
                  active ? 'bg-neutral-900 text-white' : 'border border-neutral-300'
                }`}
                onClick={() => setDays(option.days)}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-neutral-100 px-4 py-3">
          <span className="text-sm text-neutral-500">{MAIN_TEXT.newEnd}</span>
          <span className="font-bold">{nextEndDate ? formatMonthDayWeek(nextEndDate) : '-'}</span>
        </div>

        <InfoText className="mt-3">{MAIN_TEXT.extendInfo}</InfoText>

        <BottomButton
          variant="solid"
          className="mt-8"
          disabled={!nextEndDate || saving}
          onClick={submit}
        >
          {MAIN_TEXT.extendOk}
        </BottomButton>
      </div>
    </div>
  );
}

export default ExtendCycleSheet;
