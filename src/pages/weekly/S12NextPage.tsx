import { useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { isApiError } from '@/apis/error';
import StateView from '@/components/common/StateView';
import {
  useCreateNextPeriod,
  useNextPeriod,
  useStartNextPeriod,
  useWeeklyHouse,
} from '@/hooks/useWeekly';
import ChoreIcon from '@/pages/onboarding/components/ChoreIcon';
import { HOME_PATH } from '@/routes/onboardingPaths';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { useToastStore } from '@/stores/toast';
import type { NextPeriodMember } from '@/types/weekly';
import { formatPeriod } from '@/utils/weekly';
import WeeklyLayout, { WeeklyButton } from './components/WeeklyLayout';
import { WEEKLY_STEP } from './steps';

/**
 * S-12 다음 주기 — 피그마 ③ 디자인
 * - 방장: 들어오면 배분을 만들고(POST periods/next) 다시 나누기 · 다음(시작하기)
 * - 구성원: 방장이 배분을 만들 때까지 "준비 중"(prepared=false), 3초마다 다시 조회 → 홈으로
 * - 다음 기간이 이미 시작됐으면(PERIOD-409-2) 홈으로
 */
function S12NextPage() {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
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

  const hostName = `${host?.nickname ?? '방장'}님`;

  // 구성원: 방장이 배분을 만들기 전엔 대기 / 방장: 만드는 중
  if (!next.data.prepared || !next.data.period) {
    return (
      <WeeklyLayout step={WEEKLY_STEP.next}>
        {isHost ? (
          <StateView type="loading" />
        ) : (
          <StateView type="error" message={`${hostName}이 다음 주를 준비 중이에요`} />
        )}
      </WeeklyLayout>
    );
  }

  const { period, totalCount, members } = next.data;
  const mine = members.find((m) => m.isMe);
  const myChores = mine?.chores ?? [];
  const range = formatPeriod(period.startDate, period.endDate);
  const description = isHost
    ? [range, `우리 집 ${totalCount}개`, ...othersSummary(members)].join(' · ')
    : `${range} · ${hostName}이 나눴어요`;
  const busy = create.isPending || start.isPending;

  const footer = isHost ? (
    <>
      <WeeklyButton
        variant="secondary"
        disabled={busy}
        onClick={() =>
          create.mutate(undefined, {
            onError: () => showToast('다시 나누지 못했어요. 다시 시도해주세요'),
          })
        }
      >
        다시 나누기
      </WeeklyButton>
      <WeeklyButton
        disabled={busy}
        onClick={() =>
          start.mutate(undefined, {
            onSuccess: () => navigate(HOME_PATH, { replace: true }),
            onError: () => showToast('시작하지 못했어요. 다시 시도해주세요'),
          })
        }
      >
        {start.isPending ? '시작하는 중' : '다음'}
      </WeeklyButton>
    </>
  ) : (
    <WeeklyButton onClick={() => navigate(HOME_PATH)}>홈으로</WeeklyButton>
  );

  return (
    <WeeklyLayout
      step={WEEKLY_STEP.next}
      title={`다음 주\n내 집안일 ${myChores.length}개`}
      description={description}
      footer={footer}
    >
      {/* 이월된 짐이 맨 앞 (서버 정렬) */}
      <ul className="mt-9 grid grid-cols-2 gap-3">
        {myChores.map((c) => (
          <li
            key={c.id}
            className="flex flex-col gap-2 rounded-xl border border-primary-100 bg-white py-3 pr-2 pl-3 shadow-[0_1px_1.5px_rgba(113,113,113,0.25)]"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center overflow-visible rounded-xl bg-primary-200">
                <ChoreIcon name={c.name} />
              </span>
              {c.carriedOver && (
                <span className="flex h-[30px] items-center rounded px-2 text-[10px] leading-[normal] font-semibold text-primary-500 bg-primary-100">
                  이월
                </span>
              )}
            </div>
            <span className="truncate text-base leading-[normal] font-semibold text-gray-800">
              {c.name}
            </span>
          </li>
        ))}
      </ul>
    </WeeklyLayout>
  );
}

/** "민지님 5개" (나 제외 구성원별 개수) */
function othersSummary(members: NextPeriodMember[]) {
  return members.filter((m) => !m.isMe).map((m) => `${m.nickname}님 ${m.chores.length}개`);
}

export default S12NextPage;
