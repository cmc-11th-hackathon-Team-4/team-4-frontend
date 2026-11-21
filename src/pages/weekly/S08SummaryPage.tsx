import { useNavigate } from 'react-router';
import settlementIllustration from '@/assets/illustrations/settlement.png';
import StateView from '@/components/common/StateView';
import { useMyId, useWeeklySettlement } from '@/hooks/useWeekly';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { formatPeriod, getDaysLeft } from '@/utils/weekly';
import WeeklyLayout, { WeeklyButton } from './components/WeeklyLayout';

/** S-08 결산 홈 — 피그마 ③ 디자인 (뒤로가기 · 단계 · 하단 탭 없음) */
function S08SummaryPage() {
  const navigate = useNavigate();
  const myId = useMyId();
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
  const names = members.map((m) => (m.id === myId ? '나' : m.nickname)).join(' · ');
  const stats = [
    { label: '한 일', value: summary.doneCount, accent: false },
    { label: '못한 일', value: summary.undoneCount, accent: false },
    { label: '덜어줌', value: summary.helpedCount, accent: true },
  ];

  return (
    <WeeklyLayout
      footer={<WeeklyButton onClick={() => navigate(WEEKLY_PATHS.result)}>결산보기</WeeklyButton>}
    >
      <img
        src={settlementIllustration}
        alt=""
        className="-mx-4 h-[282px] w-[calc(100%+32px)] max-w-none object-contain"
      />

      <div className="mt-10 flex flex-col items-center gap-3">
        <p className="text-[28px] leading-[normal] font-semibold text-primary-500">
          이번 주도 고생했어요
        </p>
        <p className="flex gap-3 text-base leading-[normal] font-medium text-gray-500">
          <span>{names}</span>
          <span>{formatPeriod(period.startDate, period.endDate, '~')}</span>
        </p>
      </div>

      <ul className="mt-10 flex gap-2.5">
        {stats.map((s) => (
          <li
            key={s.label}
            className="flex flex-1 flex-col items-center gap-1 rounded-xl border border-line-500 bg-white p-6 shadow-[0_1px_1.5px_rgba(113,113,113,0.25)]"
          >
            <span
              className={`text-[28px] leading-[normal] font-semibold ${s.accent ? 'text-primary-500' : 'text-gray-800'}`}
            >
              {s.value}
            </span>
            <span className="text-sm leading-[normal] font-semibold text-gray-500">{s.label}</span>
          </li>
        ))}
      </ul>
    </WeeklyLayout>
  );
}

export default S08SummaryPage;
