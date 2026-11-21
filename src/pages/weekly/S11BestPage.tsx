import { Navigate, useNavigate } from 'react-router';
import heartIcon from '@/assets/icons/heart.svg';
import StateView from '@/components/common/StateView';
import { CHARACTER_IMAGES } from '@/constants/character';
import { useMyId, useWeeklySettlement } from '@/hooks/useWeekly';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import type { KindnessRank } from '@/types/weekly';
import WeeklyLayout, { WeeklyButton } from './components/WeeklyLayout';
import { WEEKLY_STEP } from './steps';

/** S-11 이번 주 배려왕 — 피그마 ③ 디자인 (배려왕 · 횟수 · 하트는 서버 결산 그대로) */
function S11BestPage() {
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
  if (!data.settlement) return <Navigate to={WEEKLY_PATHS.summary} replace />;

  const { ranking, kingIds } = data.settlement;
  const isKing = (r: KindnessRank) => kingIds.includes(r.id);
  const nameOf = (r: KindnessRank) => (r.id === myId ? '나' : r.nickname);
  // 배려왕이 왼쪽 (피그마: 배려왕 vs 나머지)
  const ordered = [...ranking].sort((a, b) => Number(isKing(b)) - Number(isKing(a)));
  const kings = ordered.filter(isKing);
  const soleKing = kings.length === 1 ? kings[0] : null;

  const title =
    kings.length === 0
      ? '이번 주는\n배려왕이 없어요'
      : soleKing
        ? `이번 주 배려왕은\n${soleKing.id === myId ? '나예요' : `${soleKing.nickname}님이에요`}`
        : '이번 주는\n공동 배려왕이에요';

  return (
    <WeeklyLayout
      step={WEEKLY_STEP.best}
      title={title}
      description="서로 덜어준 횟수예요."
      footer={<WeeklyButton onClick={() => navigate(WEEKLY_PATHS.next)}>다음</WeeklyButton>}
    >
      {/* 비교 카드: 2명이면 vs, 그 이상이면 줄바꿈 */}
      <div className="relative mt-9 flex flex-wrap justify-around gap-y-4 rounded-3xl bg-line-400 px-2.5 pb-8">
        {ordered.map((r) => (
          <div key={r.id} className="flex w-40 flex-col items-center">
            {CHARACTER_IMAGES[r.character] ? (
              <img src={CHARACTER_IMAGES[r.character]} alt="" className="size-40 object-cover" />
            ) : (
              <span aria-hidden className="block size-40" />
            )}
            <span
              className={`-mt-[9px] text-lg leading-[normal] font-semibold ${isKing(r) ? 'text-gray-800' : 'text-gray-600'}`}
            >
              {nameOf(r)}
            </span>
            <span
              className={`mt-[5px] text-[32px] leading-[normal] font-bold ${isKing(r) ? 'text-primary-500' : 'text-gray-400'}`}
            >
              {r.helpedCount}
            </span>
          </div>
        ))}
        {ordered.length === 2 && (
          <span className="absolute top-[114px] left-1/2 -translate-x-1/2 text-sm leading-[normal] font-medium text-gray-400">
            vs
          </span>
        )}
      </div>

      {/* 배려왕이 받은 하트 (한 명일 때만) */}
      {soleKing && (
        <div className="mt-5 flex justify-center">
          <span className="flex h-11 items-center gap-3 rounded-[22px] bg-primary-100 px-3">
            <span className="flex size-6 items-center justify-center rounded-full bg-fail">
              <img src={heartIcon} alt="" width={14.4} height={14.4} />
            </span>
            <span className="text-sm leading-[normal] font-medium text-primary-500">
              받은 하트 {soleKing.receivedHeartCount}개
            </span>
          </span>
        </div>
      )}
    </WeeklyLayout>
  );
}

export default S11BestPage;
