/* eslint-disable @typescript-eslint/no-unused-vars -- TODO(API): 목 단계라 인자 미사용. API 연결 시 삭제 */
import type { Id } from '@/types/common';
import type { CarryOverItem, NextCycle, WeeklySettlement } from '@/types/weekly';
import { mockWeeklyApi } from './weeklyMock';

// TODO(API): 백엔드 확정 후 instance로 교체. 경로는 임시
// 예: instance.get<WeeklySettlement>(`/groups/${groupId}/settlement`).then((res) => res.data)

/** S-08 ~ S-11 결산 조회 */
export function getSettlement(_groupId: Id): Promise<WeeklySettlement> {
  return mockWeeklyApi.getSettlement();
}

/** S-10 내 못 한 일 이월·덜어내기 */
export function postCarryOver(_groupId: Id, memberId: Id, items: CarryOverItem[]) {
  return mockWeeklyApi.carryOver(memberId, items);
}

/** S-12 다음 주기 배분 조회 */
export function getNextCycle(_groupId: Id): Promise<NextCycle> {
  return mockWeeklyApi.getNextCycle();
}

/** S-12 다시 나누기 (방장) */
export function postReassign(_groupId: Id): Promise<NextCycle> {
  return mockWeeklyApi.reassign();
}

/** S-12 이대로 시작하기 (방장) */
export function postStartNextCycle(_groupId: Id) {
  return mockWeeklyApi.start();
}

/** 시연용 기간 종료 (V5-12 시연 메뉴, 방장) */
export function postEndCycle(_groupId: Id) {
  return mockWeeklyApi.endCycle();
}
