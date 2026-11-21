import type { Id } from '@/types/common';
import type { CharacterId } from '@/types/member';
import type {
  CarryChoice,
  CarryOverChoice,
  NextPeriod,
  PeriodStatus,
  WeeklyHouseMember,
  WeeklyMember,
  WeeklyPeriod,
  WeeklySettlement,
  WeeklyState,
} from '@/types/weekly';
import { USE_MOCK } from './config';
import { instance } from './instance';
import { mockWeeklyApi } from './weeklyMock';

// ③ 주간 결산 API (Swagger 기준, 경로 앞 /api/v1)
// 서버 id(number) → Id(string), characterType 'CHARACTER_1' → CharacterId '1'

const BASE = '/api/v1';

// ---------- 서버 응답 모양 (백엔드 DTO) ----------
type ServerCharacter = `CHARACTER_${number}`;

interface ServerPeriod {
  id: number;
  round: number;
  startDate: string;
  endDate: string;
  status: PeriodStatus;
}

interface ServerUser {
  userId: number;
  name: string;
  characterType: ServerCharacter;
}

interface ServerSettlement {
  period: ServerPeriod;
  members: ServerUser[];
  summary: { totalCount: number; doneCount: number; undoneCount: number; helpedCount: number };
  chores: {
    assignmentId: number;
    name: string;
    status: 'TODO' | 'DONE';
    assignee: ServerUser;
    helpedBy: { userId: number; name: string } | null;
  }[];
  myUndone: { assignmentId: number; name: string; carryChoice: CarryChoice | null }[];
  kindness: {
    ranking: (ServerUser & { helpedCount: number; receivedHeartCount: number })[];
    kingUserIds: number[];
  };
  nextPeriodStarted: boolean;
}

interface ServerNextPeriod {
  prepared: boolean;
  period: ServerPeriod | null;
  totalCount: number;
  members: (ServerUser & {
    role: 'OWNER' | 'MEMBER';
    isMe: boolean;
    chores: { choreId: number; name: string; carriedOver: boolean }[];
  })[];
}

// ---------- 변환 ----------
const toCharacter = (type: string): CharacterId => type.replace('CHARACTER_', '');

const toMember = (u: ServerUser): WeeklyMember => ({
  id: String(u.userId),
  nickname: u.name,
  character: toCharacter(u.characterType),
});

const toPeriod = (p: ServerPeriod): WeeklyPeriod => ({ ...p, id: String(p.id) });

function toSettlement(s: ServerSettlement): WeeklySettlement {
  return {
    period: toPeriod(s.period),
    members: s.members.map(toMember),
    summary: s.summary,
    chores: s.chores.map((c) => ({
      assignmentId: String(c.assignmentId),
      name: c.name,
      done: c.status === 'DONE',
      assignee: toMember(c.assignee),
      helpedBy: c.helpedBy ? { id: String(c.helpedBy.userId), nickname: c.helpedBy.name } : null,
    })),
    myUndone: s.myUndone.map((u) => ({ ...u, assignmentId: String(u.assignmentId) })),
    ranking: s.kindness.ranking.map((r) => ({
      ...toMember(r),
      helpedCount: r.helpedCount,
      receivedHeartCount: r.receivedHeartCount,
    })),
    kingIds: s.kindness.kingUserIds.map(String),
    nextPeriodStarted: s.nextPeriodStarted,
  };
}

function toNextPeriod(n: ServerNextPeriod): NextPeriod {
  return {
    prepared: n.prepared,
    period: n.period ? toPeriod(n.period) : null,
    totalCount: n.totalCount,
    members: n.members.map((m) => ({
      ...toMember(m),
      isHost: m.role === 'OWNER',
      isMe: m.isMe,
      chores: m.chores.map((c) => ({
        id: String(c.choreId),
        name: c.name,
        carriedOver: c.carriedOver,
      })),
    })),
  };
}

// ---------- API ----------

/**
 * 결산 탭 상태 (S-08 ~ S-11)
 * 1) GET /houses/{houseId}/home 의 period (READY 제외 가장 최근 기간)
 * 2) ENDED면 GET /periods/{periodId}/settlement
 */
export async function getWeeklyState(houseId: Id, memberId: Id): Promise<WeeklyState> {
  if (USE_MOCK) return mockWeeklyApi.getState(memberId);

  const { data: home } = await instance.get<{ period: ServerPeriod | null }>(
    `${BASE}/houses/${houseId}/home`,
  );
  if (!home.period) return { period: null, settlement: null };
  const period = toPeriod(home.period);
  if (period.status !== 'ENDED') return { period, settlement: null };

  const { data } = await instance.get<ServerSettlement>(`${BASE}/periods/${period.id}/settlement`);
  return { period, settlement: toSettlement(data) };
}

/** 방장 · 나 구분 (GET /houses/{houseId}) */
export async function getHouseMembers(houseId: Id, memberId: Id): Promise<WeeklyHouseMember[]> {
  if (USE_MOCK) return mockWeeklyApi.getHouseMembers(memberId);

  const { data } = await instance.get<{
    members: (ServerUser & { role: 'OWNER' | 'MEMBER'; isMe: boolean })[];
  }>(`${BASE}/houses/${houseId}`);
  return data.members.map((m) => ({ ...toMember(m), isHost: m.role === 'OWNER', isMe: m.isMe }));
}

/** S-10 못 한 일 이월 선택 저장 (PUT /periods/{periodId}/carry-overs) */
export async function putCarryOvers(periodId: Id, choices: CarryOverChoice[]) {
  if (USE_MOCK) return mockWeeklyApi.saveCarryOver(choices);

  await instance.put(`${BASE}/periods/${periodId}/carry-overs`, {
    choices: choices.map((c) => ({ assignmentId: Number(c.assignmentId), choice: c.choice })),
  });
}

/** S-12 다음 주기 배분 조회 (GET /houses/{houseId}/periods/next). 다음 기간이 시작됐으면 PERIOD-409-2 */
export async function getNextPeriod(houseId: Id, memberId: Id): Promise<NextPeriod> {
  if (USE_MOCK) return mockWeeklyApi.getNext(memberId);

  const { data } = await instance.get<ServerNextPeriod>(`${BASE}/houses/${houseId}/periods/next`);
  return toNextPeriod(data);
}

/** S-12 다음 주기 배분 만들기 · 다시 나누기 (방장, POST /houses/{houseId}/periods/next) */
export async function postNextPeriod(houseId: Id, memberId: Id): Promise<NextPeriod> {
  if (USE_MOCK) return mockWeeklyApi.createNext(memberId);

  const { data } = await instance.post<ServerNextPeriod>(`${BASE}/houses/${houseId}/periods/next`);
  return toNextPeriod(data);
}

/** S-12 이대로 시작하기 (방장, POST /houses/{houseId}/periods/next/start) */
export async function postStartNextPeriod(houseId: Id, memberId: Id) {
  if (USE_MOCK) return mockWeeklyApi.startNext(memberId);

  await instance.post(`${BASE}/houses/${houseId}/periods/next/start`);
}

/** 시연용 기간 종료 (V5-12 시연 메뉴, 방장, POST /houses/{houseId}/periods/current/end) */
export async function postEndPeriod(houseId: Id, memberId: Id) {
  if (USE_MOCK) return mockWeeklyApi.endPeriod(memberId);

  await instance.post(`${BASE}/houses/${houseId}/periods/current/end`);
}
