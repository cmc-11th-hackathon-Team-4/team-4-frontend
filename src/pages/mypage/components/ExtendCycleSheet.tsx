import { useState } from 'react';
import BottomButton from '@/components/common/BottomButton';
import { IconInfo } from '@/components/common/icons';
import { useExtendCycle } from '@/hooks/useHouseSettings';
import { useToastStore } from '@/stores/toast';
import type { ExtendDays } from '@/types/houseSettings';
import { addDays, formatMonthDayWeekday } from '@/utils/date';
import BottomSheet from './BottomSheet';

const OPTIONS: { days: ExtendDays; label: string }[] = [
  { days: 1, label: '+1일' },
  { days: 3, label: '+3일' },
  { days: 7, label: '+1주' },
];

/** V5-14 이번 기간 늘리기 (권한: 방장). 하나를 골라야 늘림 */
function ExtendCycleSheet({ endDate, onClose }: { endDate: string; onClose: () => void }) {
  const [days, setDays] = useState<ExtendDays | null>(null);
  const extend = useExtendCycle();
  const showToast = useToastStore((s) => s.show);

  const submit = () => {
    if (!days) return;
    extend.mutate(days, {
      onSuccess: () => {
        // TODO(API): 구성원에게 알림
        showToast('결산일을 늘렸어요');
        onClose();
      },
      onError: () => showToast('저장하지 못했어요. 다시 시도해주세요'),
    });
  };

  return (
    <BottomSheet
      title="이번 기간 늘리기"
      onClose={onClose}
      footer={
        <BottomButton variant="solid" disabled={!days || extend.isPending} onClick={submit}>
          {extend.isPending ? '저장하는 중' : '늘리기'}
        </BottomButton>
      }
    >
      <p className="mt-5 text-sm text-gray-500">지금 결산일</p>
      <p className="mt-1 text-lg font-semibold text-gray-900">{formatMonthDayWeekday(endDate)}</p>

      <div className="mt-5 grid grid-cols-3 gap-2" role="radiogroup" aria-label="늘릴 기간">
        {OPTIONS.map((o) => (
          <button
            key={o.days}
            type="button"
            role="radio"
            aria-checked={days === o.days}
            onClick={() => setDays(o.days)}
            className={`h-11 rounded-full text-sm font-medium ${
              days === o.days
                ? 'bg-gray-900 text-white'
                : 'border border-line-800 bg-white text-gray-800'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-line-400 px-4 py-3">
        <span className="text-sm text-gray-500">바뀐 결산일</span>
        <span className="text-base font-semibold text-gray-900">
          {days ? formatMonthDayWeekday(addDays(endDate, days)) : '-'}
        </span>
      </div>

      <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
        <IconInfo size={16} className="shrink-0" />
        방장만 바꿀 수 있어요. 구성원에게 알림이 가요.
      </p>
    </BottomSheet>
  );
}

export default ExtendCycleSheet;
