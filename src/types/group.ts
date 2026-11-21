import type { Chore } from './chore';
import type { Id } from './common';
import type { Member } from './member';

/** 구성원 최대 인원 (레일 최대 4명, 초대 n/4) */
export const MAX_MEMBERS = 4;

export interface Group {
  id: Id;
  name: string;
  /** S-02 초대 코드, S-13 코드로 참여 */
  inviteCode: string;
  members: Member[];
  chores: Chore[];
}
