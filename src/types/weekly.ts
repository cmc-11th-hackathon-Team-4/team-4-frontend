import type { Chore } from './chore';
import type { Id } from './common';
import type { Member } from './member';

/** 주기 진행 상태. 폴링으로 확인해 ended면 두 폰 모두 S-08로 이동 */
export type CycleStatus = 'ongoing' | 'ended';

/** 덜어오기 기록 (S-09 "OO가 덜어줌", S-11 배려왕). fromMemberId의 짐을 toMemberId가 가져감 */
export interface Relief {
  id: Id;
  choreId: Id;
  fromMemberId: Id;
  toMemberId: Id;
}

/** 결산 (S-08 ~ S-11). ongoing이면 S-08에 "D-n" 빈 화면 */
export interface WeeklySettlement {
  status: CycleStatus;
  /** 주기 시작·끝 날짜 (YYYY-MM-DD) */
  startDate: string;
  endDate: string;
  /** 주기 종료 시점의 집안일. done으로 한 일 / 못 한 일 구분 */
  chores: Chore[];
  members: Member[];
  reliefs: Relief[];
  /** 구성원별 이번 기간에 받은 하트 수 (S-11 배려왕 문구) */
  hearts: Record<Id, number>;
}

/** S-10 못 한 일 처리. carry 다음 주로(내가 이어서 맡음) / release 덜어내기(다음 랜덤 배분에 다시 들어감) */
export type CarryOverAction = 'carry' | 'release';

export interface CarryOverItem {
  choreId: Id;
  action: CarryOverAction;
}

/** S-12 다음 주기 배분 */
export interface NextCycle {
  startDate: string;
  endDate: string;
  /** 다음 주기 집안일. ownerId로 각자 몫 구분 */
  chores: Chore[];
  /** S-10에서 다음 주로 넘긴 집안일 ("이월" 표시) */
  carriedChoreIds: Id[];
  /** 방장이 "이대로 시작하기"를 누르면 true. 구성원은 폴링으로 확인 */
  started: boolean;
}
