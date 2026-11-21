import type { Chore } from './chore';
import type { Id } from './common';
import type { Member } from './member';

/** 주기 진행 상태. 폴링으로 확인해 ended면 두 폰 모두 S-08로 이동 */
export type CycleStatus = 'ongoing' | 'ended';

/** 덜어오기 기록 (S-11 배려왕 집계). fromMemberId의 짐을 toMemberId가 가져감 */
export interface Relief {
  id: Id;
  choreId: Id;
  fromMemberId: Id;
  toMemberId: Id;
}

/** 끝난 주기의 결산 (S-08 ~ S-11) */
export interface WeeklySettlement {
  /** 주기 종료 시점의 집안일. done으로 한 일 / 못 한 일 구분 */
  chores: Chore[];
  members: Member[];
  reliefs: Relief[];
}

/** S-10 못 한 일 처리. 방장은 이월·삭제, 구성원은 본인 짐 이월만 */
export type CarryOverAction = 'carry' | 'delete';

export interface CarryOverItem {
  choreId: Id;
  action: CarryOverAction;
}
