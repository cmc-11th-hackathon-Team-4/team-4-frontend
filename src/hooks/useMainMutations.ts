import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  completeChore,
  createChore,
  deleteChore,
  requestChore,
  respondChoreRequest,
  takeChore,
} from '@/apis/chore';
import { endCycle } from '@/apis/cycle';
import { updateStatus } from '@/apis/member';
import { queryKeys } from '@/apis/queryKeys';
import { MAIN_TEXT } from '@/constants/main';
import { useSessionStore } from '@/stores/session';
import { useToastStore } from '@/stores/toast';
import type { Chore } from '@/types/chore';
import type { Group } from '@/types/group';
import type { MemberStatus } from '@/types/member';
import type { ChoreRequest } from '@/types/request';

/** 그룹 캐시를 바로 고쳐서(낙관적 업데이트) 화면이 즉시 바뀌게 함 */
function useGroupCache() {
  const queryClient = useQueryClient();
  const { groupId, memberId } = useSessionStore();
  const key = queryKeys.group(groupId ?? '');

  const patch = async (updater: (group: Group) => Group) => {
    await queryClient.cancelQueries({ queryKey: key });
    const prev = queryClient.getQueryData<Group>(key);
    if (prev) queryClient.setQueryData<Group>(key, updater(prev));
    return { prev };
  };
  const rollback = (prev?: Group) => prev && queryClient.setQueryData(key, prev);
  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: key }),
      queryClient.invalidateQueries({ queryKey: queryKeys.requests(memberId ?? '') }),
    ]);

  return { patch, rollback, refresh };
}

const updateChore = (choreId: string, change: Partial<Chore>) => (group: Group) => ({
  ...group,
  chores: group.chores.map((c) => (c.id === choreId ? { ...c, ...change } : c)),
});

export function useMainMutations() {
  const cache = useGroupCache();
  const memberId = useSessionStore((s) => s.memberId) ?? '';
  const groupId = useSessionStore((s) => s.groupId) ?? '';
  const showToast = useToastStore((s) => s.show);
  const onError = (_e: unknown, _v: unknown, context?: { prev?: Group }) => {
    cache.rollback(context?.prev);
    showToast(MAIN_TEXT.error);
  };

  /** A · 덜어주기 */
  const take = useMutation({
    mutationFn: (chore: Chore) => takeChore(chore.id, memberId),
    onMutate: (chore) => cache.patch(updateChore(chore.id, { ownerId: memberId })),
    onSuccess: (_d, chore) => showToast(MAIN_TEXT.takenToast(chore.name)),
    onError,
    onSettled: cache.refresh,
  });

  /** B · 짐 올리기 요청 */
  const request = useMutation({
    mutationFn: ({ chore, toId }: { chore: Chore; toId: string }) =>
      requestChore(chore.id, memberId, toId),
    onSuccess: () => showToast(MAIN_TEXT.requestedToast),
    onError: () => showToast(MAIN_TEXT.error),
    onSettled: cache.refresh,
  });

  /** B · 받을게요 / 다음에 */
  const respond = useMutation({
    mutationFn: ({ req, accept }: { req: ChoreRequest; accept: boolean; choreName: string }) =>
      respondChoreRequest(req.id, accept),
    onMutate: ({ req, accept }) =>
      cache.patch(accept ? updateChore(req.choreId, { ownerId: memberId }) : (g) => g),
    onSuccess: (_d, { accept, choreName }) =>
      showToast(accept ? MAIN_TEXT.acceptedToast(choreName) : MAIN_TEXT.declinedToast),
    onError,
    onSettled: cache.refresh,
  });

  /** C · 완료 */
  const complete = useMutation({
    mutationFn: (chore: Chore) => completeChore(chore.id),
    onMutate: (chore) => cache.patch(updateChore(chore.id, { done: true })),
    onSuccess: (_d, chore) => showToast(MAIN_TEXT.doneToast(chore.name)),
    onError,
    onSettled: cache.refresh,
  });

  /** 기분 선택 */
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

  /** V5-13 집안일 추가 (실패 시 입력값은 시트에 그대로) */
  const add = useMutation({
    mutationFn: (name: string) => createChore(groupId, memberId, name),
    onError: () => showToast(MAIN_TEXT.error),
    onSettled: cache.refresh,
  });

  /** V5-12 집안일 목록 › 삭제 */
  const remove = useMutation({
    mutationFn: (chore: Chore) => deleteChore(chore.id),
    onMutate: (chore) =>
      cache.patch((g) => ({ ...g, chores: g.chores.filter((c) => c.id !== chore.id) })),
    onSuccess: (_d, chore) => showToast(MAIN_TEXT.deletedToast(chore.name)),
    onError,
    onSettled: cache.refresh,
  });

  /** V5-12 시연용 · 기간 종료하기 */
  const end = useMutation({
    mutationFn: () => endCycle(groupId, memberId),
    onError: () => showToast(MAIN_TEXT.error),
  });

  return { take, request, respond, complete, status, add, remove, end };
}
