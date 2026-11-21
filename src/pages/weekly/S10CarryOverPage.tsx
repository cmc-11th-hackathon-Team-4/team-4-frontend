import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import StateView from '@/components/common/StateView';
import { useCarryOver, useWeeklySettlement } from '@/hooks/useWeekly';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { useToastStore } from '@/stores/toast';
import type { Id } from '@/types/common';
import type { CarryChoice, WeeklySettlement } from '@/types/weekly';
import WeeklyLayout, { WeeklyButton } from './components/WeeklyLayout';
import { WEEKLY_STEP } from './steps';

const OPTIONS: [CarryChoice, string][] = [
  ['KEEP', '다음 주로'],
  ['RELEASE', '덜어내기'],
];

/** S-10 못 한 일 이월 (본인 것만) — 피그마 ③ 디자인 */
function S10CarryOverPage() {
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
  const { myUndone, period } = settlement;
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
      step={WEEKLY_STEP.carryOver}
      title={'못 한 일,\n어떻게 할까요?'}
      description={`내 못 한 일 ${myUndone.length}개를 정리해 주세요.`}
      footer={
        <WeeklyButton onClick={submit} disabled={carryOver.isPending}>
          {carryOver.isPending ? '저장 중' : '다음'}
        </WeeklyButton>
      }
    >
      <ul className="mt-9 flex flex-col gap-4">
        {myUndone.map((u) => {
          const selected = choices[u.assignmentId] ?? 'KEEP';
          return (
            <li key={u.assignmentId} className="rounded-[20px] bg-line-400 p-5">
              <p className="text-lg leading-[normal] font-semibold text-gray-800">{u.name}</p>
              <div className="mt-[21px] flex gap-2">
                {OPTIONS.map(([choice, label]) => (
                  <button
                    key={choice}
                    type="button"
                    aria-pressed={selected === choice}
                    onClick={() => setChoices((prev) => ({ ...prev, [u.assignmentId]: choice }))}
                    className={`h-11 flex-1 rounded-[22px] text-sm leading-[normal] font-medium ${
                      selected === choice
                        ? 'bg-primary-500 text-white'
                        : 'bg-primary-100 text-primary-500'
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

      <p className="mt-6 text-sm leading-[normal] text-gray-500">
        다음 주로 넘긴 일은 내 몫에 먼저 담겨요.
      </p>
    </WeeklyLayout>
  );
}

export default S10CarryOverPage;
