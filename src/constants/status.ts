import type { MemberStatus } from '@/types/member';
import { josa } from '@/utils/josa';

/**
 * 화면 이름 (쌩쌩 > 여유 > 지침). 코드 값은 공용 타입 그대로 두고 이름만 바꿈
 * relaxed = 쌩쌩, tired = 여유, unwilling = 지침
 */
export const STATUS_LABEL: Record<MemberStatus, string> = {
  relaxed: '쌩쌩',
  tired: '여유',
  unwilling: '지침',
};

/** 팝오버 순서: 쌩쌩 → 여유 → 지침 */
export const STATUS_LIST: MemberStatus[] = ['relaxed', 'tired', 'unwilling'];

/**
 * 상대 상세 말풍선
 * TODO: 디자이너에게 새 상태(쌩쌩·여유·지침)에 맞는 문구 받기. 아래는 이전 상태(여유·지침·고르기 싫음) 문구
 */
export const STATUS_BUBBLE: Record<MemberStatus, string> = {
  relaxed: '오늘은 여유 있어! 누구 짐 좀 덜어줄까?',
  tired: '오늘은 좀 지쳤어…',
  unwilling: '아무것도 고르기 싫어…',
};

/** 상태 알림 배너: 지침일 때만 보냄. 문구는 피그마 ② 플로우 예시("민지가 지쳤대요") */
export const STATUS_NOTICE: Record<'unwilling', (name: string) => string> = {
  unwilling: (name) => `${josa(name, '이/가')} 지쳤대요`,
};
