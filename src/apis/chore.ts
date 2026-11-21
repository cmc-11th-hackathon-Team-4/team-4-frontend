import { delay, newId, pushNotification, updateDb } from '@/mocks/db';
import type { Chore } from '@/types/chore';
import type { Id } from '@/types/common';
import type { ChoreRequest } from '@/types/request';
import { USE_MOCK } from './config';
import { instance } from './instance';

// TODO: 스웨거 확정되면 경로 맞추기
function findChore(chores: Chore[], choreId: Id) {
  const target = chores.find((c) => c.id === choreId);
  if (!target) throw new Error('chore not found');
  return target;
}

/** A · 덜어주기: 상대 짐을 바로 내 짐으로 + 원래 담당자에게 덜어감 알림 */
export async function takeChore(choreId: Id, memberId: Id): Promise<void> {
  if (USE_MOCK) {
    await delay();
    updateDb((db) => {
      const target = findChore(db.group.chores, choreId);
      const prevOwnerId = target.ownerId;
      target.ownerId = memberId;
      pushNotification(db, { type: 'take', fromId: memberId, toId: prevOwnerId, choreId });
    });
    return;
  }
  await instance.post(`/chores/${choreId}/take`, { memberId });
}

/** B · 짐 올리기: 내 짐을 상대에게 부탁 (상대가 받아야 넘어감) */
export async function requestChore(choreId: Id, fromId: Id, toId: Id): Promise<void> {
  if (USE_MOCK) {
    await delay();
    updateDb((db) => {
      const request: ChoreRequest = {
        id: newId('r'),
        choreId,
        fromId,
        toId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      db.requests.push(request);
      pushNotification(db, { type: 'request', fromId, toId, choreId });
    });
    return;
  }
  await instance.post(`/chores/${choreId}/requests`, { fromId, toId });
}

/** B · 부탁 응답: 받을게요(accept) → 내 짐으로 / 다음에(decline) → 짐은 그대로 */
export async function respondChoreRequest(requestId: Id, accept: boolean): Promise<void> {
  if (USE_MOCK) {
    await delay();
    updateDb((db) => {
      const request = db.requests.find((r) => r.id === requestId);
      if (!request || request.status !== 'pending') throw new Error('request not pending');
      request.status = accept ? 'accepted' : 'declined';
      if (accept) findChore(db.group.chores, request.choreId).ownerId = request.toId;
      pushNotification(db, {
        type: accept ? 'accept' : 'decline',
        fromId: request.toId,
        toId: request.fromId,
        choreId: request.choreId,
      });
    });
    return;
  }
  await instance.patch(`/chore-requests/${requestId}`, { accept });
}

/** C · 완료: 목록에서 제거 (결산용으로 done 처리) */
export async function completeChore(choreId: Id): Promise<void> {
  if (USE_MOCK) {
    await delay();
    updateDb((db) => {
      findChore(db.group.chores, choreId).done = true;
    });
    return;
  }
  await instance.patch(`/chores/${choreId}`, { done: true });
}

/** V5-12 집안일 목록 › 삭제 (부탁 중이던 요청도 함께 정리) */
export async function deleteChore(choreId: Id): Promise<void> {
  if (USE_MOCK) {
    await delay();
    updateDb((db) => {
      db.group.chores = db.group.chores.filter((c) => c.id !== choreId);
      db.requests = db.requests.filter((r) => r.choreId !== choreId);
    });
    return;
  }
  await instance.delete(`/chores/${choreId}`);
}

/** V5-13 집안일 추가: 추가한 사람이 담당자 */
export async function createChore(groupId: Id, ownerId: Id, name: string): Promise<Chore> {
  if (USE_MOCK) {
    await delay();
    const created: Chore = { id: newId('c'), name, ownerId, done: false };
    updateDb((db) => {
      db.group.chores.push(created);
    });
    return created;
  }
  const { data } = await instance.post<Chore>(`/groups/${groupId}/chores`, { name, ownerId });
  return data;
}
