import { delay, pushNotification, readDb, updateDb } from '@/mocks/db';
import type { CycleInfo } from '@/types/cycle';
import type { Id } from '@/types/common';
import { addDays } from '@/utils/date';
import { USE_MOCK } from './config';
import { instance } from './instance';
import { API, toCyclePeriod } from './mainServer';
import { getHouse } from './onboarding';

/**
 * V5-12 시연용 · 기간 종료하기 (방장): 목데이터에서 구성원 알림만 만듦
 * 실서버는 ③ postEndPeriod(POST /periods/current/end)가 종료 + PERIOD_ENDED 알림까지 처리 → 여기선 할 일 없음
 */
export async function endCycle(memberId: Id): Promise<void> {
  if (!USE_MOCK) return;
  await delay();
  updateDb((db) => {
    for (const other of db.group.members.filter((m) => m.id !== memberId)) {
      pushNotification(db, { type: 'cycleEnd', fromId: memberId, toId: other.id });
    }
  });
}

/** V5-12 결산 주기 · 이번 기간 결산일 (GET /houses/{id}의 settlementCycle · currentPeriod) */
export async function getCycle(groupId: Id): Promise<CycleInfo> {
  if (USE_MOCK) {
    await delay(100);
    return readDb().cycle;
  }
  const house = await getHouse(groupId);
  return {
    period: toCyclePeriod(house.settlementCycle),
    endDate: house.currentPeriod?.endDate ?? '',
  };
}

/** V5-14 이번 기간 늘리기 (방장): 1 · 3 · 7일. 구성원에게 알림 */
export async function extendCycle(groupId: Id, memberId: Id, days: number): Promise<void> {
  if (USE_MOCK) {
    await delay();
    updateDb((db) => {
      const endDate = addDays(db.cycle.endDate, days);
      db.cycle.endDate = endDate;
      for (const other of db.group.members.filter((m) => m.id !== memberId)) {
        pushNotification(db, { type: 'cycleExtend', fromId: memberId, toId: other.id, endDate });
      }
    });
    return;
  }
  await instance.patch(`${API}/houses/${groupId}/periods/current/extend`, { days });
}
