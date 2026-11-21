import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import BottomButton from '@/components/common/BottomButton';
import StateView from '@/components/common/StateView';
import { useDevSession } from '@/hooks/useDevSession';
import { useCarryOver, useWeeklySettlement } from '@/hooks/useWeekly';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { useToastStore } from '@/stores/toast';
import type { Id } from '@/types/common';
import type { CarryChoice, WeeklySettlement } from '@/types/weekly';
import { getPerPerson } from '@/utils/weekly';
import WeeklyLayout from './components/WeeklyLayout';

const OPTIONS: [CarryChoice, string][] = [
  ['KEEP', '다음 주로'],
  ['RELEASE', '덜어내기'],
];

/** S-10 못 한 일 이월 (본인 것만) */
function S10CarryOverPage() {
  useDevSession();
  const { data, isPending, isError, refetch } = useWeeklySettlement();

  if (isPending) return <StateView type="loading" />;
  if (isError) {
    return (
      <StateView
        type="error"
        message="결산을 불러오지 못했어요"
        retryLabel="다시 시도"
        onRetry={refetch}
      />
    );
  }
  if (!data.settlement) return <Navigate to={WEEKLY_PATHS.summary} replace />;
  // 내 못 한 일이 없으면 S-10 건너뜀
  if (data.settlement.myUndone.length === 0) return <Navigate to={WEEKLY_PATHS.best} replace />;

  return <CarryOverForm settlement={data.settlement} />;
}

function CarryOverForm({ settlement }: { settlement: WeeklySettlement }) {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const { myUndone, summary, members, period } = settlement;
  const carryOver = useCarryOver(period.id);
  // 저장된 선택이 없으면 기본값 "다음 주로"
  const [choices, setChoices] = useState<Record<Id, CarryChoice>>(() =>
    Object.fromEntries(myUndone.map((u) => [u.assignmentId, u.carryChoice ?? 'KEEP'])),
  );

  const submit = () => {
    const items = myUndone.map((u) => ({
      assignmentId: u.assignmentId,
      choice: choices[u.assignmentId] ?? 'KEEP',
    }));
    carryOver.mutate(items, {
      onSuccess: () => navigate(WEEKLY_PATHS.best),
      // 저장 실패 시 토스트로 알리고 화면에 머묾
      onError: () => showToast('저장하지 못했어요. 다시 시도해주세요'),
    });
  };

  return (
    <WeeklyLayout
      step="carryOver"
      footer={
        <BottomButton variant="solid" onClick={submit} disabled={carryOver.isPending}>
          {carryOver.isPending ? '저장 중' : '다음'}
        </BottomButton>
      }
    >
      <h2 className="text-center text-2xl font-bold">못 한 일, 어떻게 할까요?</h2>
      <p className="mt-2 text-center text-sm text-neutral-500">내 못 한 일 {myUndone.length}개</p>

      <ul className="mt-5 flex flex-col gap-3">
        {myUndone.map((u) => {
          const selected = choices[u.assignmentId] ?? 'KEEP';
          return (
            <li key={u.assignmentId} className="rounded-2xl border border-neutral-300 p-5">
              <p className="text-base font-semibold">{u.name}</p>
              <div className="mt-4 flex rounded-xl border border-neutral-300 p-0.5">
                {OPTIONS.map(([choice, label]) => (
                  <button
                    key={choice}
                    type="button"
                    aria-pressed={selected === choice}
                    onClick={() => setChoices((prev) => ({ ...prev, [u.assignmentId]: choice }))}
                    className={`h-10 flex-1 rounded-lg text-sm ${
                      selected === choice ? 'bg-neutral-100 font-semibold' : 'text-neutral-500'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-center text-xs text-neutral-500">
        다음 주로 넘긴 일은 내 {getPerPerson(summary.totalCount, members.length)}개 안에 먼저 담겨요
      </p>
    </WeeklyLayout>
  );
}

export default S10CarryOverPage;
