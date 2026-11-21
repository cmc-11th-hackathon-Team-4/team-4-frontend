import { delay, newId, updateDb } from '@/mocks/db';
import type { Chore } from '@/types/chore';
import type { Id } from '@/types/common';
import { USE_MOCK } from './config';
import { instance } from './instance';

// TODO: 스웨거 확정되면 경로 맞추기
function findChore(chores: Chore[], choreId: Id) {
  const target = chores.find((c) => c.id === choreId);
  if (!target) throw new Error('chore not found');
  return target;
}

/** 덜어가기: 담당자를 나로 변경 + 원래 담당자에게 덜어감 알림 */
export async function takeChore(choreId: Id, memberId: Id): Promise<void> {
  if (USE_MOCK) {
    await delay();
    updateDb((db) => {
      const target = findChore(db.group.chores, choreId);
      const prevOwnerId = target.ownerId;
      target.ownerId = memberId;
      db.notifications.push({
        id: newId('n'),
        type: 'take',
        fromId: memberId,
        toId: prevOwnerId,
        choreId,
        createdAt: new Date().toISOString(),
      });
    });
    return;
  }
  await instance.post(`/chores/${choreId}/take`, { memberId });
}

/** 되돌리기: 원래 담당자에게 돌려주고 덜어감 알림 취소 */
export async function undoTakeChore(choreId: Id, prevOwnerId: Id): Promise<void> {
  if (USE_MOCK) {
    await delay();
    updateDb((db) => {
      findChore(db.group.chores, choreId).ownerId = prevOwnerId;
      db.notifications = db.notifications.filter(
        (n) => !(n.type === 'take' && n.choreId === choreId && n.toId === prevOwnerId),
      );
    });
    return;
  }
  await instance.delete(`/chores/${choreId}/take`, { data: { ownerId: prevOwnerId } });
}

export async function toggleChoreDone(choreId: Id, done: boolean): Promise<void> {
  if (USE_MOCK) {
    await delay();
    updateDb((db) => {
      findChore(db.group.chores, choreId).done = done;
    });
    return;
  }
  await instance.patch(`/chores/${choreId}`, { done });
}

export async function createChore(groupId: Id, ownerId: Id, name: string): Promise<Chore> {
  if (USE_MOCK) {
    await delay();
    const created: Chore = { id: newId('c'), name, ownerId, done: false };
    updateDb((db) => db.group.chores.push(created));
    return created;
  }
  const { data } = await instance.post<Chore>(`/groups/${groupId}/chores`, { name, ownerId });
  return data;
}
