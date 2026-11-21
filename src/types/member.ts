import type { Id } from './common';

/** 여유 / 지침 / 고르기 싫음 (V3-01 상태 선택, 캐릭터 표정) */
export type MemberStatus = 'relaxed' | 'tired' | 'unwilling';

/** 프로필 캐릭터 (P-01, 5종 중 선택). 값 형식은 서버 확정 후 조정 */
export type CharacterId = string;

/** 선택 가능한 캐릭터 수 (P-01 캐릭터 5종, 확정) */
export const CHARACTER_COUNT = 5;

export interface Member {
  id: Id;
  /** 프로필 이름 (P-01, 1~10자) */
  nickname: string;
  character: CharacterId;
  status: MemberStatus;
  /** 방장 여부 (S-01 그룹 생성자) */
  isHost: boolean;
}
