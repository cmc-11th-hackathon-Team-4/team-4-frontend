import { useNavigate } from 'react-router';
import { useDevSession } from '@/hooks/useDevSession';
import {
  useNextCycle,
  useReassign,
  useStartNextCycle,
  useWeeklySession,
  useWeeklySettlement,
} from '@/hooks/useWeekly';
import { HOME_PATH } from '@/routes/weeklyPaths';
import { formatPeriod, getUndoneChores, withSubject } from '@/utils/weekly';
import Avatar from './components/Avatar';
import StateView from '@/components/common/StateView';
import BottomButton from '@/components/common/BottomButton';
import WeeklyLayout from './components/WeeklyLayout';

/** S-12 다음 주기. 방장: 다시 나누기 · 시작하기 / 구성원: 방장이 시작하면 새 배분 확인 */
function S12NextPage() {
  useDevSession();
  const navigate = useNavigate();
  const { memberId } = useWeeklySession();
  const settlement = useWeeklySettlement();
  const next = useNextCycle();
  const reassign = useReassign();
  const start = useStartNextCycle();

  if (settlement.isPending || next.isPending) return <StateView type="loading" />;
  if (settlement.isError || next.isError) {
    return (
      <StateView
        type="error"
        message="결산을 불러오지 못했어요"
        retryLabel="다시 시도"
        onRetry={() => {
          settlement.refetch();
          next.refetch();
        }}
      />
    );
  }

  const { members } = settlement.data;
  const me = members.find((m) => m.id === memberId);
  const host = members.find((m) => m.isHost);
  if (!me) return <StateView type="error" message="내 정보를 찾지 못했어요" />;

  const { chores, carriedChoreIds, started, startDate, endDate } = next.data;
  // 이월한 일이 먼저
  const isCarried = (id: string) => carriedChoreIds.includes(id);
  const myChores = chores
    .filter((c) => c.ownerId === memberId)
    .sort((a, b) => Number(isCarried(b.id)) - Number(isCarried(a.id)));
  const hasMyUndone = getUndoneChores(settlement.data.chores, memberId).length > 0;
  const period = formatPeriod(startDate, endDate);

  const others = members
    .filter((m) => m.id !== memberId)
    .map((m) => `${m.nickname}도 ${chores.filter((c) => c.ownerId === m.id).length}개`);
  const subtitle = me.isHost
    ? [period, `우리 집 ${chores.length}개`, ...others].join(' · ')
    : `${period} · ${withSubject(host?.nickname ?? '방장')} 시작했어요`;

  // 구성원: 방장이 시작하기 전엔 대기 (폴링으로 반영)
  if (!me.isHost && !started) {
    return (
      <WeeklyLayout step="next" skipCarryOver={!hasMyUndone}>
        <StateView
          type="error"
          message={`${withSubject(host?.nickname ?? '방장')} 다음 주를 준비 중이에요`}
        />
      </WeeklyLayout>
    );
  }

  const footer = me.isHost ? (
    <>
      {(reassign.isError || start.isError) && (
        <p className="text-center text-sm text-red-500">요청하지 못했어요. 다시 시도해주세요</p>
      )}
      <BottomButton
        variant="outline"
        onClick={() => reassign.mutate()}
        disabled={reassign.isPending || start.isPending}
      >
        ↻ 다시 나누기
      </BottomButton>
      <BottomButton
        variant="solid"
        onClick={() => start.mutate(undefined, { onSuccess: () => navigate(HOME_PATH) })}
        disabled={reassign.isPending || start.isPending}
      >
        {start.isPending ? '시작하는 중' : '이대로 시작하기'}
      </BottomButton>
    </>
  ) : (
    <BottomButton variant="solid" onClick={() => navigate(HOME_PATH)}>
      홈으로
    </BottomButton>
  );

  return (
    <WeeklyLayout step="next" skipCarryOver={!hasMyUndone} footer={footer}>
      <div className="flex flex-col items-center">
        <Avatar className="size-17" />
        <h2 className="mt-4 text-2xl font-bold">다음 주 내 집안일 {myChores.length}개</h2>
        <p className="mt-2 text-center text-sm text-neutral-500">{subtitle}</p>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-2">
        {myChores.map((c) => (
          <li key={c.id} className="flex h-20 flex-col gap-2 rounded-2xl bg-neutral-100 p-4">
            <span className="text-sm font-medium">{c.name}</span>
            {isCarried(c.id) && (
              <span className="w-fit rounded-md border border-neutral-300 bg-white px-2 py-0.5 text-xs text-neutral-500">
                이월
              </span>
            )}
          </li>
        ))}
      </ul>
    </WeeklyLayout>
  );
}

export default S12NextPage;
