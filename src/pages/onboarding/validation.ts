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
