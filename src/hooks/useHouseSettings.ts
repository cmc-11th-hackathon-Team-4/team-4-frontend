import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addChore, extendHouseCycle, getHouseCycle } from '@/apis/houseSettings';
import { queryKeys } from '@/apis/queryKeys';
import { useSessionStore } from '@/stores/session';
import type { ExtendDays } from '@/types/houseSettings';

const cycleKey = (groupId: string) => ['houseCycle', groupId] as const;

/** V5-12 결산 주기 · 결산일 */
export function useHouseCycle() {
  const groupId = useSessionStore((s) => s.groupId);
  return useQuery({
    queryKey: cycleKey(groupId ?? ''),
    queryFn: () => getHouseCycle(groupId!),
    enabled: !!groupId,
  });
}

/** V5-14 이번 기간 늘리기 */
export function useExtendCycle() {
  const groupId = useSessionStore((s) => s.groupId);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (days: ExtendDays) => extendHouseCycle(groupId!, days),
    onSuccess: (data) => queryClient.setQueryData(cycleKey(groupId ?? ''), data),
  });
}

/** V5-13 집안일 추가 */
export function useAddChore() {
  const { groupId, memberId } = useSessionStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => addChore(groupId!, memberId!, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.group(groupId ?? '') }),
  });
}
