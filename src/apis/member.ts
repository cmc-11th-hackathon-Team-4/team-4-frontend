import { delay, newId, updateDb } from '@/mocks/db';
import type { Id } from '@/types/common';
import type { MemberStatus } from '@/types/member';
import { USE_MOCK } from './config';
import { instance } from './instance';
import { API, toServerMood } from './mainServer';

/** 기분 변경. '지침'(unwilling)으로 바뀌면 다른 구성원에게 상태 알림 */
export async function updateStatus(memberId: Id, status: MemberStatus): Promise<void> {
  if (USE_MOCK) {
    await delay();
    updateDb((db) => {
      const member = db.group.members.find((m) => m.id === memberId);
      if (member) member.status = status;
      // 내가 보낸 이전 상태 알림은 지우고 새로 보냄
      db.notifications = db.notifications.filter(
        (n) => !(n.type === 'status' && n.fromId === memberId),
      );
      if (status !== 'unwilling') return;
      for (const other of db.group.members.filter((m) => m.id !== memberId)) {
        db.notifications.push({
          id: newId('n'),
          type: 'status',
          fromId: memberId,
          toId: other.id,
          status,
          createdAt: new Date().toISOString(),
        });
      }
    });
    return;
  }
  // '고르기 싫음'(NO_CHOICE)으로 바뀌면 서버가 구성원에게 MOOD_NO_CHOICE 알림을 보냄
  await instance.patch(`${API}/users/me/mood`, { mood: toServerMood(status) });
}
