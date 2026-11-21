import type { CycleInfo } from '@/types/cycle';
import type { Id } from '@/types/common';
import { instance } from './instance';
import { API, toCyclePeriod } from './mainServer';
import { getHouse } from './onboarding';

/** V5-12 결산 주기 · 이번 기간 결산일 (GET /houses/{id}의 settlementCycle · currentPeriod) */
export async function getCycle(groupId: Id): Promise<CycleInfo> {
  const house = await getHouse(groupId);
  return {
    period: toCyclePeriod(house.settlementCycle),
    endDate: house.currentPeriod?.endDate ?? '',
  };
}

/** V5-14 이번 기간 늘리기 (방장): 1 · 3 · 7일. 구성원에게 알림 */
export async function extendCycle(groupId: Id, days: number): Promise<void> {
  await instance.patch(`${API}/houses/${groupId}/periods/current/extend`, { days });
}
