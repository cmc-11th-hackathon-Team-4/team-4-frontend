import { useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { isApiError } from '@/apis/error';
import BottomButton from '@/components/common/BottomButton';
import StateView from '@/components/common/StateView';
import {
  useCreateNextPeriod,
  useNextPeriod,
  useStartNextPeriod,
  useWeeklyHouse,
  useWeeklySettlement,
} from '@/hooks/useWeekly';
import { HOME_PATH } from '@/routes/onboardingPaths';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { useToastStore } from '@/stores/toast';
import { formatPeriod, withSubject } from '@/utils/weekly';
import Avatar from './components/Avatar';
import WeeklyLayout from './components/WeeklyLayout';

/**
 * S-12 다음 주기
 * - 방장: 들어오면 배분을 만들고(POST periods/next) 다시 나누기 · 이대로 시작하기
 * - 구성원: 방장이 배분을 만들 때까지 "준비 중"(prepared=false), 3초마다 다시 조회
 * - 다음 기간이 이미 시작됐으면(PERIOD-409-2) 홈으로
 */
function S12NextPage() {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const state = useWeeklySettlement();
  const house = useWeeklyHouse();
  const me = house.data?.find((m) => m.isMe);
  const host = house.data?.find((m) => m.isHost);
  const isHost = !!me?.isHost;
  const next = useNextPeriod({ poll: !!me && !isHost });
  const create = useCreateNextPeriod();
  const start = useStartNextPeriod();

  // 방장: 아직 배분이 없으면 한 번 만든다
  const createdRef = useRef(false);
  const needsCreate = isHost && next.data?.prepared === false;
  useEffect(() => {
    if (!needsCreate || createdRef.current) return;
    createdRef.current = true;
    create.mutate(undefined, {
      onError: () => showToast('다음 주를 나누지 못했어요. 다시 시도해주세요'),
    });
  }, [needsCreate, create, showToast]);

  if (isApiError(next.error, 'PERIOD-409-2')) return <Navigate to={HOME_PATH} replace />;
  if (isApiError(next.error, 'PERIOD-409-1')) {
    return <Navigate to={WEEKLY_PATHS.summary} replace />;
  }
  if (house.isPending || next.isPending) return <StateView type="loading" />;
  if (house.isError || next.isError || !me) {
    return (
      <StateView
        type="error"
        message="다음 주 정보를 불러오지 못했어요"
        retryLabel="다시 시도"
        onRetry={() => {
          house.refetch();
          next.refetch();
        }}
      />
    );
  }

  const skipCarryOver = state.data?.settlement?.myUndone.length === 0;
  const hostName = withSubject(host?.nickname ?? '방장');

  // 구성원: 방장이 배분을 만들기 전엔 대기 / 방장: 만드는 중
  if (!next.data.prepared || !next.data.period) {
    return (
      <WeeklyLayout step="next" skipCarryOver={skipCarryOver}>
        {isHost ? (
          <StateView type="loading" />
        ) : (
          <StateView type="error" message={`${hostName} 다음 주를 준비 중이에요`} />
        )}
      </WeeklyLayout>
    );
  }

  const { period, totalCount, members } = next.data;
  const mine = members.find((m) => m.isMe);
  const myChores = mine?.chores ?? [];
  const others = members.filter((m) => !m.isMe).map((m) => `${m.nickname}도 ${m.chores.length}개`);
  const subtitle = [
    formatPeriod(period.startDate, period.endDate),
    `우리 집 ${totalCount}개`,
    ...others,
  ].join(' · ');
  const busy = create.isPending || start.isPending;

  const footer = isHost ? (
    <>
      <BottomButton
        variant="outline"
        disabled={busy}
        onClick={() =>
          create.mutate(undefined, {
            onError: () => showToast('다시 나누지 못했어요. 다시 시도해주세요'),
          })
        }
      >
        ↻ 다시 나누기
      </BottomButton>
      <BottomButton
        variant="solid"
        disabled={busy}
        onClick={() =>
          start.mutate(undefined, {
            onSuccess: () => navigate(HOME_PATH, { replace: true }),
            onError: () => showToast('시작하지 못했어요. 다시 시도해주세요'),
          })
        }
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
    <WeeklyLayout step="next" skipCarryOver={skipCarryOver} footer={footer}>
      <div className="flex flex-col items-center">
        <Avatar character={me.character} size={68} />
        <h2 className="mt-4 text-2xl font-bold">다음 주 내 집안일 {myChores.length}개</h2>
        <p className="mt-2 text-center text-sm text-neutral-500">{subtitle}</p>
      </div>

      {/* 이월된 짐이 맨 앞 (서버 정렬) */}
      <ul className="mt-5 grid grid-cols-2 gap-2">
        {myChores.map((c) => (
          <li key={c.id} className="flex h-20 flex-col gap-2 rounded-2xl bg-neutral-100 p-4">
            <span className="text-sm font-medium">{c.name}</span>
            {c.carriedOver && (
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
