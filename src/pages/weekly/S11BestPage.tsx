import { Fragment } from 'react';
import { Navigate, useNavigate } from 'react-router';
import BottomButton from '@/components/common/BottomButton';
import StateView from '@/components/common/StateView';
import { useDevSession } from '@/hooks/useDevSession';
import { useWeeklySettlement } from '@/hooks/useWeekly';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { withSubject } from '@/utils/weekly';
import Avatar from './components/Avatar';
import WeeklyLayout from './components/WeeklyLayout';

/** S-11 이번 주 배려왕 (배려왕 · 횟수 · 하트는 서버 결산 그대로) */
function S11BestPage() {
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
  if (!data.settlement) return <Navigate to={WEEKLY_PATHS.summary} replace />;

  const { ranking, kingIds, myUndone } = data.settlement;
  const kings = ranking.filter((r) => kingIds.includes(r.id));

  // ♡ 옆 숫자는 덜어준 횟수가 아니라 이번 기간에 받은 하트 수
  const message =
    kings.length === 0
      ? '이번 주는 배려왕이 없어요'
      : kings.length === 1
        ? `${withSubject(kings[0].nickname)} 배려왕이에요 ♡ ${kings[0].receivedHeartCount}`
        : `${kings.map((k) => k.nickname).join(' · ')} 공동 배려왕이에요`;

  return (
    <WeeklyLayout
      step="best"
      skipCarryOver={myUndone.length === 0}
      footer={
        <BottomButton variant="solid" onClick={() => navigate(WEEKLY_PATHS.next)}>
          다음
        </BottomButton>
      }
    >
      <h2 className="text-center text-2xl font-bold">이번 주 배려왕</h2>
      <p className="mt-2 text-center text-sm text-neutral-500">서로 덜어준 횟수</p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-6 rounded-2xl bg-neutral-100 px-4 py-6">
        {ranking.map((r, i) => {
          const isKing = kingIds.includes(r.id);
          return (
            <Fragment key={r.id}>
              {i > 0 && ranking.length === 2 && (
                <span className="text-sm text-neutral-400">vs</span>
              )}
              <div className="flex flex-col items-center">
                <span className={`h-6 text-xl ${isKing ? '' : 'invisible'}`} aria-hidden>
                  ♛
                </span>
                <Avatar character={r.character} size={88} />
                <span className="mt-3 text-sm font-semibold">{r.nickname}</span>
                <span className={`mt-1 text-3xl font-bold ${isKing ? '' : 'text-neutral-400'}`}>
                  {r.helpedCount}
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>

      <p className="mt-5 text-center text-sm text-neutral-500">{message}</p>
    </WeeklyLayout>
  );
}

export default S11BestPage;
