import type { Chore } from '@/types/chore';
import type { Id } from '@/types/common';
import type { Relief } from '@/types/weekly';

/** S-09 한 일 */
export function getDoneChores(chores: Chore[], ownerId?: Id) {
  return chores.filter((c) => c.done && (!ownerId || c.ownerId === ownerId));
}

/** S-09 못 한 일. 있으면 S-10, 없으면 S-11로 */
export function getUndoneChores(chores: Chore[], ownerId?: Id) {
  return chores.filter((c) => !c.done && (!ownerId || c.ownerId === ownerId));
}

/** 구성원별 덜어간 횟수 */
export function countReliefs(reliefs: Relief[]) {
  const counts = new Map<Id, number>();
  for (const r of reliefs) {
    counts.set(r.toMemberId, (counts.get(r.toMemberId) ?? 0) + 1);
  }
  return counts;
}

/** S-11 배려왕: 가장 많이 덜어간 구성원 id 목록 (동점이면 여러 명, 기록 없으면 빈 배열) */
export function getBestMemberIds(reliefs: Relief[]) {
  const counts = countReliefs(reliefs);
  const max = Math.max(0, ...counts.values());
  if (max === 0) return [];
  return [...counts].filter(([, n]) => n === max).map(([id]) => id);
}

/** S-11 구성원 입장: 내 짐을 덜어간 기록 */
export function getReliefsReceived(reliefs: Relief[], memberId: Id) {
  return reliefs.filter((r) => r.fromMemberId === memberId);
}
