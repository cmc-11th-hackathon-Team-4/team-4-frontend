import { delay, newId, readDb, updateDb } from '@/mocks/db';
import type { Id } from '@/types/common';
import type { AppNotification } from '@/types/notification';
import { USE_MOCK } from './config';
import { instance } from './instance';
import { API, type ServerNotification, toNotification } from './mainServer';

/** 내가 받거나 보낸 알림 전체 (오래된 순). 실서버는 받은 알림 최신 50개 (읽음 포함) */
export async function getNotifications(memberId: Id): Promise<AppNotification[]> {
  if (USE_MOCK) {
    await delay(100);
    return readDb().notifications.filter((n) => n.toId === memberId || n.fromId === memberId);
  }
  const { data } = await instance.get<{ notifications: ServerNotification[] }>(
    `${API}/notifications`,
    { params: { unreadOnly: false } },
  );
  return data.notifications.map((n) => toNotification(n, memberId)).reverse();
}

/** 하트 보내기: 내 짐을 덜어간 사람에게 (덜어감 알림 기준) */
export async function sendHeart(memberId: Id, notification: AppNotification): Promise<void> {
  if (USE_MOCK) {
    await delay();
    updateDb((db) =>
      db.notifications.push({
        id: newId('n'),
        type: 'heart',
        fromId: memberId,
        toId: notification.fromId,
        choreId: notification.choreId,
        createdAt: new Date().toISOString(),
      }),
    );
    return;
  }
  await instance.post(`${API}/transfers/${notification.transferId}/heart`);
}
