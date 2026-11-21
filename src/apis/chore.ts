import { delay, mockDb } from '@/mocks/db';
import type { Chore } from '@/types/chore';
import type { Id } from '@/types/common';
import { USE_MOCK } from './config';
import { instance } from './instance';

// TODO: 스웨거 확정되면 경로 맞추기
function findChore(choreId: Id) {
  const target = mockDb.group.chores.find((c) => c.id === choreId);
  if (!target) throw new Error('chore not found');
  return target;
}

/** 덜어가기: 담당자를 나로 변경 */
export async function takeChore(choreId: Id, memberId: Id): Promise<void> {
  if (USE_MOCK) {
    await delay();
    findChore(choreId).ownerId = memberId;
    return;
  }
  await instance.post(`/chores/${choreId}/take`, { memberId });
}

/** 되돌리기: 원래 담당자에게 돌려줌 */
export async function undoTakeChore(choreId: Id, prevOwnerId: Id): Promise<void> {
  if (USE_MOCK) {
    await delay();
    findChore(choreId).ownerId = prevOwnerId;
    return;
  }
  await instance.delete(`/chores/${choreId}/take`, { data: { ownerId: prevOwnerId } });
}

export async function toggleChoreDone(choreId: Id, done: boolean): Promise<void> {
  if (USE_MOCK) {
    await delay();
    findChore(choreId).done = done;
    return;
  }
  await instance.patch(`/chores/${choreId}`, { done });
}

export async function createChore(groupId: Id, ownerId: Id, name: string): Promise<Chore> {
  if (USE_MOCK) {
    await delay();
    const created: Chore = { id: `c${Date.now()}`, name, ownerId, done: false };
    mockDb.group.chores.push(created);
    return created;
  }
  const { data } = await instance.post<Chore>(`/groups/${groupId}/chores`, { name, ownerId });
  return data;
}
