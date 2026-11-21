import type { Chore } from '@/types/chore';
import type { Id } from '@/types/common';
import type { CarryOverItem, NextCycle, WeeklySettlement } from '@/types/weekly';
import { getPerPerson } from '@/utils/weekly';

// TODO(API): 백엔드 API 확정 전까지 쓰는 목 데이터 (피그마 ③ 플로우 기준: 수아(방장) · 민지)

/** 세션이 없을 때 쓰는 개발용 값. 민지 화면을 보려면 MOCK_MEMBER_ID를 'm2'로 */
export const MOCK_GROUP_ID: Id = 'g1';
export const MOCK_MEMBER_ID: Id = 'm1';

const chore = (id: Id, name: string, ownerId: Id, done: boolean): Chore => ({
  id,
  name,
  ownerId,
  done,
});

const settlement: WeeklySettlement = {
  status: 'ended',
  startDate: '2026-11-17',
  endDate: '2026-11-23',
  members: [
    { id: 'm1', nickname: '수아', character: '1', status: 'relaxed', isHost: true },
    { id: 'm2', nickname: '민지', character: '2', status: 'relaxed', isHost: false },
  ],
  chores: [
    chore('c1', '설거지', 'm2', true),
    chore('c2', '분리수거', 'm2', true),
    chore('c3', '장보기', 'm2', true),
    chore('c4', '화장실 청소', 'm1', true),
    chore('c5', '빨래 개기', 'm2', true),
    chore('c6', '바닥 청소', 'm1', true),
    chore('c7', '화분 물 주기', 'm1', true),
    chore('c8', '냉장고 정리', 'm2', true),
    chore('c9', '창문 닦기', 'm1', false),
    chore('c10', '이불 빨래', 'm1', false),
  ],
  reliefs: [
    { id: 'r1', choreId: 'c1', fromMemberId: 'm1', toMemberId: 'm2' },
    { id: 'r2', choreId: 'c2', fromMemberId: 'm1', toMemberId: 'm2' },
    { id: 'r3', choreId: 'c3', fromMemberId: 'm1', toMemberId: 'm2' },
    { id: 'r4', choreId: 'c4', fromMemberId: 'm2', toMemberId: 'm1' },
  ],
  hearts: { m1: 1, m2: 3 },
};

// 피그마 S-12 예시 배분 (S-10 전 기본값: 수아 못 한 일 2개 이월)
let nextCycle: NextCycle = {
  startDate: '2026-11-24',
  endDate: '2026-11-30',
  chores: [
    chore('c9', '창문 닦기', 'm1', false),
    chore('c10', '이불 빨래', 'm1', false),
    chore('c1', '설거지', 'm1', false),
    chore('c3', '장보기', 'm1', false),
    chore('c7', '화분 물 주기', 'm1', false),
    chore('c5', '빨래 개기', 'm2', false),
    chore('c2', '분리수거', 'm2', false),
    chore('c4', '화장실 청소', 'm2', false),
    chore('c6', '바닥 청소', 'm2', false),
    chore('c8', '냉장고 정리', 'm2', false),
  ],
  carriedChoreIds: ['c9', 'c10'],
  started: false,
};

/** 이월한 일은 원래 담당자 칸에 먼저 고정, 나머지는 1인당 개수를 맞춰 랜덤 배분 */
function distribute(carriedIds: Id[]): Chore[] {
  const memberIds = settlement.members.map((m) => m.id);
  const perPerson = getPerPerson(settlement.chores.length, memberIds.length);
  const carried = new Set(carriedIds);
  const result = settlement.chores
    .filter((c) => carried.has(c.id))
    .map((c) => ({ ...c, done: false }));
  const counts = new Map(
    memberIds.map((id) => [id, result.filter((c) => c.ownerId === id).length]),
  );
  const rest = settlement.chores.filter((c) => !carried.has(c.id)).sort(() => Math.random() - 0.5);
  for (const c of rest) {
    const ownerId = memberIds.find((id) => (counts.get(id) ?? 0) < perPerson) ?? memberIds[0];
    counts.set(ownerId, (counts.get(ownerId) ?? 0) + 1);
    result.push({ ...c, ownerId, done: false });
  }
  return result;
}

const delay = <T>(value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(structuredClone(value)), 300));

export const mockWeeklyApi = {
  getSettlement: () => delay(settlement),

  /** 내 못 한 일만 갱신. 덜어내기는 다음 랜덤 배분으로 */
  carryOver: (memberId: Id, items: CarryOverItem[]) => {
    const mine = new Set(settlement.chores.filter((c) => c.ownerId === memberId).map((c) => c.id));
    const carriedChoreIds = [
      ...nextCycle.carriedChoreIds.filter((id) => !mine.has(id)),
      ...items.filter((i) => i.action === 'carry').map((i) => i.choreId),
    ];
    nextCycle = { ...nextCycle, carriedChoreIds, chores: distribute(carriedChoreIds) };
    return delay(undefined);
  },

  getNextCycle: () => delay(nextCycle),

  /** 이월 칸은 그대로 두고 나머지만 다시 섞기 */
  reassign: () => {
    nextCycle = { ...nextCycle, chores: distribute(nextCycle.carriedChoreIds) };
    return delay(nextCycle);
  },

  start: () => {
    nextCycle = { ...nextCycle, started: true };
    return delay(undefined);
  },
};
