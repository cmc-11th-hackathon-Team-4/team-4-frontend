import { useQuery } from '@tanstack/react-query';
import { getGroup } from '@/apis/group';
import { queryKeys } from '@/apis/queryKeys';
import { useSessionStore } from '@/stores/session';
import type { Chore } from '@/types/chore';
import type { Id } from '@/types/common';

/** 그룹 전체 + 자주 쓰는 계산값 */
export function useGroupBoard() {
  const { memberId, groupId } = useSessionStore();

  const query = useQuery({
    queryKey: queryKeys.group(groupId ?? ''),
    queryFn: () => getGroup(groupId!),
    enabled: !!groupId,
    refetchInterval: 3000, // 다른 폰 변경 반영 (TODO: 공용 알림 폴링과 통합)
  });

  const group = query.data;
  const me = group?.members.find((m) => m.id === memberId);
  const choresOf = (id: Id): Chore[] => group?.chores.filter((c) => c.ownerId === id) ?? [];
  const pendingCountOf = (id: Id) => choresOf(id).filter((c) => !c.done).length;

  return { ...query, group, me, myId: memberId, choresOf, pendingCountOf };
}
