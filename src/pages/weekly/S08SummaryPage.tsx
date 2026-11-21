import { useNavigate } from 'react-router';
import { useDevSession } from '@/hooks/useDevSession';
import { useWeeklySettlement } from '@/hooks/useWeekly';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { formatPeriod, getDaysLeft, getDoneChores, getUndoneChores } from '@/utils/weekly';
import Avatar from './components/Avatar';
import StateView from '@/components/common/StateView';
import BottomButton from '@/components/common/BottomButton';
import WeeklyLayout from './components/WeeklyLayout';

/** S-08 결산 홈 */
function S08SummaryPage() {
  useDevSession();
  const navigate = useNavigate();
  const { data, isPending, isError, refetch } = useWeeklySettlement();

  if (isPending) return <StateView type="loading" />;
  if (isError)
    return (
      <StateView
        type="error"
        message="결산을 불러오지 못했어요"
        retryLabel="다시 시도"
        onRetry={refetch}
      />
    );

  // 기간 진행 중이면 결산 대신 빈 화면
  if (data.status === 'ongoing') {
    return (
      <StateView
        type="error"
        message={`D-${getDaysLeft(data.endDate)} · 기간이 끝나면 결산이 열려요`}
      />
    );
  }

  const names = data.members.map((m) => m.nickname).join(' · ');
  const stats = [
    { label: '한 일', value: getDoneChores(data.chores).length },
    { label: '못 한 일', value: getUndoneChores(data.chores).length },
    { label: '덜어줌', value: data.reliefs.length },
  ];

  return (
    <WeeklyLayout
      step="summary"
      showBack={false}
      footer={
        <BottomButton variant="solid" onClick={() => navigate(WEEKLY_PATHS.result)}>
          결산 보기
        </BottomButton>
      }
    >
      <div className="flex h-50 items-center justify-center gap-6 rounded-2xl bg-neutral-100">
        {data.members.map((m) => (
          <Avatar key={m.id} className="size-23" />
        ))}
      </div>

      <h2 className="mt-6 text-center text-2xl font-bold">이번 주도 고생했어요</h2>
      <p className="mt-2 text-center text-sm text-neutral-500">
        {names} · {formatPeriod(data.startDate, data.endDate)}
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
