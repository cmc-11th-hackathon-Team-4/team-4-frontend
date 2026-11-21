import type { Id } from '@/types/common';
import type { AppNotification } from '@/types/notification';
import { instance } from './instance';
import { API, type ServerNotification, toNotification } from './mainServer';

/** 내가 받은 알림 최신 50개 (읽음 포함, 오래된 순) */
export async function getNotifications(memberId: Id): Promise<AppNotification[]> {
  const { data } = await instance.get<{ notifications: ServerNotification[] }>(
    `${API}/notifications`,
    { params: { unreadOnly: false } },
  );
  return data.notifications.map((n) => toNotification(n, memberId)).reverse();
}

/** 하트 보내기: 내 짐을 덜어간 사람에게 (덜어감 알림 기준) */
export async function sendHeart(notification: AppNotification): Promise<void> {
  await instance.post(`${API}/transfers/${notification.transferId}/heart`);
}
