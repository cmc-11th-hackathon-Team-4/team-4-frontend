import { useState } from 'react';
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
  const { remove } = useMainMutations();
  const [deleting, setDeleting] = useState<Chore | null>(null);

  if (isLoading || (!group && !isError)) return <StateView type="loading" />;
  if (isError || !group) {
    return (
      <StateView
        type="error"
        message={MAIN_TEXT.loadError}
        retryLabel={MAIN_TEXT.retry}
        onRetry={refetch}
      />
    );
  }

  const ownerName = (id: string) =>
    id === myId ? MAIN_TEXT.meLabel : (group.members.find((m) => m.id === id)?.nickname ?? '');

  return (
    <div className="flex flex-1 flex-col bg-neutral-50">
      <MainHeader showBack title={MAIN_TEXT.choreList} />

      <main className="flex flex-1 flex-col px-4 pt-2 pb-6">
        {group.chores.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-300 py-8 text-center text-sm text-neutral-400">
            {MAIN_TEXT.emptyChoreList}
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl bg-white">
            {group.chores.map((chore) => (
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
