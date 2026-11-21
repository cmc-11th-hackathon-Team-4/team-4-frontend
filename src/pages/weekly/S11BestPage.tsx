import { Fragment } from 'react';
import { useNavigate } from 'react-router';
import { useDevSession } from '@/hooks/useDevSession';
import { useWeeklySession, useWeeklySettlement } from '@/hooks/useWeekly';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { countReliefs, getBestMemberIds, getUndoneChores, withSubject } from '@/utils/weekly';
import Avatar from './components/Avatar';
import StateView from '@/components/common/StateView';
import BottomButton from '@/components/common/BottomButton';
import WeeklyLayout from './components/WeeklyLayout';

/** S-11 이번 주 배려왕 */
function S11BestPage() {
  useDevSession();
  const navigate = useNavigate();
  const { memberId } = useWeeklySession();
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

  const counts = countReliefs(data.reliefs);
  const bestIds = getBestMemberIds(data.reliefs);
  const bestNames = data.members.filter((m) => bestIds.includes(m.id)).map((m) => m.nickname);
  const hasMyUndone = getUndoneChores(data.chores, memberId).length > 0;

  // ♡ 옆 숫자는 덜어준 횟수가 아니라 이번 기간에 받은 하트 수
  const message =
    bestIds.length === 0
      ? '이번 주는 배려왕이 없어요'
      : bestIds.length === 1
        ? `${withSubject(bestNames[0])} 배려왕이에요 ♡ ${data.hearts[bestIds[0]] ?? 0}`
        : `${bestNames.join(' · ')} 공동 배려왕이에요`;

  return (
    <WeeklyLayout
      step="best"
      skipCarryOver={!hasMyUndone}
      footer={
        <BottomButton variant="solid" onClick={() => navigate(WEEKLY_PATHS.next)}>
          다음
        </BottomButton>
      }
    >
      <h2 className="text-center text-2xl font-bold">이번 주 배려왕</h2>
      <p className="mt-2 text-center text-sm text-neutral-500">서로 덜어준 횟수</p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-6 rounded-2xl bg-neutral-100 px-4 py-6">
        {data.members.map((m, i) => {
          const isBest = bestIds.includes(m.id);
          return (
            <Fragment key={m.id}>
              {i > 0 && data.members.length === 2 && (
                <span className="text-sm text-neutral-400">vs</span>
              )}
              <div className="flex flex-col items-center">
                <span className={`h-6 text-xl ${isBest ? '' : 'invisible'}`} aria-hidden>
                  ♛
                </span>
                <Avatar className="size-22" />
                <span className="mt-3 text-sm font-semibold">{m.nickname}</span>
                <span className={`mt-1 text-3xl font-bold ${isBest ? '' : 'text-neutral-400'}`}>
                  {counts.get(m.id) ?? 0}
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
