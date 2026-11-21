import { delay, newId, readDb, updateDb } from '@/mocks/db';
import type { Id } from '@/types/common';
import type { AppNotification } from '@/types/notification';
import { USE_MOCK } from './config';
import { instance } from './instance';

// TODO: 스웨거 확정되면 경로 맞추기
/** 내가 받거나 보낸 알림 전체 (오래된 순) */
export async function getNotifications(memberId: Id): Promise<AppNotification[]> {
  if (USE_MOCK) {
    await delay(100);
    return readDb().notifications.filter((n) => n.toId === memberId || n.fromId === memberId);
  }
  const { data } = await instance.get<AppNotification[]>(`/members/${memberId}/notifications`);
  return data;
}

/** 하트 보내기: 내 짐을 덜어간 사람에게 */
export async function sendHeart(fromId: Id, toId: Id, choreId: Id): Promise<void> {
  if (USE_MOCK) {
    await delay();
    updateDb((db) =>
      db.notifications.push({
        id: newId('n'),
        type: 'heart',
        fromId,
        toId,
        choreId,
        createdAt: new Date().toISOString(),
      }),
    );
    return;
  }
  await instance.post('/hearts', { fromId, toId, choreId });
}
