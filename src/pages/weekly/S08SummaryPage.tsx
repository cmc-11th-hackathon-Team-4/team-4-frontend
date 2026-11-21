import { useNavigate } from 'react-router';
import BottomButton from '@/components/common/BottomButton';
import StateView from '@/components/common/StateView';
import { useDevSession } from '@/hooks/useDevSession';
import { useWeeklySettlement } from '@/hooks/useWeekly';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { formatPeriod, getDaysLeft } from '@/utils/weekly';
import Avatar from './components/Avatar';
import WeeklyLayout from './components/WeeklyLayout';

/** S-08 결산 홈 */
function S08SummaryPage() {
  useDevSession();
  const navigate = useNavigate();
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

  const { period, settlement } = data;
  // 시작 전이거나 기간 진행 중이면 결산 대신 빈 화면
  if (!period) return <StateView type="error" message="우리 집을 시작하면 결산이 열려요" />;
  if (!settlement) {
    return (
      <StateView
        type="error"
        message={`D-${getDaysLeft(period.endDate)} · 기간이 끝나면 결산이 열려요`}
      />
    );
  }

  const { members, summary } = settlement;
  const stats = [
    { label: '한 일', value: summary.doneCount },
    { label: '못 한 일', value: summary.undoneCount },
    { label: '덜어줌', value: summary.helpedCount },
  ];

  return (
    <WeeklyLayout
      step="summary"
      showBack={false}
      skipCarryOver={settlement.myUndone.length === 0}
      footer={
        <BottomButton variant="solid" onClick={() => navigate(WEEKLY_PATHS.result)}>
          결산 보기
        </BottomButton>
      }
    >
      <div className="flex h-50 items-center justify-center gap-6 rounded-2xl bg-neutral-100">
        {members.map((m) => (
          <Avatar key={m.id} character={m.character} size={92} />
        ))}
      </div>

      <h2 className="mt-6 text-center text-2xl font-bold">이번 주도 고생했어요</h2>
      <p className="mt-2 text-center text-sm text-neutral-500">
        {members.map((m) => m.nickname).join(' · ')} ·{' '}
        {formatPeriod(period.startDate, period.endDate)}
      </p>

      <ul className="mt-6 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <li
            key={s.label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-200 py-5"
          >
            <span className="text-2xl font-bold">{s.value}</span>
            <span className="text-xs text-neutral-500">{s.label}</span>
          </li>
        ))}
      </ul>
    </WeeklyLayout>
  );
}

export default S08SummaryPage;
