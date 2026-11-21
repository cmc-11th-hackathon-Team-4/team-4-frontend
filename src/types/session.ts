import type { Id } from './common';

/** 로그인 없음: 그룹 생성·참여 시 저장되는 내 정보 */
export interface Session {
  memberId: Id;
  groupId: Id;
}
