import { fromServerCharacter } from '@/constants/character';
import type { Chore } from '@/types/chore';
import type { Id } from '@/types/common';
import type { CyclePeriod } from '@/types/cycle';
import type { Group } from '@/types/group';
import type { MemberStatus } from '@/types/member';
import type { AppNotification, NotificationType } from '@/types/notification';
import type { ChoreRequest } from '@/types/request';
import { getHouse } from './onboarding';
import { instance } from './instance';

// ② 메인 실서버 응답 모양 + 화면 모델(Group · Chore · ChoreRequest · AppNotification) 변환
// 서버 id(number) → Id(string), characterType 'CHARACTER_1' → '1', mood ↔ status

export const API = '/api/v1';

/* ── 기분 ── */
type ServerMood = 'RELAXED' | 'TIRED' | 'NO_CHOICE';

const MOOD_TO_STATUS: Record<ServerMood, MemberStatus> = {
  RELAXED: 'relaxed',
  TIRED: 'tired',
  NO_CHOICE: 'unwilling',
};
export const toServerMood = (status: MemberStatus): ServerMood =>
  (Object.keys(MOOD_TO_STATUS) as ServerMood[]).find((k) => MOOD_TO_STATUS[k] === status)!;

/* ── 응답 DTO ── */
interface ServerPendingRequest {
  transferId?: number;
  toUserId: number;
  toName: string;
}

interface ServerAssignment {
  id: number;
  choreId: number;
  name: string;
  status: 'TODO' | 'DONE';
  pendingRequest: ServerPendingRequest | null;
}

interface ServerHome {
  house: { id: number; name: string };
  me: { userId: number; mood: ServerMood };
  members: {
    userId: number;
    name: string;
    characterType: string;
    mood: ServerMood;
    isMe: boolean;
  }[];
  myAssignments: ServerAssignment[];
  receivedRequests: {
    transferId: number;
    assignmentId: number;
    choreName: string;
    fromUserId: number;
    createdAt: string;
  }[];
}

interface ServerMemberDetail {
  assignments: ServerAssignment[];
}

export interface ServerNotification {
  id: number;
  type:
    | 'CHORE_RELIEVED'
    | 'HEART_RECEIVED'
    | 'REQUEST_ACCEPTED'
    | 'REQUEST_DECLINED'
    | 'MOOD_NO_CHOICE'
    | 'PERIOD_STARTED'
    | 'PERIOD_EXTENDED'
    | 'PERIOD_ENDED';
  actor: { userId: number } | null;
  transferId: number | null;
  choreName: string | null;
  message: string;
  hearted: boolean | null;
  createdAt: string;
}

/* ── 변환 ── */
const toChore = (a: ServerAssignment, ownerId: Id): Chore => ({
  id: String(a.id),
  choreId: String(a.choreId),
  name: a.name,
  ownerId,
  done: a.status === 'DONE',
});

const pendingOf = (a: ServerAssignment, fromId: Id): ChoreRequest | null =>
  a.pendingRequest
    ? {
        // transferId가 없으면(상대끼리 부탁) 표시용 임시 id
        id: a.pendingRequest.transferId ? String(a.pendingRequest.transferId) : `a${a.id}`,
        choreId: String(a.id),
        fromId,
        toId: String(a.pendingRequest.toUserId),
        status: 'pending',
        createdAt: '',
      }
    : null;

/**
 * 메인 보드 = GET /houses/{id}/home + GET /houses/{id}(방장 · 초대 코드)
 *           + 상대마다 GET /houses/{id}/members/{userId}(상대 남은 짐 · 부탁 중)
 */
export async function fetchBoard(houseId: Id): Promise<Group> {
  const [{ data: home }, house] = await Promise.all([
    instance.get<ServerHome>(`${API}/houses/${houseId}/home`),
    getHouse(houseId),
  ]);
  const myId = String(home.me.userId);
  const others = home.members.filter((m) => !m.isMe);
  const details = await Promise.all(
    others.map((m) =>
      instance
        .get<ServerMemberDetail>(`${API}/houses/${houseId}/members/${m.userId}`)
        .then(({ data }) => ({ ownerId: String(m.userId), data })),
    ),
  );
  const hostIds = new Set(
    house.members.filter((m) => m.role === 'OWNER').map((m) => String(m.userId)),
  );

  const chores: Chore[] = [
    ...home.myAssignments.map((a) => toChore(a, myId)),
    ...details.flatMap(({ ownerId, data }) => data.assignments.map((a) => toChore(a, ownerId))),
  ];

  const requests: ChoreRequest[] = [
    ...home.myAssignments.map((a) => pendingOf(a, myId)),
    ...details.flatMap(({ ownerId, data }) => data.assignments.map((a) => pendingOf(a, ownerId))),
  ].filter((r): r is ChoreRequest => !!r);
  // 받은 부탁은 transferId가 있는 home 값으로 덮어씀 (수락 · 거절에 필요)
  for (const r of home.receivedRequests) {
    const received: ChoreRequest = {
      id: String(r.transferId),
      choreId: String(r.assignmentId),
      fromId: String(r.fromUserId),
      toId: myId,
      status: 'pending',
      createdAt: r.createdAt,
      choreName: r.choreName,
    };
    const i = requests.findIndex((x) => x.choreId === received.choreId);
    if (i >= 0) requests[i] = received;
    else requests.push(received);
  }

  return {
    id: String(home.house.id),
    name: home.house.name,
    inviteCode: house.inviteCode,
    members: home.members.map((m) => ({
      id: String(m.userId),
      nickname: m.name,
      character: fromServerCharacter(m.characterType),
      status: MOOD_TO_STATUS[m.mood],
      isHost: hostIds.has(String(m.userId)),
    })),
    chores,
    requests,
  };
}

const NOTIFICATION_TYPE: Record<ServerNotification['type'], NotificationType> = {
  CHORE_RELIEVED: 'take',
  HEART_RECEIVED: 'heart',
  REQUEST_ACCEPTED: 'accept',
  REQUEST_DECLINED: 'decline',
  MOOD_NO_CHOICE: 'status',
  PERIOD_STARTED: 'cycleStart',
  PERIOD_EXTENDED: 'cycleExtend',
  PERIOD_ENDED: 'cycleEnd',
};

export const toNotification = (n: ServerNotification, myId: Id): AppNotification => ({
  id: String(n.id),
  type: NOTIFICATION_TYPE[n.type],
  fromId: n.actor ? String(n.actor.userId) : '',
  toId: myId,
  status: n.type === 'MOOD_NO_CHOICE' ? 'unwilling' : undefined,
  createdAt: n.createdAt,
  choreName: n.choreName ?? undefined,
  transferId: n.transferId ? String(n.transferId) : undefined,
  hearted: n.hearted ?? undefined,
  message: n.message,
});

/** 서버 결산 주기(일 1 · 3 · 7) → 화면 값. 모르는 값이면 매주(7) */
export const toCyclePeriod = (value: number | null): CyclePeriod =>
  value === 1 || value === 3 || value === 7 ? value : 7;
