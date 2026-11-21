import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/apis/queryKeys';
import { getPendingRequests } from '@/apis/request';
import { useSessionStore } from '@/stores/session';

/** 진행 중인 짐 올리기 요청: 내가 보낸 것(요청 중 카드) / 받은 것(부탁 받음 카드) */
export function useChoreRequests() {
  const memberId = useSessionStore((s) => s.memberId) ?? '';

  const query = useQuery({
    queryKey: queryKeys.requests(memberId),
    queryFn: () => getPendingRequests(memberId),
    enabled: !!memberId,
    refetchInterval: 3000,
  });

  const all = query.data ?? [];
  return {
    ...query,
    sent: all.filter((r) => r.fromId === memberId),
    received: all.filter((r) => r.toId === memberId),
  };
}
