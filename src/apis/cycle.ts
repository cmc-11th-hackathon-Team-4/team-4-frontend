import { delay, pushNotification, readDb, updateDb } from '@/mocks/db';
import type { CycleInfo } from '@/types/cycle';
import type { Id } from '@/types/common';
import { USE_MOCK } from './config';
import { instance } from './instance';

// TODO: 스웨거 확정되면 경로 맞추기
/**
 * V5-12 시연용 · 기간 종료하기 (방장)
 * 다른 구성원에게 기간 종료 알림 → 홈 배너 탭하면 S-08 결산 홈
 * TODO(③): ③ 목데이터(weeklyMock)는 항상 '종료' 상태라 결산 데이터는 아직 연결 안 됨
 */
export async function endCycle(groupId: Id, memberId: Id): Promise<void> {
  if (USE_MOCK) {
    await delay();
    updateDb((db) => {
      for (const other of db.group.members.filter((m) => m.id !== memberId)) {
        pushNotification(db, { type: 'cycleEnd', fromId: memberId, toId: other.id });
      }
    });
    return;
  }
  await instance.post(`/groups/${groupId}/cycles/end`);
}

/** V5-12 결산 주기 · 이번 기간 결산일 */
export async function getCycle(groupId: Id): Promise<CycleInfo> {
  if (USE_MOCK) {
    await delay(100);
    return readDb().cycle;
  }
  const { data } = await instance.get<CycleInfo>(`/groups/${groupId}/cycle`);
  return data;
}

/** V5-14 이번 기간 늘리기 (방장): 결산일을 바꾸고 구성원에게 알림 */
export async function extendCycle(groupId: Id, memberId: Id, endDate: string): Promise<void> {
  if (USE_MOCK) {
    await delay();
    updateDb((db) => {
      db.cycle.endDate = endDate;
      for (const other of db.group.members.filter((m) => m.id !== memberId)) {
        pushNotification(db, { type: 'cycleExtend', fromId: memberId, toId: other.id, endDate });
      }
    });
    return;
  }
  await instance.patch(`/groups/${groupId}/cycle`, { endDate });
}
