import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import StateView from '@/components/common/StateView';
import { useMyId, useWeeklySettlement } from '@/hooks/useWeekly';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import type { SettlementChore } from '@/types/weekly';
import WeeklyLayout, { WeeklyButton } from './components/WeeklyLayout';
import { WEEKLY_STEP } from './steps';

/** 처음에 보여줄 개수. 넘으면 "외 n개 보기" */
const PREVIEW_COUNT = 6;

/** S-09 한 일 · 못 한 일 — 피그마 ③ 디자인 (S-08 결산 데이터를 그대로 씀) */
function S09ResultPage() {
  const navigate = useNavigate();
  const myId = useMyId();
  const { data, isPending, isError, refetch } = useWeeklySettlement();
  const [tab, setTab] = useState<'done' | 'undone'>('done');
  const [expanded, setExpanded] = useState(false);

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
  // 결산이 아직 없으면 결산 홈으로
  if (!data.settlement) return <Navigate to={WEEKLY_PATHS.summary} replace />;

  const { chores, summary, myUndone } = data.settlement;
  const hasMyUndone = myUndone.length > 0;
  const list = chores.filter((c) => (tab === 'done' ? c.done : !c.done));
  const visible = expanded ? list : list.slice(0, PREVIEW_COUNT);

  const changeTab = (next: 'done' | 'undone') => {
    setTab(next);
    setExpanded(false);
  };

  return (
    <WeeklyLayout
      step={WEEKLY_STEP.result}
      title={'우리가\n해낸 일'}
      description={`${summary.totalCount}개 중 ${summary.doneCount}개 완료했어요`}
      footer={
        <WeeklyButton
          onClick={() => navigate(hasMyUndone ? WEEKLY_PATHS.carryOver : WEEKLY_PATHS.best)}
        >
          다음
        </WeeklyButton>
      }
    >
      <div className="mt-9 flex gap-2" role="tablist">
        {(
          [
            ['done', `한 일 ${summary.doneCount}`],
            ['undone', `못 한 일 ${summary.undoneCount}`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => changeTab(key)}
            className={`h-11 flex-1 rounded-[22px] text-sm leading-[normal] font-medium ${
              tab === key ? 'bg-primary-500 text-white' : 'bg-line-500 text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-center text-base font-medium text-gray-500">
          {tab === 'done' ? '아직 한 일이 없어요' : '모두 해냈어요'}
        </p>
      ) : (
        <ul className="mt-4">
          {visible.map((c) => (
            <li
              key={c.assignmentId}
              className="flex items-center justify-between gap-3 border-b border-line-600 py-3"
            >
              <span className="min-w-0 truncate text-lg leading-[normal] font-semibold text-gray-600">
                {c.name}
              </span>
              {tab === 'done' && <HelpedTag chore={c} myId={myId} />}
            </li>
          ))}
        </ul>
      )}

      {!expanded && list.length > PREVIEW_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-2 py-1 text-center text-sm leading-[normal] font-medium text-gray-500"
        >
          외 {list.length - PREVIEW_COUNT}개 보기
        </button>
      )}
    </WeeklyLayout>
  );
}

/** 다른 사람이 덜어준 일에만: "민지님이 덜어줌"(주황) · "내가 덜어줌"(보라) */
function HelpedTag({ chore, myId }: { chore: SettlementChore; myId: string | null }) {
  if (!chore.helpedBy) return null;
  const isMine = chore.helpedBy.id === myId;
  return (
    <span
      className={`flex h-7 w-[124px] shrink-0 items-center justify-center rounded-lg text-sm leading-[normal] font-medium ${
        isMine ? 'bg-primary-100 text-primary-500' : 'bg-accent-100 text-accent-500'
      }`}
    >
      {isMine ? '내가 덜어줌' : `${chore.helpedBy.nickname}님이 덜어줌`}
    </span>
  );
}

export default S09ResultPage;
