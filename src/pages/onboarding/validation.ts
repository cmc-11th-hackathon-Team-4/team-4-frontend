/** 플로우 ① 입력 규칙 (기능명세서 기준, "제안" 값은 확정 시 이 파일만 수정) */
export const INPUT_RULES = {
  /** P-01 프로필 이름 1~10자 */
  profileName: { min: 1, max: 10 },
  /** S-01 집 이름 1~15자 (제안) */
  houseName: { min: 1, max: 15 },
  /** S-04 직접 추가 1~20자 (제안) */
  choreName: { min: 1, max: 20 },
} as const;

/** 앞뒤 공백 제외 길이가 규칙 안이면 true. 공백만 입력은 false */
export function isValidText(value: string, rule: { min: number; max: number }) {
  const length = value.trim().length;
  return length >= rule.min && length <= rule.max;
}

/** S-13 초대 코드: 영문 대문자 · 숫자 6자리 (소문자는 대문자로 바꿔 받음) */
export const INVITE_CODE_LENGTH = 6;

/** 입력값을 초대 코드 형식으로 정리: 대문자로 바꾸고 영문 · 숫자 외 문자 제거, 6자리까지 */
export function normalizeInviteCode(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, INVITE_CODE_LENGTH);
}
