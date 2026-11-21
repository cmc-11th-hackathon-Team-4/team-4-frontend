import type { Id } from '@/types/common';
import type {
  CarryChoice,
  CarryOverChoice,
  NextPeriod,
  SettlementChore,
  WeeklyHouseMember,
  WeeklyMember,
  WeeklyPeriod,
  WeeklySettlement,
  WeeklyState,
} from '@/types/weekly';
import { getPerPerson } from '@/utils/weekly';
import { ApiError } from './error';

// 목데이터 (VITE_USE_MOCK이 false가 아니면 사용). 피그마 ③ 예시: 수아(방장) · 민지, 11.17 – 11.23
// 서버 동작(Swagger · 백엔드)과 같은 규칙으로 흉내냄

/** 세션이 없을 때 쓰는 개발용 값 (②의 useDevSession과 같은 id) */
export const MOCK_GROUP_ID: Id = 'g1';
export const MOCK_MEMBER_ID: Id = 'm1';

const HOST_ID: Id = 'm1';
const MEMBERS: WeeklyMember[] = [
  { id: 'm1', nickname: '수아', character: '1' },
  { id: 'm2', nickname: '민지', character: '2' },
];
const byId = (id: Id) => MEMBERS.find((m) => m.id === id)!;

const chore = (id: Id, name: string, assigneeId: Id, done: boolean, helperId?: Id) => ({
  assignmentId: id,
  name,
  done,
  assignee: byId(assigneeId),
  helpedBy: helperId ? { id: helperId, nickname: byId(helperId).nickname } : null,
});

const CHORES: SettlementChore[] = [
  chore('a1', '설거지', 'm2', true, 'm2'),
  chore('a2', '분리수거', 'm2', true, 'm2'),
  chore('a3', '장보기', 'm2', true, 'm2'),
  chore('a4', '화장실 청소', 'm1', true, 'm1'),
  chore('a5', '빨래 개기', 'm2', true),
  chore('a6', '바닥 청소', 'm1', true),
  chore('a7', '화분 물 주기', 'm1', true),
  chore('a8', '냉장고 정리', 'm2', true),
  chore('a9', '창문 닦기', 'm1', false),
  chore('a10', '이불 빨래', 'm1', false),
];
const HEARTS: Record<Id, number> = { m1: 1, m2: 3 };

// 처음엔 진행 중. 기간 종료하기(V5-12 시연)를 누르면 ENDED
let period: WeeklyPeriod = {
  id: 'p1',
  round: 1,
  startDate: '2026-11-17',
  endDate: '2026-11-23',
  status: 'ACTIVE',
};
let carryChoices: Record<Id, CarryChoice> = {};
let next: NextPeriod = { prepared: false, period: null, totalCount: 0, members: [] };
let nextStarted = false;

const delay = <T>(value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(structuredClone(value)), 300));
const fail = (code: string, message: string) =>
  new Promise<never>((_, reject) => setTimeout(() => reject(new ApiError(code, message)), 300));

function buildSettlement(memberId: Id): WeeklySettlement {
  const helped = (id: Id) => CHORES.filter((c) => c.helpedBy?.id === id).length;
  const ranking = MEMBERS.map((m) => ({
    ...m,
    helpedCount: helped(m.id),
    receivedHeartCount: HEARTS[m.id] ?? 0,
  }));
  const max = Math.max(0, ...ranking.map((r) => r.helpedCount));
  return {
    period,
    members: MEMBERS,
    summary: {
      totalCount: CHORES.length,
      doneCount: CHORES.filter((c) => c.done).length,
      undoneCount: CHORES.filter((c) => !c.done).length,
      helpedCount: CHORES.filter((c) => c.helpedBy).length,
    },
    chores: CHORES,
    myUndone: CHORES.filter((c) => !c.done && c.assignee.id === memberId).map((c) => ({
      assignmentId: c.assignmentId,
      name: c.name,
      carryChoice: carryChoices[c.assignmentId] ?? null,
    })),
    ranking,
    kingIds: max === 0 ? [] : ranking.filter((r) => r.helpedCount === max).map((r) => r.id),
    nextPeriodStarted: nextStarted,
  };
}

/** KEEP(미선택 포함) 못 한 일은 원래 담당자에게 고정, 나머지만 1인당 개수가 균등하게 랜덤 배분 */
function distribute(memberId: Id): NextPeriod {
  const perPerson = getPerPerson(CHORES.length, MEMBERS.length);
  const kept = CHORES.filter((c) => !c.done && carryChoices[c.assignmentId] !== 'RELEASE');
  const rest = CHORES.filter((c) => !kept.includes(c)).sort(() => Math.random() - 0.5);
  const owned = new Map(
    MEMBERS.map((m) => [
      m.id,
      kept
        .filter((c) => c.assignee.id === m.id)
        .map((c) => ({ id: c.assignmentId, name: c.name, carriedOver: true })),
    ]),
  );
  for (const c of rest) {
    const target = MEMBERS.find((m) => owned.get(m.id)!.length < perPerson) ?? MEMBERS[0];
    owned.get(target.id)!.push({ id: c.assignmentId, name: c.name, carriedOver: false });
  }
  return {
    prepared: true,
    period: {
      id: 'p2',
      round: period.round + 1,
      startDate: '2026-11-24',
      endDate: '2026-11-30',
      status: 'READY',
    },
    totalCount: CHORES.length,
    members: MEMBERS.map((m) => ({
      ...m,
      isHost: m.id === HOST_ID,
      isMe: m.id === memberId,
      chores: owned.get(m.id)!,
    })),
  };
}

export const mockWeeklyApi = {
  /** GET /houses/{houseId}/home 의 period + ENDED면 결산 */
  getState: (memberId: Id): Promise<WeeklyState> =>
    delay({
      period,
      settlement: period.status === 'ENDED' && !nextStarted ? buildSettlement(memberId) : null,
    }),

  getHouseMembers: (memberId: Id): Promise<WeeklyHouseMember[]> =>
    delay(MEMBERS.map((m) => ({ ...m, isHost: m.id === HOST_ID, isMe: m.id === memberId }))),

  saveCarryOver: (choices: CarryOverChoice[]) => {
    if (nextStarted) return fail('PERIOD-409-2', '이미 다음 기간이 시작되었습니다.');
    carryChoices = {
      ...carryChoices,
      ...Object.fromEntries(choices.map((c) => [c.assignmentId, c.choice])),
    };
    return delay(undefined);
  },

  getNext: (memberId: Id): Promise<NextPeriod> => {
    if (nextStarted) return fail('PERIOD-409-2', '이미 다음 기간이 시작되었습니다.');
    if (period.status !== 'ENDED') return fail('PERIOD-409-1', '아직 종료되지 않은 기간입니다.');
    return delay(next.prepared ? { ...next, members: withMe(next, memberId) } : next);
  },

  createNext: (memberId: Id): Promise<NextPeriod> => {
    if (memberId !== HOST_ID) return fail('HOUSE-403', '방장만 할 수 있습니다.');
    if (nextStarted) return fail('PERIOD-409-2', '이미 다음 기간이 시작되었습니다.');
    next = distribute(memberId);
    return delay(next);
  },

  startNext: (memberId: Id) => {
    if (memberId !== HOST_ID) return fail('HOUSE-403', '방장만 할 수 있습니다.');
    if (!next.prepared || !next.period) return fail('PERIOD-404-1', '준비된 다음 기간이 없습니다.');
    nextStarted = true;
    period = { ...next.period, status: 'ACTIVE' };
    return delay(undefined);
  },

  endPeriod: (memberId: Id) => {
    if (memberId !== HOST_ID) return fail('HOUSE-403', '방장만 할 수 있습니다.');
    period = { ...period, status: 'ENDED' };
    return delay(undefined);
  },
};

function withMe(value: NextPeriod, memberId: Id) {
  return value.members.map((m) => ({ ...m, isMe: m.id === memberId }));
}
