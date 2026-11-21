import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChore, takeChore, toggleChoreDone, undoTakeChore } from '@/apis/chore';
import { updateStatus } from '@/apis/member';
import { queryKeys } from '@/apis/queryKeys';
import { MAIN_TEXT } from '@/constants/main';
import { useSessionStore } from '@/stores/session';
import { useTakeStore } from '@/stores/take';
import { useToastStore } from '@/stores/toast';
import type { Chore } from '@/types/chore';
import type { Group } from '@/types/group';
import type { MemberStatus } from '@/types/member';

/** 그룹 캐시를 바로 고쳐서(낙관적 업데이트) 화면이 즉시 바뀌게 함 */
function useGroupCache() {
  const queryClient = useQueryClient();
  const groupId = useSessionStore((s) => s.groupId) ?? '';
  const key = queryKeys.group(groupId);

  const patch = async (updater: (group: Group) => Group) => {
    await queryClient.cancelQueries({ queryKey: key });
    const prev = queryClient.getQueryData<Group>(key);
    if (prev) queryClient.setQueryData<Group>(key, updater(prev));
    return { prev };
  };
  const rollback = (prev?: Group) => prev && queryClient.setQueryData(key, prev);
  const refresh = () => queryClient.invalidateQueries({ queryKey: key });

  return { patch, rollback, refresh, groupId };
}

const setOwner = (choreId: string, ownerId: string) => (group: Group) => ({
  ...group,
  chores: group.chores.map((c) => (c.id === choreId ? { ...c, ownerId } : c)),
});

export function useMainMutations() {
  const cache = useGroupCache();
  const memberId = useSessionStore((s) => s.memberId) ?? '';
  const showToast = useToastStore((s) => s.show);
  const setLastTake = useTakeStore((s) => s.setLastTake);
  const onError = (_e: unknown, _v: unknown, context?: { prev?: Group }) => {
    cache.rollback(context?.prev);
    showToast(MAIN_TEXT.error);
  };

  const undo = useMutation({
    mutationFn: (chore: Chore) => undoTakeChore(chore.id, chore.ownerId),
    onMutate: (chore) => cache.patch(setOwner(chore.id, chore.ownerId)),
    onSuccess: () => setLastTake(null),
    onError,
    onSettled: cache.refresh,
  });

  const take = useMutation({
    mutationFn: (chore: Chore) => takeChore(chore.id, memberId),
    onMutate: (chore) => cache.patch(setOwner(chore.id, memberId)),
    onSuccess: (_d, chore) => {
      setLastTake({ choreId: chore.id, fromId: chore.ownerId });
      showToast(MAIN_TEXT.takenToast(chore.name), {
        label: MAIN_TEXT.undo,
        onClick: () => undo.mutate(chore),
      });
    },
    onError,
    onSettled: cache.refresh,
  });

  const status = useMutation({
    mutationFn: (next: MemberStatus) => updateStatus(memberId, next),
    onMutate: (next) =>
      cache.patch((g) => ({
        ...g,
        members: g.members.map((m) => (m.id === memberId ? { ...m, status: next } : m)),
      })),
    onError,
    onSettled: cache.refresh,
  });

  const toggleDone = useMutation({
    mutationFn: (chore: Chore) => toggleChoreDone(chore.id, !chore.done),
    onMutate: (chore) =>
      cache.patch((g) => ({
        ...g,
        chores: g.chores.map((c) => (c.id === chore.id ? { ...c, done: !c.done } : c)),
      })),
    onError,
    onSettled: cache.refresh,
  });

  const add = useMutation({
    mutationFn: (name: string) => createChore(cache.groupId, memberId, name),
    onError: () => showToast(MAIN_TEXT.error),
    onSettled: cache.refresh,
  });

  return { take, undo, status, toggleDone, add };
}
