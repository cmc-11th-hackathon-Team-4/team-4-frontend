import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/apis/queryKeys';
import { getPendingRequests } from '@/apis/request';
import { useSessionStore } from '@/stores/session';

/** 진행 중인 짐 올리기 요청: 내가 보낸 것(요청 중 카드) / 받은 것(부탁 받음 카드) / 짐별 요청 */
export function useChoreRequests() {
  const { memberId, groupId } = useSessionStore();

  const query = useQuery({
    queryKey: queryKeys.requests(memberId ?? ''),
    queryFn: () => getPendingRequests(groupId!),
    enabled: !!memberId && !!groupId,
    refetchInterval: 3000,
  });

  const all = query.data ?? [];
  return {
    ...query,
    sent: all.filter((r) => r.fromId === memberId),
    received: all.filter((r) => r.toId === memberId),
    /** 짐 id → 부탁받은 사람 id */
    toByChore: new Map(all.map((r) => [r.choreId, r.toId])),
  };
}
