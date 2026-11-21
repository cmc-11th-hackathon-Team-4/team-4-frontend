import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  cancelChoreRequest,
  completeChore,
  createChore,
  deleteChore,
  requestChore,
  respondChoreRequest,
  takeChore,
} from '@/apis/chore';
import { extendCycle } from '@/apis/cycle';
import { isApiError } from '@/apis/error';
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
  const groupId = useSessionStore((s) => s.groupId);
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
      queryClient.invalidateQueries({ queryKey: queryKeys.choreList(groupId ?? '') }),
    ]);

  return { patch, rollback, refresh };
}

/** 서버 에러 코드 → 토스트 문구 (짐 5개 · 집 10개 제한 등) */
const ERROR_TOAST: Record<string, string> = {
  'ASSIGNMENT-409-2': MAIN_TEXT.memberFullToast,
  'CHORE-409-1': MAIN_TEXT.houseFullToast,
  'CHORE-409': MAIN_TEXT.duplicateChoreToast,
  'ASSIGNMENT-409-1': MAIN_TEXT.alreadyRequestedToast,
};
const errorToast = (error: unknown) =>
  (isApiError(error) && ERROR_TOAST[error.code]) || MAIN_TEXT.error;

const updateChore = (choreId: string, change: Partial<Chore>) => (group: Group) => ({
  ...group,
  chores: group.chores.map((c) => (c.id === choreId ? { ...c, ...change } : c)),
});

export function useMainMutations() {
  const cache = useGroupCache();
  const queryClient = useQueryClient();
  const memberId = useSessionStore((s) => s.memberId) ?? '';
  const groupId = useSessionStore((s) => s.groupId) ?? '';
  const showToast = useToastStore((s) => s.show);
  const onError = (error: unknown, _v: unknown, context?: { prev?: Group }) => {
    cache.rollback(context?.prev);
    showToast(errorToast(error));
  };
  const onPlainError = (error: unknown) => showToast(errorToast(error));

  /** A · 덜어주기 */
  const take = useMutation({
    mutationFn: (chore: Chore) => takeChore(chore.id),
    onMutate: (chore) => cache.patch(updateChore(chore.id, { ownerId: memberId })),
    onSuccess: (_d, chore) => showToast(MAIN_TEXT.takenToast(chore.name)),
    onError,
    onSettled: cache.refresh,
  });

  /** B · 짐 올리기 요청 */
  const request = useMutation({
    mutationFn: ({ chore, toId }: { chore: Chore; toId: string }) => requestChore(chore.id, toId),
    onSuccess: () => showToast(MAIN_TEXT.requestedToast),
    onError: onPlainError,
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
    mutationFn: (next: MemberStatus) => updateStatus(next),
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
    onError: onPlainError,
    onSettled: cache.refresh,
  });

  /** V5-12 집안일 목록 › 삭제 */
  const remove = useMutation({
    mutationFn: (chore: Chore) => deleteChore(groupId, chore),
    onMutate: (chore) =>
      cache.patch((g) => ({ ...g, chores: g.chores.filter((c) => c.id !== chore.id) })),
    onSuccess: (_d, chore) => showToast(MAIN_TEXT.deletedToast(chore.name)),
    onError,
    onSettled: cache.refresh,
  });

  /** B · 부탁 취소 → 카드가 원래대로 */
  const cancelRequest = useMutation({
    mutationFn: (req: ChoreRequest) => cancelChoreRequest(req.id),
    onSuccess: () => showToast(MAIN_TEXT.canceledToast),
    onError: onPlainError,
    onSettled: cache.refresh,
  });

  /** V5-14 이번 기간 늘리기 */
  const extend = useMutation({
    mutationFn: (days: number) => extendCycle(groupId, days),
    onError: onPlainError,
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cycle(groupId) }),
  });

  return { take, request, respond, complete, status, add, remove, cancelRequest, extend };
}
