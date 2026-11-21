import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDevSession } from '@/hooks/useDevSession';
import { useWeeklySession, useWeeklySettlement } from '@/hooks/useWeekly';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';
import { getDoneChores, getUndoneChores, withSubject } from '@/utils/weekly';
import Avatar from './components/Avatar';
import StateView from '@/components/common/StateView';
import BottomButton from '@/components/common/BottomButton';
import WeeklyLayout from './components/WeeklyLayout';

/** 처음에 보여줄 개수. 넘으면 "외 n개 보기" */
const PREVIEW_COUNT = 6;

/** S-09 한 일 · 못 한 일 */
function S09ResultPage() {
  useDevSession();
  const navigate = useNavigate();
  const { memberId } = useWeeklySession();
  const { data, isPending, isError, refetch } = useWeeklySettlement();
  const [tab, setTab] = useState<'done' | 'undone'>('done');
  const [expanded, setExpanded] = useState(false);

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

  const done = getDoneChores(data.chores);
  const undone = getUndoneChores(data.chores);
  const hasMyUndone = getUndoneChores(data.chores, memberId).length > 0;
  const list = tab === 'done' ? done : undone;
  const visible = expanded ? list : list.slice(0, PREVIEW_COUNT);

  const nickname = (id: string) => data.members.find((m) => m.id === id)?.nickname ?? '';
  const reliefBy = (choreId: string) => data.reliefs.find((r) => r.choreId === choreId);

  const changeTab = (next: 'done' | 'undone') => {
    setTab(next);
    setExpanded(false);
  };

  return (
    <WeeklyLayout
      step="result"
      skipCarryOver={!hasMyUndone}
      footer={
        <BottomButton
          variant="solid"
          onClick={() => navigate(hasMyUndone ? WEEKLY_PATHS.carryOver : WEEKLY_PATHS.best)}
        >
          다음
        </BottomButton>
      }
    >
      <h2 className="text-center text-2xl font-bold">우리가 해낸 일</h2>
      <p className="mt-2 text-center text-sm text-neutral-500">
        {data.chores.length}개 중 {done.length}개 완료
      </p>

      <div className="mt-5 flex rounded-xl border border-neutral-300 p-0.5">
        {(
          [
            ['done', `한 일 ${done.length}`],
            ['undone', `못 한 일 ${undone.length}`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => changeTab(key)}
            className={`h-10 flex-1 rounded-lg text-sm ${
              tab === key ? 'bg-neutral-100 font-semibold' : 'text-neutral-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-center text-sm text-neutral-500">
          {tab === 'done' ? '아직 한 일이 없어요' : '모두 해냈어요'}
        </p>
      ) : (
        <ul className="mt-3">
          {visible.map((c) => {
            const relief = tab === 'done' ? reliefBy(c.id) : undefined;
            return (
              <li key={c.id} className="flex items-center gap-3 border-b border-neutral-100 py-2.5">
                <Avatar />
                <span className="flex-1 text-base">{c.name}</span>
                {relief && (
                  <span className="rounded-md border border-neutral-300 px-2 py-1 text-xs text-neutral-500">
                    {withSubject(nickname(relief.toMemberId))} 덜어줌
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {!expanded && list.length > PREVIEW_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 py-2 text-sm text-neutral-500"
        >
          외 {list.length - PREVIEW_COUNT}개 보기
        </button>
      )}
    </WeeklyLayout>
  );
}

export default S09ResultPage;
