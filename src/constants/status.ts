import type { MemberStatus } from '@/types/member';
import { josa } from '@/utils/josa';

/** 화면 이름. 이름이 바뀌면 여기만 수정 */
export const STATUS_LABEL: Record<MemberStatus, string> = {
  relaxed: '여유',
  tired: '지침',
  unwilling: '고르기 싫음',
};

export const STATUS_LIST: MemberStatus[] = ['relaxed', 'tired', 'unwilling'];

/** 내 말풍선 (TODO: 지침 문구 디자인 확인) */
export const STATUS_BUBBLE: Record<MemberStatus, string> = {
  relaxed: '오늘은 여유 있어! 누구 짐 좀 덜어줄까?',
  tired: '오늘은 좀 지쳤어…',
  unwilling: '아무것도 고르기 싫어…',
};

/** 내 메인 알림 카드 제목 (TODO: 지침 문구 디자인 확인) */
export const STATUS_NOTICE: Record<Exclude<MemberStatus, 'relaxed'>, (name: string) => string> = {
  tired: (name) => `${josa(name, '이/가')} 지쳤대요`,
  unwilling: (name) => `${josa(name, '이/가')} 아무것도 고르기 싫대요`,
};
