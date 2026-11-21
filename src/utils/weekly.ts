import type { Chore } from '@/types/chore';
import type { Id } from '@/types/common';
import type { Relief } from '@/types/weekly';

/** S-09 한 일 */
export function getDoneChores(chores: Chore[], ownerId?: Id) {
  return chores.filter((c) => c.done && (!ownerId || c.ownerId === ownerId));
}

/** S-09 못 한 일. 내 못 한 일이 있으면 S-10, 없으면 S-11로 */
export function getUndoneChores(chores: Chore[], ownerId?: Id) {
  return chores.filter((c) => !c.done && (!ownerId || c.ownerId === ownerId));
}

/** 구성원별 덜어준 횟수 */
export function countReliefs(reliefs: Relief[]) {
  const counts = new Map<Id, number>();
  for (const r of reliefs) {
    counts.set(r.toMemberId, (counts.get(r.toMemberId) ?? 0) + 1);
  }
  return counts;
}

/** S-11 배려왕: 가장 많이 덜어준 구성원 id 목록 (동점이면 여러 명, 기록 없으면 빈 배열) */
export function getBestMemberIds(reliefs: Relief[]) {
  const counts = countReliefs(reliefs);
  const max = Math.max(0, ...counts.values());
  if (max === 0) return [];
  return [...counts].filter(([, n]) => n === max).map(([id]) => id);
}

/** 1인당 집안일 수 = 총량 ÷ 인원 (S-10 안내 문구, S-12) */
export function getPerPerson(choreCount: number, memberCount: number) {
  return memberCount > 0 ? Math.ceil(choreCount / memberCount) : 0;
}

/** 종료일까지 남은 날 (S-08 "D-n") */
export function getDaysLeft(endDate: string, today = new Date()) {
  const [y, m, d] = endDate.split('-').map(Number);
  const end = new Date(y, m - 1, d);
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
}

/** "2026-11-17", "2026-11-23" → "11.17 – 11.23" */
export function formatPeriod(startDate: string, endDate: string) {
  const short = (date: string) => {
    const [, m, d] = date.split('-');
    return `${Number(m)}.${d}`;
  };
  return `${short(startDate)} – ${short(endDate)}`;
}

/** 이름 + 이/가 ("민지가", "지민이") */
export function withSubject(name: string) {
  const code = name.charCodeAt(name.length - 1) - 0xac00;
  const hasBatchim = code >= 0 && code <= 11171 && code % 28 !== 0;
  return `${name}${hasBatchim ? '이' : '가'}`;
}
