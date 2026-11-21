import { delay, newId, updateDb } from '@/mocks/db';
import type { Id } from '@/types/common';
import type { MemberStatus } from '@/types/member';
import { USE_MOCK } from './config';
import { instance } from './instance';

// TODO: 스웨거 확정되면 경로 맞추기
/** 상태 변경. 서버가 다른 구성원에게 상태 알림을 보냄 (여유는 알림 없음) */
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
      if (status === 'relaxed') return;
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
  await instance.patch(`/members/${memberId}/status`, { status });
}
