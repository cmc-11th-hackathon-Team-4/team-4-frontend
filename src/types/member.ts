import type { Id } from './common';

/** 여유 / 지침 / 고르기 싫음 (V3-01 상태 선택, 캐릭터 표정) */
export type MemberStatus = 'relaxed' | 'tired' | 'unwilling';

export interface Member {
  id: Id;
  nickname: string;
  status: MemberStatus;
  /** 방장 여부 (S-01 그룹 생성자) */
  isHost: boolean;
}
