import type { Id } from './common';
import type { CharacterId } from './member';

// 서버 응답(Swagger · 백엔드 DTO)을 화면에서 쓰기 좋게 바꾼 ③ 전용 타입
// id는 공용 Id(string)로, characterType 'CHARACTER_1'은 CharacterId '1'로 변환

/** 기간 상태: READY 배분 준비 / ACTIVE 진행 중 / ENDED 종료(결산 가능) */
export type PeriodStatus = 'READY' | 'ACTIVE' | 'ENDED';

/** 기간 (PeriodResponse) */
export interface WeeklyPeriod {
  id: Id;
  /** 몇 회차 */
  round: number;
  /** YYYY-MM-DD */
  startDate: string;
  endDate: string;
  status: PeriodStatus;
}

export interface WeeklyMember {
  id: Id;
  nickname: string;
  character: CharacterId;
}

/** S-08 숫자 3칸 (Summary). helpedCount = 덜어가기 + 받아준 짐 올리기 */
export interface SettlementSummary {
  totalCount: number;
  doneCount: number;
  undoneCount: number;
  helpedCount: number;
}

/** S-09 집안일 행 (Settlement Chore) */
export interface SettlementChore {
  assignmentId: Id;
  name: string;
  done: boolean;
  /** 최종 담당자 */
  assignee: WeeklyMember;
  /** 최초 담당자와 다르면 덜어준 사람 ("OO가 덜어줌"), 같으면 null */
  helpedBy: { id: Id; nickname: string } | null;
}

/** S-10 이월 선택: KEEP 다음 주로(내가 이어서 맡음) / RELEASE 덜어내기(다음 랜덤 배분으로) */
export type CarryChoice = 'KEEP' | 'RELEASE';

/** S-10 내 못 한 일 (MyUndone) */
export interface MyUndone {
  assignmentId: Id;
  name: string;
  /** 저장된 선택. 아직 안 골랐으면 null (서버는 KEEP으로 취급) */
  carryChoice: CarryChoice | null;
}

/** S-11 덜어준 횟수 · 받은 하트 (Ranking) */
export interface KindnessRank extends WeeklyMember {
  helpedCount: number;
  receivedHeartCount: number;
}

/** 결산 상세 (S-08 ~ S-11, GET /periods/{periodId}/settlement) */
export interface WeeklySettlement {
  period: WeeklyPeriod;
  members: WeeklyMember[];
  summary: SettlementSummary;
  chores: SettlementChore[];
  myUndone: MyUndone[];
  ranking: KindnessRank[];
  /** 배려왕 (동점이면 여러 명, 전원 0번이면 빈 배열) */
  kingIds: Id[];
  /** 다음 기간이 이미 시작됐으면 이월 저장 불가 */
  nextPeriodStarted: boolean;
}

/** 결산 탭 상태: 최근 기간(홈 조회 period)이 ENDED일 때만 settlement가 있음 */
export interface WeeklyState {
  /** 시작 전이면 null */
  period: WeeklyPeriod | null;
  settlement: WeeklySettlement | null;
}

export interface CarryOverChoice {
  assignmentId: Id;
  choice: CarryChoice;
}

/** S-12 사람별 다음 주기 짐 (NextPeriodResponse.Member) */
export interface NextPeriodMember extends WeeklyMember {
  isHost: boolean;
  isMe: boolean;
  /** 이월된 짐이 맨 앞 */
  chores: { id: Id; name: string; carriedOver: boolean }[];
}

/** S-12 다음 주기 배분 (GET · POST /houses/{houseId}/periods/next) */
export interface NextPeriod {
  /** 방장이 아직 안 만들었으면 false ("OO가 다음 주를 준비 중이에요") */
  prepared: boolean;
  period: WeeklyPeriod | null;
  totalCount: number;
  members: NextPeriodMember[];
}

/** 우리 집 구성원 (방장 · 나 구분, GET /houses/{houseId}) */
export interface WeeklyHouseMember extends WeeklyMember {
  isHost: boolean;
  isMe: boolean;
}
