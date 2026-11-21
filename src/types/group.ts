import type { Chore } from './chore';
import type { Id } from './common';
import type { Member } from './member';

/** 구성원 최대 인원 (본인 포함 5명: Swagger 정원 HOUSE-409-1 "정원(5명)" · 서버 maxMemberCount 기준) */
export const MAX_MEMBERS = 5;

export interface Group {
  id: Id;
  name: string;
  /** S-02 초대 코드, S-13 코드로 참여 */
  inviteCode: string;
  members: Member[];
  chores: Chore[];
}
