import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChoreList } from '@/apis/chore';
import { queryKeys } from '@/apis/queryKeys';
import ConfirmModal from '@/components/common/ConfirmModal';
import StateView from '@/components/common/StateView';
import TabBar from '@/components/common/TabBar';
import { IconX } from '@/components/common/icons';
import MainHeader from '@/components/main/MainHeader';
import { MAIN_TEXT } from '@/constants/main';
import { useDevSession } from '@/hooks/useDevSession';
import { useGroupBoard } from '@/hooks/useGroupBoard';
import { useMainMutations } from '@/hooks/useMainMutations';
import type { Chore } from '@/types/chore';

/** V5-12 › 집안일 목록: 우리 집 전체 집안일 보기 · 삭제 */
function ChoreListPage() {
  useDevSession();
  const { group, myId, isLoading, isError, refetch } = useGroupBoard();
  const groupId = group?.id ?? '';
  const list = useQuery({
    queryKey: queryKeys.choreList(groupId),
    queryFn: () => getChoreList(groupId),
    enabled: !!groupId,
  });
  const { remove } = useMainMutations();
  const [deleting, setDeleting] = useState<Chore | null>(null);

  if (isLoading || list.isLoading || (!group && !isError)) return <StateView type="loading" />;
  if (isError || list.isError || !group || !list.data) {
    return (
      <StateView
        type="error"
        message={MAIN_TEXT.loadError}
        retryLabel={MAIN_TEXT.retry}
        onRetry={() => {
          refetch();
          list.refetch();
        }}
      />
    );
  }

  const ownerName = (id: string) =>
    !id
      ? ''
      : id === myId
        ? MAIN_TEXT.meLabel
        : (group.members.find((m) => m.id === id)?.nickname ?? '');

  // 실서버 목록엔 담당자가 없어서, 메인 보드의 남은 짐과 집안일 id로 맞춰 붙임 (완료 · 미배정은 빈칸)
  const boardByChoreId = new Map(group.chores.map((c) => [c.choreId ?? c.id, c]));
  const chores: Chore[] = list.data.map((c) => {
    const onBoard = boardByChoreId.get(c.choreId ?? c.id);
    return c.ownerId || !onBoard ? c : { ...c, ownerId: onBoard.ownerId, done: onBoard.done };
  });

  return (
    <div className="flex flex-1 flex-col bg-neutral-50">
      <MainHeader showBack title={MAIN_TEXT.choreList} />

      <main className="flex flex-1 flex-col px-4 pt-2 pb-6">
        {chores.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-300 py-8 text-center text-sm text-neutral-400">
            {MAIN_TEXT.emptyChoreList}
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl bg-white">
            {chores.map((chore) => (
              <li key={chore.id} className="flex h-14 items-center gap-2 pl-4">
                <span className="flex-1 truncate">{chore.name}</span>
                {chore.done && (
                  <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-[10px] text-neutral-500">
                    {MAIN_TEXT.doneTag}
                  </span>
                )}
                <span className="text-sm text-neutral-500">{ownerName(chore.ownerId)}</span>
                <button
                  type="button"
                  aria-label={MAIN_TEXT.deleteChore(chore.name)}
                  className="flex size-11 items-center justify-center text-neutral-400"
                  onClick={() => setDeleting(chore)}
                >
                  <IconX size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <TabBar />

      <ConfirmModal
        open={!!deleting}
        title={MAIN_TEXT.deleteTitle}
        description={deleting ? MAIN_TEXT.deleteDesc(deleting.name) : undefined}
        confirmLabel={MAIN_TEXT.deleteOk}
        cancelLabel={MAIN_TEXT.cancel}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) remove.mutate(deleting);
          setDeleting(null);
        }}
      />
    </div>
  );
}

export default ChoreListPage;
