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

/** 상대 상세 말풍선 (UX 라이팅 확정) */
export const STATUS_BUBBLE: Record<MemberStatus, string> = {
  relaxed: '컨디션 최고예요. 뭐든 맡겨 주세요',
  tired: '그럭저럭 괜찮아요',
  unwilling: '아무것도 하기 싫어요',
};

/** 상태 알림 배너: 지침일 때만 보냄 (UX 라이팅 확정) */
export const STATUS_NOTICE = {
  title: (name: string) => `${josa(`${name}님`, '이/가')} 지쳤어요`,
  desc: (name: string) => `${name}님의 짐을 덜어줘 볼까요?`,
};
