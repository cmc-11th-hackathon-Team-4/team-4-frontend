import { useQuery } from '@tanstack/react-query';
import { getCycle } from '@/apis/cycle';
import { queryKeys } from '@/apis/queryKeys';
import { useSessionStore } from '@/stores/session';

/** 결산 주기 · 이번 결산일 (V5-12, V5-14) */
export function useCycle() {
  const groupId = useSessionStore((s) => s.groupId) ?? '';
  return useQuery({
    queryKey: queryKeys.cycle(groupId),
    queryFn: () => getCycle(groupId),
    enabled: !!groupId,
  });
}
